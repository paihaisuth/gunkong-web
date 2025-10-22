import * as React from 'react'
import { ShIcon } from './icon'
import { ShLabel } from './label'

import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<'input'> {
    leftIcon?: string
    rightIcon?: string
    label?: string
    onRightIconClick?: () => void
    leftIconClassName?: string
    rightIconClassName?: string
}

function ShInput({
    className,
    type,
    leftIcon,
    rightIcon,
    onRightIconClick,
    label,
    leftIconClassName,
    rightIconClassName,
    ...props
}: Props) {
    return (
        <div>
            <ShLabel data-slot="label" className="mb-2 ml-2">
                {label}
            </ShLabel>
            <div className="relative">
                {leftIcon && (
                    <ShIcon
                        name={leftIcon}
                        className={cn(
                            'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none',
                            leftIconClassName
                        )}
                    />
                )}

                <input
                    type={type}
                    data-slot="input"
                    className={cn(
                        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        leftIcon ? 'pl-10' : 'px-3',
                        rightIcon ? 'pr-10' : leftIcon ? '' : 'px-3',
                        className
                    )}
                    {...props}
                />

                {rightIcon && (
                    <button
                        type="button"
                        onClick={onRightIconClick}
                        className={cn(
                            'absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors',
                            onRightIconClick
                                ? 'cursor-pointer p-1 rounded-md hover:bg-muted/50'
                                : 'pointer-events-none'
                        )}
                        disabled={!onRightIconClick}
                    >
                        <ShIcon
                            name={rightIcon}
                            className={cn('h-4 w-4', rightIconClassName)}
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export { ShInput }
