'use client'

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
import { SearchInput } from '@/components/ui/search-input'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { RoomSkeleton } from '@/components/ui/loading-skeleton'
import { useJoinedRooms } from '@/hooks/useJoinedRooms'
import { formatPrice, formatShortDate } from '@/lib/format'
import { getRoomStatusColor, getRoomStatusText } from '@/feature/history/status'

export function JoinedRoomsList() {
    const router = useRouter()
    const {
        rooms,
        isLoading,
        page,
        totalPages,
        searchText,
        handleSearch,
        setPage,
        refetch,
    } = useJoinedRooms()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">ห้องที่เข้าร่วม</h2>
                <ShButton
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                    disabled={isLoading}
                >
                    <ShIcon name="refresh-cw" size={16} className="mr-2" />
                    {isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
                </ShButton>
            </div>

            <SearchInput
                value={searchText}
                onChange={handleSearch}
                placeholder="ค้นหาจากชื่อสินค้า, รหัสห้อง..."
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <RoomSkeleton key={i} />
                    ))}
                </div>
            ) : rooms.length === 0 ? (
                <EmptyState
                    icon="store"
                    title="ยังไม่มีห้องที่เข้าร่วม"
                    description="ห้องที่คุณเข้าร่วมจะแสดงที่นี่"
                />
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
                                            <CardTitle className="text-lg line-clamp-2">
                                                {room.itemTitle}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                รหัสห้อง: {room.roomCode}
                                            </CardDescription>
                                        </div>
                                        <ShBadge
                                            variant="secondary"
                                            className={`ml-2 ${getRoomStatusColor(
                                                room.status
                                            )}`}
                                        >
                                            {getRoomStatusText(room.status)}
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
                                                    {formatShortDate(
                                                        room.createdAt
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
                                                                room.buyer
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
                                                                room.seller
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

                    <SimplePagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    )
}
