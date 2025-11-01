'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/provider/theme-toggle'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'next/navigation'
import { fetchUserProfile } from '@/services/profile/profile'
import { toast } from 'sonner'
import { isTokenExpired } from '@/lib/token-utils'

interface LayoutProps {
    children: React.ReactNode
}

export interface NavigationItem {
    icon: string
    label: string
    href: string
    badge?: string | number
    children?: NavigationItem[]
}

interface SidebarItemProps {
    item: NavigationItem
    isActive?: boolean
    level?: number
}

const navigationConfig: NavigationItem[] = [
    {
        icon: 'home',
        label: 'หน้าหลัก',
        href: '/',
    },
    {
        icon: 'store',
        label: 'ห้องซื้อขาย',
        href: '/rooms',
    },
    {
        icon: 'history',
        label: 'ประวัติการซื้อขาย',
        href: '/history',
    },
]

function SidebarItem({ item, isActive, level = 0 }: SidebarItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const hasChildren = item.children && item.children.length > 0

    const itemContent = (
        <div
            className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground font-medium',
                level > 0 && 'ml-6 text-sm'
            )}
        >
            <ShIcon name={item.icon} size={level > 0 ? 16 : 20} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
                <ShBadge variant="secondary" className="text-xs">
                    {item.badge}
                </ShBadge>
            )}
            {hasChildren && (
                <ShIcon
                    name={isExpanded ? 'chevron-down' : 'chevron-right'}
                    size={14}
                    className="text-muted-foreground"
                />
            )}
        </div>
    )

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full"
                >
                    {itemContent}
                </button>
                {isExpanded && (
                    <div className="mt-1 space-y-1">
                        {item.children?.map((child, index) => (
                            <SidebarItem
                                key={index}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link href={item.href} className="block">
            {itemContent}
        </Link>
    )
}

function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useUserStore()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <div className={cn('flex flex-col h-full', className)}>
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShIcon
                        name="share-2"
                        size={18}
                        className="text-primary-foreground"
                    />
                </div>
                <span className="font-semibold text-lg">Gunkong</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navigationConfig.map((item, index) => (
                    <SidebarItem
                        key={index}
                        item={item}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>

            <div className="border-t px-3 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                <ShIcon name="user" size={16} />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">
                                    Test User
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    ออนไลน์ • ยืนยันแล้ว ⭐
                                </p>
                            </div>
                            <ShIcon name="chevron-up" size={14} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>
                            <ShIcon name="user" size={16} className="mr-2" />
                            โปรไฟล์
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ShIcon
                                name="settings"
                                size={16}
                                className="mr-2"
                            />
                            ตั้งค่า
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-destructive"
                        >
                            <ShIcon name="log-out" size={16} className="mr-2" />
                            ออกจากระบบ
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function TopNavigation() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const generateBreadcrumbs = () => {
        const segments = pathname.split('/').filter(Boolean)
        const breadcrumbs = [{ label: 'หน้าหลัก', href: '/' }]

        let currentPath = ''
        segments.forEach((segment) => {
            currentPath += `/${segment}`
            const labelMap: Record<string, string> = {
                'trading-rooms': 'ห้องซื้อขาย',
                'trading-history': 'ประวัติการซื้อขาย',
            }
            breadcrumbs.push({
                label: labelMap[segment] || segment,
                href: currentPath,
            })
        })

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()
    const { logout } = useUserStore()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
                <Sheet
                    open={isMobileSidebarOpen}
                    onOpenChange={setIsMobileSidebarOpen}
                >
                    <SheetTrigger asChild>
                        <ShButton
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                        >
                            <ShIcon name="menu" size={20} />
                            <span className="sr-only">เปิดเมนู</span>
                        </ShButton>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation Menu</SheetTitle>
                            <SheetDescription>
                                Main navigation menu for the application
                            </SheetDescription>
                        </SheetHeader>
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                <div className="flex-1">
                    <nav className="flex items-center space-x-1 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center">
                                {index > 0 && (
                                    <ShIcon
                                        name="chevron-right"
                                        size={14}
                                        className="mx-2 text-muted-foreground"
                                    />
                                )}
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="font-medium text-foreground">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <ShButton
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <ShIcon name="bell" size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                                    3
                                </span>
                                <span className="sr-only">การแจ้งเตือน</span>
                            </ShButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="px-3 py-2 border-b">
                                <h4 className="font-medium">การแจ้งเตือน</h4>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <DropdownMenuItem className="flex flex-col items-start py-3">
                                    <div className="flex items-center gap-2 w-full">
                                        <ShIcon
                                            name="check-circle"
                                            size={16}
                                            className="text-green-500"
                                        />
                                        <span className="font-medium text-sm">
                                            การเทรดสำเร็จ
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            2 นาทีที่แล้ว
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ขาย USDT 1,000 เรียบร้อยแล้ว
                                    </p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start py-3">
                                    <div className="flex items-center gap-2 w-full">
                                        <ShIcon
                                            name="message-circle"
                                            size={16}
                                            className="text-blue-500"
                                        />
                                        <span className="font-medium text-sm">
                                            ข้อความใหม่
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            5 นาทีที่แล้ว
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ผู้ซื้อส่งหลักฐานการโอนเงินแล้ว
                                    </p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start py-3">
                                    <div className="flex items-center gap-2 w-full">
                                        <ShIcon
                                            name="alert-triangle"
                                            size={16}
                                            className="text-yellow-500"
                                        />
                                        <span className="font-medium text-sm">
                                            ออเดอร์ใกล้หมดเวลา
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            10 นาทีที่แล้ว
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ออเดอร์ #12345 เหลือเวลา 5 นาที
                                    </p>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                                ดูการแจ้งเตือนทั้งหมด
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <ShButton
                                variant="ghost"
                                size="icon"
                                className="hidden lg:flex"
                            >
                                <ShIcon name="user" size={20} />
                                <span className="sr-only">บัญชีผู้ใช้</span>
                            </ShButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <ShIcon
                                    name="user"
                                    size={16}
                                    className="mr-2"
                                />
                                โปรไฟล์
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ShIcon
                                    name="settings"
                                    size={16}
                                    className="mr-2"
                                />
                                ตั้งค่า
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-destructive"
                            >
                                <ShIcon
                                    name="log-out"
                                    color="white"
                                    size={16}
                                    className="mr-2"
                                />
                                ออกจากระบบ
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default function RootsLayout({ children }: LayoutProps) {
    const { setUser, user, isAuthenticated, accessToken, logout } = useUserStore()
    const router = useRouter()

    const getUserProfile = useCallback(async () => {
        try {
            console.log('Fetching user profile...')
            const res = await fetchUserProfile()
            if (!res.data.data?.item) {
                toast('ไม่สามารถดึงข้อมูลโปรไฟล์ผู้ใช้ได้')
                return
            }

            setUser(res.data.data?.item)
            console.log('User profile fetched:', res.data.data?.item)
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
        }
    }, [setUser])

    useEffect(() => {
        if (accessToken && isTokenExpired(accessToken)) {
            console.log('Token expired, logging out...')
            logout()
            const currentPath = window.location.pathname
            router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`)
            return
        }

        if (isAuthenticated && accessToken && !user) {
            getUserProfile()
        }
    }, [isAuthenticated, accessToken, user, getUserProfile, logout, router])

    return (
        <div className="flex h-screen bg-background">
            <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
                <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavigation />

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6">{children}</div>
                </main>
            </div>
        </div>
    )
}
