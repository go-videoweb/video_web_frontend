import { z } from 'zod'
const bytes = (value: string) => new TextEncoder().encode(value).length

/** 密码校验按后端 UTF-8 字节限制，不裁剪用户输入。 */
export const passwordRule = z
  .string()
  .refine((value) => bytes(value) >= 6 && bytes(value) <= 72, '密码需为 6–72 字节')
/** 邮箱和验证码保持与服务端规范化和字符串校验一致。 */
export const emailRule = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('请输入有效邮箱').refine((value) => bytes(value) <= 100, '邮箱不能超过 100 字节'))
export const codeRule = z
  .string()
  .trim()
  .regex(/^\d{6}$/, '请输入 6 位数字验证码')
