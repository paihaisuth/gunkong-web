'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShButton } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShBadge } from '@/components/ui/badge'
import { ShIcon } from '@/components/ui/icon'
import { toast } from 'sonner'
import { searchRooms } from '@/services/room'

interface RoomData {
    id: string
    roomCode: string
    creatorId: string
    buyerId: string | null
    sellerId: string
    status: string
    itemTitle: string
    itemDescription: string | null
    quantity: number
    itemPriceCents: number
    shippingFeeCents: number
    platformFeeCents: number
    totalCents: number
    currency: string
    itemImages: string[]
    shippingAddressId: string | null
    trackingNumber: string | null
    paidAt: string | null
    paymentVerifiedAt: string | null
    paymentVerifiedBy: string | null
    shippedAt: string | null
    completedAt: string | null
    cancelledAt: string | null
    cancelledBy: string | null
    cancellationReason: string | null
    expiresAt: string | null
    closedAt: string | null
    paymentStatus: string
    createdAt: string
    updatedAt: string
}

export default function RoomPage() {
    const params = useParams()
    const router = useRouter()
    const [roomData, setRoomData] = useState<RoomData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const roomCode = params.room as string

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!roomCode) {
                setError('ไม่พบรหัสห้อง')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await searchRooms({
                    roomCode: roomCode.toUpperCase(),
                })

                if (response.data?.data?.item) {
                    setRoomData(response.data.data.item)
                    setError(null)
                } else {
                    setError('ไม่พบข้อมูลห้อง')
                }
            } catch (err) {
                console.error('Error fetching room:', err)
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลห้อง')
                toast.error('ไม่สามารถดึงข้อมูลห้องได้')
            } finally {
                setLoading(false)
            }
        }

        fetchRoomData()
    }, [roomCode])

    const handleBackToSearch = () => {
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">
                        กำลังโหลดข้อมูลห้อง...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !roomData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                                <ShIcon
                                    name="alert-circle"
                                    size={24}
                                    className="text-destructive"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    ไม่พบห้อง
                                </h3>
                                <p className="text-muted-foreground">{error}</p>
                            </div>
                            <ShButton
                                onClick={handleBackToSearch}
                                className="w-full"
                            >
                                กลับไปค้นหา
                            </ShButton>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4">
                <ShButton
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToSearch}
                >
                    <ShIcon name="arrow-left" size={20} />
                </ShButton>
                <div>
                    <h1 className="text-2xl font-bold">
                        ธุรกรรม {roomData.roomCode}
                    </h1>
                    <p className="text-muted-foreground">
                        จัดการและติดตามการทำธุรกรรม
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShIcon name="package" size={20} />
                                        {roomData.itemTitle}
                                    </CardTitle>
                                    <CardDescription>
                                        รหัสห้อง: {roomData.roomCode}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <ShBadge
                                        variant={
                                            roomData.status === 'COMPLETED'
                                                ? 'default'
                                                : roomData.status ===
                                                  'CANCELLED'
                                                ? 'destructive'
                                                : roomData.status === 'PENDING'
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {roomData.status}
                                    </ShBadge>
                                    <ShBadge
                                        variant={
                                            roomData.paymentStatus === 'PAID'
                                                ? 'default'
                                                : roomData.paymentStatus ===
                                                  'VERIFIED'
                                                ? 'default'
                                                : roomData.paymentStatus ===
                                                  'FAILED'
                                                ? 'destructive'
                                                : 'secondary'
                                        }
                                    >
                                        {roomData.paymentStatus}
                                    </ShBadge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roomData.itemDescription && (
                                <div>
                                    <h4 className="font-medium mb-2">
                                        รายละเอียดสินค้า
                                    </h4>
                                    <p className="text-muted-foreground">
                                        {roomData.itemDescription}
                                    </p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">
                                        ข้อมูลสินค้า
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                จำนวน:
                                            </span>
                                            <span>
                                                {roomData.quantity} ชิ้น
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                ราคา:
                                            </span>
                                            <span>{roomData.currency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">
                                        การจัดส่ง
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        {roomData.trackingNumber ? (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    เลขติดตาม:
                                                </span>
                                                <span className="font-mono">
                                                    {roomData.trackingNumber}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                ยังไม่มีเลขติดตาม
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {roomData.itemImages && roomData.itemImages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>รูปภาพสินค้า</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {roomData.itemImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square bg-muted rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                alt={`รูปภาพสินค้า ${
                                                    index + 1
                                                }`}
                                                width={400}
                                                height={400}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>ประวัติการทำธุรกรรม</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <ShIcon
                                            name="plus"
                                            size={16}
                                            className="text-green-600"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">สร้างห้อง</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                roomData.createdAt
                                            ).toLocaleString('th-TH')}
                                        </p>
                                    </div>
                                </div>

                                {roomData.paidAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ShIcon
                                                name="credit-card"
                                                size={16}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                ชำระเงิน
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    roomData.paidAt
                                                ).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {roomData.shippedAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <ShIcon
                                                name="truck"
                                                size={16}
                                                className="text-orange-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                จัดส่งสินค้า
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    roomData.shippedAt
                                                ).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {roomData.completedAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <ShIcon
                                                name="check"
                                                size={16}
                                                className="text-green-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                ทำธุรกรรมสำเร็จ
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    roomData.completedAt
                                                ).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>สรุปราคา</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>ราคาสินค้า:</span>
                                <span>
                                    ฿
                                    {(
                                        roomData.itemPriceCents / 100
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ค่าจัดส่ง:</span>
                                <span>
                                    ฿
                                    {(
                                        roomData.shippingFeeCents / 100
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ค่าธรรมเนียม:</span>
                                <span>
                                    ฿
                                    {(
                                        roomData.platformFeeCents / 100
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>ยอดรวม:</span>
                                <span className="text-primary">
                                    ฿
                                    {(
                                        roomData.totalCents / 100
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>การดำเนินการ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ShButton
                                className="w-full"
                                disabled={
                                    roomData.status === 'COMPLETED' ||
                                    roomData.status === 'CANCELLED'
                                }
                            >
                                <ShIcon
                                    name="credit-card"
                                    size={16}
                                    className="mr-2"
                                />
                                ชำระเงิน
                            </ShButton>

                            <ShButton
                                variant="outline"
                                className="w-full"
                                disabled={
                                    roomData.status !== 'PENDING' ||
                                    roomData.paymentStatus !== 'PAID'
                                }
                            >
                                <ShIcon
                                    name="check-circle"
                                    size={16}
                                    className="mr-2"
                                />
                                ยืนยันการรับสินค้า
                            </ShButton>

                            <ShButton variant="outline" className="w-full">
                                <ShIcon
                                    name="share-2"
                                    size={16}
                                    className="mr-2"
                                />
                                แชร์ห้อง
                            </ShButton>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>ข้อมูลห้อง</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    รหัสห้อง:
                                </span>
                                <span className="font-mono">
                                    {roomData.roomCode}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    สร้างเมื่อ:
                                </span>
                                <span>
                                    {new Date(
                                        roomData.createdAt
                                    ).toLocaleDateString('th-TH')}
                                </span>
                            </div>
                            {roomData.expiresAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        หมดอายุ:
                                    </span>
                                    <span>
                                        {new Date(
                                            roomData.expiresAt
                                        ).toLocaleDateString('th-TH')}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
