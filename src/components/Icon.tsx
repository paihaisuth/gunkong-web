import React, { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

interface IconProps {
    name: string
    size?: number | string
    strokeWidth?: number | string
    className?: HTMLAttributes<HTMLElement>['className']
}

export function ShIcon({
    name,
    size = 24,
    strokeWidth = 2,
    className,
}: IconProps) {
    const convertToPascalCase = (str: string) => {
        return str
            .split('-')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('')
    }

    const pascalCaseName = convertToPascalCase(name)

    const IconComponent =
        (LucideIcons as any)[pascalCaseName] || LucideIcons.AlertCircle

    if (
        process.env.NODE_ENV === 'development' &&
        !(LucideIcons as any)[pascalCaseName]
    ) {
        console.warn(
            `Icon "${name}" (${pascalCaseName}) not found in lucide-react, using AlertCircle fallback`
        )
    }

    return (
        <IconComponent
            size={size}
            strokeWidth={strokeWidth}
            className={cn(className)}
        />
    )
}
