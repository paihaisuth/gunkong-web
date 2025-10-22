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
import { fetchRooms } from '@/services/room'
import { useState, useEffect, useRef } from 'react'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import type { Room } from '@/services/room'

export default function Room() {
    const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
    const [createRoomForm, setCreateRoomForm] = useState({
        itemTitle: '',
        price: '',
        description: '',
    })
    const [isCreatingRoom, setIsCreatingRoom] = useState(false)
    const [rooms, setRooms] = useState<Room[]>([])
    const [isLoadingRooms, setIsLoadingRooms] = useState(true)
    const hasInitialized = useRef(false)

    const getRooms = async () => {
        if (hasInitialized.current) {
            console.log('getRooms already called, skipping...')
            return
        }

        try {
            hasInitialized.current = true
            setIsLoadingRooms(true)
            const response = await fetchRooms()
            setRooms(response.data.data?.items || [])
        } catch (error) {
            toast('เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง')
            hasInitialized.current = false
        } finally {
            setIsLoadingRooms(false)
        }
    }

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!createRoomForm.itemTitle.trim()) {
            toast('กรุณาป้อนชื่อสินค้า')
            return
        }

        if (
            !createRoomForm.price.trim() ||
            parseFloat(createRoomForm.price) <= 0
        ) {
            toast('กรุณาป้อนราคาที่ถูกต้อง')
            return
        }

        setIsCreatingRoom(true)
        try {
            // TODO: Call API to create room
            console.log('Creating room with data:', createRoomForm)
            toast('สร้างห้องสำเร็จ!')
            setIsCreateRoomOpen(false)
            setCreateRoomForm({ itemTitle: '', price: '', description: '' })
            // Reload rooms after creating
            getRooms()
        } catch (error) {
            console.error('Error creating room:', error)
            toast('เกิดข้อผิดพลาดในการสร้างห้อง')
        } finally {
            setIsCreatingRoom(false)
        }
    }

    useEffect(() => {
        getRooms()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED':
                return 'bg-blue-100 text-blue-800'
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800'
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CREATED':
                return 'สร้างแล้ว'
            case 'PENDING':
                return 'รอดำเนินการ'
            case 'CONFIRMED':
                return 'ยืนยันแล้ว'
            case 'SHIPPED':
                return 'จัดส่งแล้ว'
            case 'COMPLETED':
                return 'สำเร็จ'
            case 'CANCELLED':
                return 'ยกเลิก'
            default:
                return status
        }
    }

    const formatPrice = (priceCents: number) => {
        return (priceCents / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
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

                                <form
                                    onSubmit={handleCreateRoom}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            ชื่อสินค้า{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </label>
                                        <ShInput
                                            placeholder="ป้อนชื่อสินค้าที่ต้องการขาย"
                                            type="text"
                                            value={createRoomForm.itemTitle}
                                            onChange={(e) =>
                                                setCreateRoomForm((prev) => ({
                                                    ...prev,
                                                    itemTitle: e.target.value,
                                                }))
                                            }
                                            maxLength={100}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            ราคา (บาท){' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </label>
                                        <ShInput
                                            placeholder="0.00"
                                            type="number"
                                            value={createRoomForm.price}
                                            onChange={(e) =>
                                                setCreateRoomForm((prev) => ({
                                                    ...prev,
                                                    price: e.target.value,
                                                }))
                                            }
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            รายละเอียดสินค้า (ไม่บังคับ)
                                        </label>
                                        <textarea
                                            placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสินค้า..."
                                            className="w-full p-3 border border-input bg-background rounded-md text-sm resize-none"
                                            rows={3}
                                            value={createRoomForm.description}
                                            onChange={(e) =>
                                                setCreateRoomForm((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <ShButton
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsCreateRoomOpen(false)
                                            }
                                            className="flex-1"
                                            disabled={isCreatingRoom}
                                        >
                                            ยกเลิก
                                        </ShButton>
                                        <ShButton
                                            type="submit"
                                            className="flex-1"
                                            disabled={isCreatingRoom}
                                        >
                                            {isCreatingRoom
                                                ? 'กำลังสร้าง...'
                                                : 'สร้างห้อง'}
                                        </ShButton>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        ห้องซื้อขายทั้งหมด
                    </h2>
                    <ShButton
                        variant="outline"
                        size="sm"
                        onClick={getRooms}
                        disabled={isLoadingRooms}
                    >
                        <ShIcon name="refresh-cw" size={16} className="mr-2" />
                        {isLoadingRooms ? 'กำลังโหลด...' : 'รีเฟรช'}
                    </ShButton>
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
                                name="store"
                                size={24}
                                className="text-gray-400"
                            />
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                            ยังไม่มีห้องซื้อขาย
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            เริ่มต้นสร้างห้องแรกของคุณได้เลย
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <Card
                                key={room.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg line-clamp-2">
                                                {room.itemTitle}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                รหัสห้อง: {room.roomCode}
                                            </CardDescription>
                                        </div>
                                        <ShBadge
                                            variant="secondary"
                                            className={`ml-2 ${getStatusColor(
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
                                                {room.shippingFeeCents > 0 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        + ค่าจัดส่ง ฿
                                                        {formatPrice(
                                                            room.shippingFeeCents
                                                        )}
                                                    </div>
                                                )}
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
                                            {room.buyerId && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <ShIcon
                                                        name="user-check"
                                                        size={12}
                                                    />
                                                    <span>มีผู้ซื้อแล้ว</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="flex gap-2">
                                                <ShButton
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <ShIcon
                                                        name="eye"
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    ดูรายละเอียด
                                                </ShButton>
                                                {room.status === 'CREATED' &&
                                                    !room.buyerId && (
                                                        <ShButton
                                                            size="sm"
                                                            className="flex-1"
                                                        >
                                                            <ShIcon
                                                                name="edit"
                                                                size={14}
                                                                className="mr-1"
                                                            />
                                                            แก้ไขรายละเอียด
                                                        </ShButton>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
