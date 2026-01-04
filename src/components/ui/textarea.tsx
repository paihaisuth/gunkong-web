import * as React from 'react'
import { cn } from '@/lib/utils'

interface ShTextareaProps extends React.ComponentProps<'textarea'> {
    rows?: number
}

const ShTextarea = React.forwardRef<HTMLTextAreaElement, ShTextareaProps>(
    ({ className, rows = 3, ...props }, ref) => (
        <textarea
            ref={ref}
            rows={rows}
            className={cn(
                'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm',
                className
            )}
            {...props}
        />
    )
)

ShTextarea.displayName = 'ShTextarea'

export { ShTextarea }
