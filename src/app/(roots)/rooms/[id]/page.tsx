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
import { fetchCodeRoom, type Room } from '@/services/room'
import { getStatusColor, getStatusText } from '@/lib/utils'

export default function RoomDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [roomData, setRoomData] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const roomCode = params.id as string

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!roomCode) {
                setError('ไม่พบรหัสห้อง')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await fetchCodeRoom({
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
                toast('ไม่สามารถดึงข้อมูลห้องได้')
            } finally {
                setLoading(false)
            }
        }

        fetchRoomData()
    }, [roomCode])

    const handleBackToRooms = () => {
        router.push('/rooms')
    }

    const handleEdit = () => {
        router.push(`/rooms/${roomCode}/edit`)
    }

    const formatPrice = (priceCents: number) => {
        return (priceCents / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
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
                                onClick={handleBackToRooms}
                                className="w-full"
                            >
                                กลับไปห้องทั้งหมด
                            </ShButton>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ShButton
                        variant="ghost"
                        size="icon"
                        onClick={handleBackToRooms}
                    >
                        <ShIcon name="arrow-left" size={20} />
                    </ShButton>
                    <div>
                        <h1 className="text-2xl font-bold">
                            รายละเอียดห้อง {roomData.roomCode}
                        </h1>
                        <p className="text-muted-foreground">
                            ข้อมูลและรายละเอียดสินค้า
                        </p>
                    </div>
                </div>
                {roomData.status === 'CREATED' && !roomData.buyerId && (
                    <ShButton onClick={handleEdit}>
                        <ShIcon name="edit" size={16} className="mr-2" />
                        แก้ไขรายละเอียด
                    </ShButton>
                )}
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
                                <ShBadge
                                    variant="secondary"
                                    className={getStatusColor(roomData.status)}
                                >
                                    {getStatusText(roomData.status)}
                                </ShBadge>
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
                                                สกุลเงิน:
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
                                <div>
                                    <h4 className="font-medium mb-2">
                                        รายละเอียดห้อง
                                    </h4>
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
                                    {roomData.buyerId && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                สถานะผู้ซื้อ:
                                            </span>
                                            <span className="text-green-600 flex items-center gap-1">
                                                <ShIcon
                                                    name="user-check"
                                                    size={14}
                                                />
                                                มีผู้ซื้อแล้ว
                                            </span>
                                        </div>
                                    )}
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

                                {roomData.cancelledAt && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <ShIcon
                                                name="x"
                                                size={16}
                                                className="text-red-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                ยกเลิกห้อง
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    roomData.cancelledAt
                                                ).toLocaleString('th-TH')}
                                            </p>
                                            {roomData.cancellationReason && (
                                                <p className="text-sm text-muted-foreground">
                                                    เหตุผล:{' '}
                                                    {
                                                        roomData.cancellationReason
                                                    }
                                                </p>
                                            )}
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
                                    ฿{formatPrice(roomData.itemPriceCents)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ค่าจัดส่ง:</span>
                                <span>
                                    ฿{formatPrice(roomData.shippingFeeCents)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>ค่าธรรมเนียม:</span>
                                <span>
                                    ฿{formatPrice(roomData.platformFeeCents)}
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>ยอดรวม:</span>
                                <span className="text-primary">
                                    ฿{formatPrice(roomData.totalCents)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>การดำเนินการ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ShButton variant="outline" className="w-full">
                                <ShIcon
                                    name="share-2"
                                    size={16}
                                    className="mr-2"
                                />
                                แชร์ห้อง
                            </ShButton>

                            {roomData.status === 'SHIPPED' && (
                                <ShButton
                                    variant="outline"
                                    className="w-full"
                                >
                                    <ShIcon
                                        name="check-circle"
                                        size={16}
                                        className="mr-2"
                                    />
                                    ยืนยันการรับสินค้า
                                </ShButton>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
