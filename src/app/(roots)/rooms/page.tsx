'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ShButton } from '@/components/ui/button'
import { ShInput } from '@/components/ui/input'
import { toast } from 'sonner'
import { fetchSellRooms, createRoom } from '@/services/room'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import type { Room } from '@/services/room'
import { getStatusColor, getStatusText } from '@/lib/utils'
import { useUserStore } from '@/stores/useUserStore'
import { getUserIdFromToken } from '@/lib/token-utils'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

const createRoomSchema = z.object({
    itemTitle: z
        .string()
        .min(1, 'กรุณาป้อนชื่อสินค้า')
        .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร'),
    price: z
        .string()
        .min(1, 'กรุณาป้อนราคา')
        .refine(
            (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
            'กรุณาป้อนราคาที่ถูกต้อง'
        ),
    quantity: z
        .string()
        .min(1, 'กรุณาป้อนจำนวน')
        .refine(
            (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
            'กรุณาป้อนจำนวนที่ถูกต้อง'
        ),
    description: z
        .string()
        .max(500, 'รายละเอียดต้องไม่เกิน 500 ตัวอักษร')
        .optional(),
})

type CreateRoomFormValues = z.infer<typeof createRoomSchema>

export default function Room() {
    const router = useRouter()
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
    const [rooms, setRooms] = useState<Room[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 9
    const [searchText, setSearchText] = useState('')
    const [debouncedSearchText, setDebouncedSearchText] = useState('')
    const accessToken = useUserStore((state) => state.accessToken)
    const currentUserId = accessToken ? getUserIdFromToken(accessToken) : null

    const form = useForm<CreateRoomFormValues>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            itemTitle: '',
            price: '',
            quantity: '1',
            description: '',
        },
    })

    const getRooms = async (page = 1, search = '') => {
        try {
            setIsLoadingRooms(true)
            const response = await fetchSellRooms({
                page,
                perPage: itemsPerPage,
                searchText: search || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setRooms(response.data.data?.items || [])
            setTotalPages(response.data.data?.pagination?.totalPages || 1)
        } catch {
            toast('เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง')
        } finally {
            setIsLoadingRooms(false)
        }
    }

    const handleCreateRoom = async (data: CreateRoomFormValues) => {
        try {
            const priceInCents = Math.round(parseFloat(data.price) * 100)

            const payload = {
                itemTitle: data.itemTitle.trim(),
                itemDescription: data.description?.trim() || undefined,
                quantity: parseInt(data.quantity),
                itemPriceCents: priceInCents,
                itemImages: [],
            }

            const response = await createRoom(payload)

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            toast('สร้างห้องสำเร็จ!')
            setIsCreateRoomOpen(false)
            form.reset()

            getRooms(currentPage, debouncedSearchText)
        } catch (error) {
            console.error('Error creating room:', error)
            toast('เกิดข้อผิดพลาดในการสร้างห้อง')
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchText])

    useEffect(() => {
        getRooms(currentPage, debouncedSearchText)
    }, [currentPage, debouncedSearchText])

    const formatPrice = (priceCents: number) => {
        return (priceCents / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const generatePageNumbers = () => {
        const pages = []
        const showEllipsisStart = currentPage > 3
        const showEllipsisEnd = currentPage < totalPages - 2

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)

            if (showEllipsisStart) {
                pages.push(-1)
            }

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (showEllipsisEnd) {
                pages.push(-2)
            }

            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="space-y-6">
            <Card className="flex items-center justify-center">
                <CardContent className="p-2">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary text-2xl">+</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">
                                สร้างห้องใหม่
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                สร้างห้องเพื่อขายสินค้าของคุณ
                            </p>
                        </div>

                        <Dialog
                            open={isCreateRoomOpen}
                            onOpenChange={setIsCreateRoomOpen}
                        >
                            <DialogTrigger asChild>
                                <ShButton size="lg" className="w-full">
                                    สร้างห้อง
                                </ShButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>สร้างห้องใหม่</DialogTitle>
                                    <DialogDescription>
                                        กรอกข้อมูลสินค้าเพื่อสร้างห้องขาย
                                    </DialogDescription>
                                </DialogHeader>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleCreateRoom
                                        )}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="itemTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        ชื่อสินค้า{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <ShInput
                                                            placeholder="ป้อนชื่อสินค้าที่ต้องการขาย"
                                                            type="text"
                                                            maxLength={100}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        ราคา (บาท){' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <ShInput
                                                            placeholder="0.00"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        จำนวน{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <ShInput
                                                            placeholder="1"
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        รายละเอียดสินค้า
                                                        (ไม่บังคับ)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสินค้า..."
                                                            className="w-full p-3 border border-input bg-background rounded-md text-sm resize-none"
                                                            rows={3}
                                                            maxLength={500}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex text-xs text-red-600">
                                            <span>
                                                * หมายเหตุ:
                                                ราคาที่ท่านใส่จะมีการบวกเพิ่มค่าธรรมเนียมการซื้อขาย
                                                15%
                                                ซึ่งจะถูกบวกหลังจากที่ท่านใส่ราคาสินค้าของท่านโดยอัตโนมัติ
                                            </span>
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <ShButton
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setIsCreateRoomOpen(false)
                                                }
                                                className="flex-1"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                ยกเลิก
                                            </ShButton>
                                            <ShButton
                                                type="submit"
                                                className="flex-1"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                {form.formState.isSubmitting
                                                    ? 'กำลังสร้าง...'
                                                    : 'สร้างห้อง'}
                                            </ShButton>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <div>
                <div className="flex items-center justify-between mb-4 gap-4">
                    <h2 className="text-xl font-semibold">
                        ห้องซื้อขายทั้งหมด
                    </h2>
                    <div className="relative flex-1 max-w-md">
                        <ShIcon
                            name="search"
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <ShInput
                            placeholder="ค้นหาด้วยชื่อสินค้าหรือรหัสห้อง..."
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value)
                            }}
                            className="pl-10 pr-10"
                        />
                        {searchText && (
                            <button
                                onClick={() => {
                                    setSearchText('')
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <ShIcon name="x" size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {isLoadingRooms ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : rooms.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ShIcon
                                name={debouncedSearchText ? 'search' : 'store'}
                                size={24}
                                className="text-gray-400"
                            />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                            {debouncedSearchText
                                ? 'ไม่พบห้องซื้อขายที่ค้นหา'
                                : 'ยังไม่มีห้องซื้อขาย'}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {debouncedSearchText
                                ? 'ลองค้นหาด้วยคำอื่นหรือรหัสห้องอื่น'
                                : 'เริ่มต้นสร้างห้องแรกของคุณได้เลย'}
                        </p>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rooms.map((room) => (
                                <Card
                                    key={room.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() =>
                                        router.push(`/rooms/${room.roomCode}`)
                                    }
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg line-clamp-2">
                                                        {room.itemTitle}
                                                    </CardTitle>
                                                    {currentUserId === room.sellerId && (
                                                        <ShBadge className="bg-blue-500 text-white text-xs shrink-0">
                                                            ผู้ขาย
                                                        </ShBadge>
                                                    )}
                                                    {currentUserId === room.buyerId && (
                                                        <ShBadge className="bg-green-500 text-white text-xs shrink-0">
                                                            ผู้ซื้อ
                                                        </ShBadge>
                                                    )}
                                                </div>
                                                <CardDescription className="mt-1">
                                                    รหัสห้อง: {room.roomCode}
                                                </CardDescription>
                                            </div>
                                            <ShBadge
                                                variant="secondary"
                                                className={`ml-2 shrink-0 ${getStatusColor(
                                                    room.status
                                                )}`}
                                            >
                                                {getStatusText(room.status)}
                                            </ShBadge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            {room.itemDescription && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {room.itemDescription}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <ShIcon
                                                        name="package"
                                                        size={14}
                                                    />
                                                    <span>
                                                        จำนวน: {room.quantity}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-lg text-primary">
                                                        ฿
                                                        {formatPrice(
                                                            room.itemPriceCents
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <ShIcon
                                                        name="calendar"
                                                        size={12}
                                                    />
                                                    <span>
                                                        {new Date(
                                                            room.createdAt
                                                        ).toLocaleDateString(
                                                            'th-TH',
                                                            {
                                                                year: '2-digit',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                {room.completedAt && (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <ShIcon
                                                            name="check-circle"
                                                            size={12}
                                                        />
                                                        <span>สำเร็จ</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1) {
                                                    setCurrentPage(
                                                        currentPage - 1
                                                    )
                                                }
                                            }}
                                            className={
                                                currentPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>

                                    {generatePageNumbers().map(
                                        (page, index) => (
                                            <PaginationItem key={index}>
                                                {page === -1 || page === -2 ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setCurrentPage(page)
                                                        }}
                                                        isActive={
                                                            currentPage === page
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        )
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < totalPages) {
                                                    setCurrentPage(
                                                        currentPage + 1
                                                    )
                                                }
                                            }}
                                            className={
                                                currentPage === totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
