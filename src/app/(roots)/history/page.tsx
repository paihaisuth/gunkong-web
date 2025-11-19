'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    fetchTransactionHistory,
    fetchJoinedRooms,
    type Transaction,
    type JoinedRoom,
} from '@/services/history'
import { cn } from '@/lib/utils'
import {
    getTransactionStatusColor,
    getRoomStatusColor,
    getRoomStatusText,
    getTransactionTypeText,
    getTransactionTypeColor,
    getTransactionStatusText,
} from '@/feature/history/status'

type ViewMode = 'transactions' | 'rooms'

export default function HistoryPage() {
    const router = useRouter()
    const [viewMode, setViewMode] = useState<ViewMode>('transactions')
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [rooms, setRooms] = useState<JoinedRoom[]>([])
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
    const [isLoadingRooms, setIsLoadingRooms] = useState(false)
    const [transactionPage, setTransactionPage] = useState(1)
    const [roomPage, setRoomPage] = useState(1)
    const [totalTransactionPages, setTotalTransactionPages] = useState(1)
    const [totalRoomPages, setTotalRoomPages] = useState(1)
    const [transactionSearchText, setTransactionSearchText] = useState('')
    const [roomSearchText, setRoomSearchText] = useState('')

    const getTransactionHistory = async (page = 1, searchText = '') => {
        try {
            setIsLoadingTransactions(true)
            const response = await fetchTransactionHistory({
                page,
                perPage: 10,
                searchText: searchText || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setTransactions(response.data.data?.items || [])
            setTotalTransactionPages(
                response.data.data?.pagination?.totalPages || 1
            )
        } catch (error) {
            toast('เกิดข้อผิดพลาดในการโหลดประวัติธุรกรรม')
            console.error('Error fetching transaction history:', error)
        } finally {
            setIsLoadingTransactions(false)
        }
    }

    const getJoinedRooms = async (page = 1, searchText = '') => {
        try {
            setIsLoadingRooms(true)
            const response = await fetchJoinedRooms({
                page,
                perPage: 10,
                searchText: searchText || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setRooms(response.data.data?.items || [])
            setTotalRoomPages(response.data.data?.pagination?.totalPages || 1)
        } catch (error) {
            toast('เกิดข้อผิดพลาดในการโหลดห้องที่เข้าร่วม')
            console.error('Error fetching joined rooms:', error)
        } finally {
            setIsLoadingRooms(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (viewMode === 'transactions') {
                getTransactionHistory(transactionPage, transactionSearchText)
            } else {
                getJoinedRooms(roomPage, roomSearchText)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [viewMode, transactionPage, roomPage, transactionSearchText, roomSearchText])

    const handleTransactionSearch = (value: string) => {
        setTransactionSearchText(value)
        setTransactionPage(1)
    }

    const handleRoomSearch = (value: string) => {
        setRoomSearchText(value)
        setRoomPage(1)
    }

    const formatPrice = (priceCents: number) => {
        return (priceCents / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>ประวัติ</CardTitle>
                    <CardDescription>
                        ดูประวัติธุรกรรมและห้องที่คุณเข้าร่วม
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex gap-2">
                <ShButton
                    variant={
                        viewMode === 'transactions' ? 'default' : 'outline'
                    }
                    onClick={() => setViewMode('transactions')}
                    className="flex-1"
                >
                    <ShIcon name="credit-card" size={16} className="mr-2" />
                    ประวัติธุรกรรม
                </ShButton>
                <ShButton
                    variant={viewMode === 'rooms' ? 'default' : 'outline'}
                    onClick={() => setViewMode('rooms')}
                    className="flex-1"
                >
                    <ShIcon name="store" size={16} className="mr-2" />
                    ห้องที่เข้าร่วม
                </ShButton>
            </div>

            {viewMode === 'transactions' ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            ประวัติธุรกรรม
                        </h2>
                        <ShButton
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                getTransactionHistory(transactionPage, transactionSearchText)
                            }
                            disabled={isLoadingTransactions}
                        >
                            <ShIcon
                                name="refresh-cw"
                                size={16}
                                className="mr-2"
                            />
                            {isLoadingTransactions ? 'กำลังโหลด...' : 'รีเฟรช'}
                        </ShButton>
                    </div>

                    <div className="relative">
                        <ShIcon
                            name="search"
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="ค้นหาจากรายละเอียด, ชื่อสินค้า, รหัสห้อง..."
                            value={transactionSearchText}
                            onChange={(e) => handleTransactionSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                        {transactionSearchText && (
                            <button
                                onClick={() => handleTransactionSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <ShIcon name="x" size={16} />
                            </button>
                        )}
                    </div>

                    {isLoadingTransactions ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <Card className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShIcon
                                    name="credit-card"
                                    size={24}
                                    className="text-gray-400"
                                />
                            </div>
                            <h3 className="font-medium text-lg mb-2">
                                ยังไม่มีประวัติธุรกรรม
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                ธุรกรรมของคุณจะแสดงที่นี่
                            </p>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <Card
                                        key={tx.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                `/rooms/${tx.room.roomCode}`
                                            )
                                        }
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ShBadge
                                                            variant="secondary"
                                                            className={getTransactionTypeColor(
                                                                tx.type
                                                            )}
                                                        >
                                                            {getTransactionTypeText(
                                                                tx.type
                                                            )}
                                                        </ShBadge>
                                                        <ShBadge
                                                            variant="secondary"
                                                            className={getTransactionStatusColor(
                                                                tx.status
                                                            )}
                                                        >
                                                            {getTransactionStatusText(
                                                                tx.status
                                                            )}
                                                        </ShBadge>
                                                    </div>
                                                    <h3 className="font-semibold text-lg">
                                                        {tx.room.itemTitle}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        รหัสห้อง:{' '}
                                                        {tx.room.roomCode}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div
                                                        className={cn(
                                                            'font-semibold text-lg',
                                                            tx.type ===
                                                                'PAYMENT' ||
                                                                tx.type ===
                                                                    'PLATFORM_FEE' ||
                                                                tx.type ===
                                                                    'SHIPPING_FEE'
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        )}
                                                    >
                                                        {tx.type ===
                                                            'PAYMENT' ||
                                                        tx.type ===
                                                            'PLATFORM_FEE' ||
                                                        tx.type ===
                                                            'SHIPPING_FEE'
                                                            ? '-'
                                                            : '+'}
                                                        ฿
                                                        {formatPrice(
                                                            tx.amountCents
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {tx.description && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {tx.description}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                                <div className="flex items-center gap-1">
                                                    <ShIcon
                                                        name="calendar"
                                                        size={12}
                                                    />
                                                    <span>
                                                        {formatDate(
                                                            tx.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                {tx.paymentMethod && (
                                                    <div className="flex items-center gap-1">
                                                        <ShIcon
                                                            name="credit-card"
                                                            size={12}
                                                        />
                                                        <span>
                                                            {tx.paymentMethod}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {totalTransactionPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <ShButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTransactionPage((p) =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={
                                            transactionPage === 1 ||
                                            isLoadingTransactions
                                        }
                                    >
                                        <ShIcon name="chevron-left" size={16} />
                                    </ShButton>
                                    <span className="text-sm">
                                        หน้า {transactionPage} จาก{' '}
                                        {totalTransactionPages}
                                    </span>
                                    <ShButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTransactionPage((p) =>
                                                Math.min(
                                                    totalTransactionPages,
                                                    p + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            transactionPage ===
                                                totalTransactionPages ||
                                            isLoadingTransactions
                                        }
                                    >
                                        <ShIcon
                                            name="chevron-right"
                                            size={16}
                                        />
                                    </ShButton>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            ห้องที่เข้าร่วม
                        </h2>
                        <ShButton
                            variant="outline"
                            size="sm"
                            onClick={() => getJoinedRooms(roomPage, roomSearchText)}
                            disabled={isLoadingRooms}
                        >
                            <ShIcon
                                name="refresh-cw"
                                size={16}
                                className="mr-2"
                            />
                            {isLoadingRooms ? 'กำลังโหลด...' : 'รีเฟรช'}
                        </ShButton>
                    </div>

                    <div className="relative">
                        <ShIcon
                            name="search"
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="ค้นหาจากชื่อสินค้า, รหัสห้อง..."
                            value={roomSearchText}
                            onChange={(e) => handleRoomSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                        {roomSearchText && (
                            <button
                                onClick={() => handleRoomSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <ShIcon name="x" size={16} />
                            </button>
                        )}
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
                                ยังไม่มีห้องที่เข้าร่วม
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                ห้องที่คุณเข้าร่วมจะแสดงที่นี่
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
                                            router.push(
                                                `/rooms/${room.roomCode}`
                                            )
                                        }
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg line-clamp-2">
                                                        {room.itemTitle}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        รหัสห้อง:{' '}
                                                        {room.roomCode}
                                                    </CardDescription>
                                                </div>
                                                <ShBadge
                                                    variant="secondary"
                                                    className={`ml-2 ${getRoomStatusColor(
                                                        room.status
                                                    )}`}
                                                >
                                                    {getRoomStatusText(
                                                        room.status
                                                    )}
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
                                                            จำนวน:{' '}
                                                            {room.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-lg text-primary">
                                                            ฿
                                                            {formatPrice(
                                                                room.totalCents
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

                                                <div className="pt-2 border-t">
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        {room.buyer && (
                                                            <div>
                                                                <p className="text-muted-foreground">
                                                                    ผู้ซื้อ:
                                                                </p>
                                                                <p className="font-medium">
                                                                    {
                                                                        room
                                                                            .buyer
                                                                            .fullName
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        {room.seller && (
                                                            <div>
                                                                <p className="text-muted-foreground">
                                                                    ผู้ขาย:
                                                                </p>
                                                                <p className="font-medium">
                                                                    {
                                                                        room
                                                                            .seller
                                                                            .fullName
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {totalRoomPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <ShButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setRoomPage((p) =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={
                                            roomPage === 1 || isLoadingRooms
                                        }
                                    >
                                        <ShIcon name="chevron-left" size={16} />
                                    </ShButton>
                                    <span className="text-sm">
                                        หน้า {roomPage} จาก {totalRoomPages}
                                    </span>
                                    <ShButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setRoomPage((p) =>
                                                Math.min(totalRoomPages, p + 1)
                                            )
                                        }
                                        disabled={
                                            roomPage === totalRoomPages ||
                                            isLoadingRooms
                                        }
                                    >
                                        <ShIcon
                                            name="chevron-right"
                                            size={16}
                                        />
                                    </ShButton>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
