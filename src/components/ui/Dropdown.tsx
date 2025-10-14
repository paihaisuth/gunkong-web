'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownItem {
    type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'label' | 'sub'
    label?: string
    value?: string
    checked?: boolean
    disabled?: boolean
    inset?: boolean
    variant?: 'default' | 'destructive'
    shortcut?: string
    icon?: React.ReactNode
    onClick?: () => void
    items?: DropdownItem[] // For sub-menus
}

interface DropdownProps {
    trigger: React.ReactNode
    items: DropdownItem[]
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
    className?: string
    onValueChange?: (value: string) => void
    radioValue?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const renderDropdownItem = (
    item: DropdownItem,
    index: number,
    radioValue?: string,
    onValueChange?: (value: string) => void
) => {
    const key = `item-${index}-${item.value || item.label}`

    switch (item.type) {
        case 'separator':
            return (
                <DropdownMenuPrimitive.Separator
                    key={key}
                    className="bg-border -mx-1 my-1 h-px"
                />
            )

        case 'label':
            return (
                <DropdownMenuPrimitive.Label
                    key={key}
                    data-inset={item.inset}
                    className={cn(
                        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8'
                    )}
                >
                    {item.label}
                </DropdownMenuPrimitive.Label>
            )

        case 'checkbox':
            return (
                <DropdownMenuPrimitive.CheckboxItem
                    key={key}
                    className={cn(
                        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    )}
                    checked={item.checked}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                >
                    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        <DropdownMenuPrimitive.ItemIndicator>
                            <CheckIcon className="size-4" />
                        </DropdownMenuPrimitive.ItemIndicator>
                    </span>
                    {item.icon}
                    {item.label}
                    {item.shortcut && (
                        <span className="text-muted-foreground ml-auto text-xs tracking-widest">
                            {item.shortcut}
                        </span>
                    )}
                </DropdownMenuPrimitive.CheckboxItem>
            )

        case 'radio':
            return (
                <DropdownMenuPrimitive.RadioItem
                    key={key}
                    value={item.value || ''}
                    className={cn(
                        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    )}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                >
                    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        <DropdownMenuPrimitive.ItemIndicator>
                            <CircleIcon className="size-2 fill-current" />
                        </DropdownMenuPrimitive.ItemIndicator>
                    </span>
                    {item.icon}
                    {item.label}
                    {item.shortcut && (
                        <span className="text-muted-foreground ml-auto text-xs tracking-widest">
                            {item.shortcut}
                        </span>
                    )}
                </DropdownMenuPrimitive.RadioItem>
            )

        case 'sub':
            return (
                <DropdownMenuPrimitive.Sub key={key}>
                    <DropdownMenuPrimitive.SubTrigger
                        data-inset={item.inset}
                        className={cn(
                            "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        )}
                        disabled={item.disabled}
                    >
                        {item.icon}
                        {item.label}
                        <ChevronRightIcon className="ml-auto size-4" />
                    </DropdownMenuPrimitive.SubTrigger>
                    <DropdownMenuPrimitive.SubContent
                        className={cn(
                            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg'
                        )}
                    >
                        {item.items?.map((subItem, subIndex) =>
                            renderDropdownItem(
                                subItem,
                                subIndex,
                                radioValue,
                                onValueChange
                            )
                        )}
                    </DropdownMenuPrimitive.SubContent>
                </DropdownMenuPrimitive.Sub>
            )

        default: // 'item'
            return (
                <DropdownMenuPrimitive.Item
                    key={key}
                    data-inset={item.inset}
                    data-variant={item.variant}
                    className={cn(
                        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    )}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                >
                    {item.icon}
                    {item.label}
                    {item.shortcut && (
                        <span className="text-muted-foreground ml-auto text-xs tracking-widest">
                            {item.shortcut}
                        </span>
                    )}
                </DropdownMenuPrimitive.Item>
            )
    }
}

export function ShDropdown({
    trigger,
    items,
    align = 'center',
    side = 'bottom',
    sideOffset = 4,
    className,
    onValueChange,
    radioValue,
    open,
    onOpenChange,
}: DropdownProps) {
    const hasRadioItems = items.some((item) => item.type === 'radio')

    const content = (
        <DropdownMenuPrimitive.Content
            align={align}
            side={side}
            sideOffset={sideOffset}
            className={cn(
                'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
                className
            )}
        >
            {hasRadioItems ? (
                <DropdownMenuPrimitive.RadioGroup
                    value={radioValue}
                    onValueChange={onValueChange}
                >
                    {items.map((item, index) =>
                        renderDropdownItem(
                            item,
                            index,
                            radioValue,
                            onValueChange
                        )
                    )}
                </DropdownMenuPrimitive.RadioGroup>
            ) : (
                items.map((item, index) =>
                    renderDropdownItem(item, index, radioValue, onValueChange)
                )
            )}
        </DropdownMenuPrimitive.Content>
    )

    return (
        <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DropdownMenuPrimitive.Trigger asChild>
                {trigger}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                {content}
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    )
}
