import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleCheck,
  CloudUpload,
  FileVideo,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/features/auth/session'
import { getUser } from '@/features/users/api'
import { createVideo, uploadMedia } from './api'
import { config } from '@/lib/config'
import { errorMessage } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { LoginRequired } from '@/components/states'

const schema = z.object({
  title: z.string().trim().min(1, '请输入视频标题').max(100, '标题最多 100 字'),
  description: z.string().max(2000),
  category: z.string().min(1),
  tags: z.string().max(200),
})
const draftSchema = z.object({
  userId: z.string(),
  videoId: z.string().regex(/^[1-9]\d*$/),
  title: z.string(),
  videoSent: z.boolean(),
  coverSent: z.boolean(),
})
type Draft = z.infer<typeof draftSchema>
function readDraft(userId: string): Draft | null {
  try {
    const result = draftSchema.parse(
      JSON.parse(localStorage.getItem(`vw.upload.${userId}`) || 'null'),
    )
    return result.userId === userId ? result : null
  } catch {
    return null
  }
}

/** 投稿按已创建 videoId 恢复，文件重新选择，不重复创建元信息。 */
export function UploadPage() {
  const current = useSession()
  return (
    <div className="page upload-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">创作中心</div>
          <h1>
            分享你的视角<span className="heading-dot">.</span>
          </h1>
        </div>
      </div>
      {current ? (
        <UploadForm key={current.userId} userId={current.userId} />
      ) : (
        <LoginRequired title="登录后发布你的作品" />
      )}
    </div>
  )
}

function UploadForm({ userId }: { userId: string }) {
  const user = useQuery({
    queryKey: ['user', userId],
    queryFn: ({ signal }) => getUser(userId, signal),
  })
  const [draft, setDraft] = useState<Draft | null>(() => readDraft(userId))
  const [video, setVideo] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)
  const [busy, setBusy] = useState<'info' | 'file' | 'cover' | null>(null)
  const [error, setError] = useState('')
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: config.categories[0] || '科技',
      tags: '',
    },
  })
  function save(value: Draft) {
    setDraft(value)
    try {
      localStorage.setItem(`vw.upload.${userId}`, JSON.stringify(value))
    } catch {
      toast.warning('浏览器无法保存恢复记录，请保持此页面打开')
    }
  }
  const create = form.handleSubmit(async (values) => {
    if (draft || busy) return
    setBusy('info')
    setError('')
    try {
      const videoId = await createVideo(userId, {
        title: values.title,
        description: values.description,
        classes: [values.category],
        tags: values.tags
          .split(/[,，]/)
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 8),
        publisherName: user.data?.userName || '',
      })
      save({ userId, videoId, title: values.title, videoSent: false, coverSent: false })
      toast.success('元信息已保存')
    } catch (cause) {
      setError(`${errorMessage(cause)}。若连接中断，请先确认服务端结果，避免重复创建。`)
    } finally {
      setBusy(null)
    }
  })
  async function send(kind: 'file' | 'cover') {
    const file = kind === 'file' ? video : cover
    if (!file || !draft || busy) return
    setBusy(kind)
    setError('')
    try {
      await uploadMedia(userId, draft.videoId, file, kind)
      save({ ...draft, [kind === 'file' ? 'videoSent' : 'coverSent']: true })
      toast.success(kind === 'file' ? '视频已提交处理' : '封面已上传')
    } catch (cause) {
      setError(`${errorMessage(cause)}。已保留视频 ID；请确认结果后再决定是否重新提交文件。`)
    } finally {
      setBusy(null)
    }
  }
  const stages = [
    { title: '填写元信息', done: !!draft },
    { title: '提交视频', done: !!draft?.videoSent },
    { title: '上传封面', done: !!draft?.coverSent },
  ]
  return (
    <div className="upload-workspace">
      <ol className="upload-steps">
        {stages.map((stage, index) => (
          <li key={stage.title} className={stage.done ? 'complete' : ''}>
            <span>{stage.done ? <Check size={16} /> : index + 1}</span>
            {stage.title}
          </li>
        ))}
      </ol>
      {error && (
        <p className="form-error upload-error" role="alert">
          {error}
        </p>
      )}
      {!draft ? (
        <form className="form-stack upload-metadata" onSubmit={create}>
          <h2>关于这部视频</h2>
          <label>
            视频标题
            <input {...form.register('title')} placeholder="给作品起一个名字" />
            {form.formState.errors.title && (
              <span className="field-error">{form.formState.errors.title.message}</span>
            )}
          </label>
          <label>
            简介
            <textarea
              {...form.register('description')}
              rows={4}
              placeholder="讲讲创作背后的故事…"
            />
            {form.formState.errors.description && (
              <span className="field-error">{form.formState.errors.description.message}</span>
            )}
          </label>
          <div className="form-columns">
            <label>
              频道
              <select {...form.register('category')}>
                {config.categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              标签
              <input {...form.register('tags')} placeholder="摄影，自然，生活" />
              {form.formState.errors.tags && (
                <span className="field-error">{form.formState.errors.tags.message}</span>
              )}
            </label>
          </div>
          <Button type="submit" disabled={busy !== null || !user.data}>
            {busy === 'info' ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}保存并继续
          </Button>
        </form>
      ) : (
        <>
          <div className="saved-metadata">
            <CircleCheck size={22} />
            <div>
              <h2>{draft.title}</h2>
              <span>视频 ID · {draft.videoId}</span>
            </div>
          </div>
          <div className="upload-files">
            <section>
              <h3>
                <FileVideo size={20} />
                视频文件
              </h3>
              <label className="upload-drop">
                <CloudUpload size={34} />
                <strong>{video?.name || '选择视频文件'}</strong>
                <span>
                  {video
                    ? `${(video.size / 1024 / 1024).toFixed(1)} MB`
                    : 'MP4、WebM · 最大 256 MB'}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  disabled={!!busy || draft.videoSent}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (
                      !['video/mp4', 'video/webm'].includes(file.type) ||
                      file.size > 256 * 1024 * 1024
                    ) {
                      toast.error('请选择 256 MB 以内的 MP4 或 WebM 视频')
                      return
                    }
                    setVideo(file)
                  }}
                />
              </label>
              <Button
                disabled={!video || !!busy || draft.videoSent}
                onClick={() => {
                  void send('file')
                }}
              >
                {busy === 'file' ? (
                  <LoaderCircle className="animate-spin" />
                ) : draft.videoSent ? (
                  <Check />
                ) : (
                  <CloudUpload />
                )}
                {draft.videoSent ? '已提交处理' : '提交视频'}
              </Button>
            </section>
            <section>
              <h3>
                <ImagePlus size={20} />
                视频封面
              </h3>
              <label className="upload-drop">
                <ImagePlus size={34} />
                <strong>{cover?.name || '选择封面图片'}</strong>
                <span>JPG、PNG · 最大 5 MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  disabled={!!busy || draft.coverSent}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    if (
                      !['image/jpeg', 'image/png'].includes(file.type) ||
                      file.size > 5 * 1024 * 1024
                    ) {
                      toast.error('请选择 5 MB 以内的 JPG 或 PNG')
                      return
                    }
                    setCover(file)
                  }}
                />
              </label>
              <Button
                disabled={!cover || !!busy || draft.coverSent}
                variant="outline"
                onClick={() => {
                  void send('cover')
                }}
              >
                {busy === 'cover' ? (
                  <LoaderCircle className="animate-spin" />
                ) : draft.coverSent ? (
                  <Check />
                ) : (
                  <CloudUpload />
                )}
                {draft.coverSent ? '封面已上传' : '上传封面'}
              </Button>
            </section>
          </div>
          {draft.videoSent && (
            <div className="submission-result">
              <CircleCheck size={24} />
              <div>
                <strong>视频已提交处理</strong>
                <p>处理完成后即可播放。</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/watch/$videoId" params={{ videoId: draft.videoId }}>
                  查看视频
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
          {draft.videoSent && draft.coverSent && (
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem(`vw.upload.${userId}`)
                setDraft(null)
                setVideo(null)
                setCover(null)
                form.reset()
              }}
            >
              <RotateCcw />
              开始新的投稿
            </Button>
          )}
        </>
      )}
    </div>
  )
}
