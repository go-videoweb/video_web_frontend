import * as Tooltip from '@radix-ui/react-tooltip'
import type { ComponentProps } from 'react'
import { Button } from './button'

/** 图标工具同时提供可访问名称与悬停提示。 */
export function IconButton({ label, ...props }: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} {...props} />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="tooltip" sideOffset={8}>
          {label}
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
