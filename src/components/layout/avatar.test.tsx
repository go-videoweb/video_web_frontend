import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Avatar } from './shell'

it('旧头像加载失败不阻止新头像预览', () => {
  const { container, rerender } = render(<Avatar name="张三" src="/missing-avatar.png" />)
  fireEvent.error(container.querySelector('img')!)
  expect(screen.getByText('张')).toBeVisible()
  rerender(<Avatar name="张三" src="blob:new-avatar" />)
  expect(container.querySelector('img')).toHaveAttribute('src', 'blob:new-avatar')
})
