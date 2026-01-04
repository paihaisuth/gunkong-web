'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui/search-input'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { TransactionSkeleton } from '@/components/ui/loading-skeleton'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { formatPrice, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
    getTransactionStatusColor,
    getTransactionTypeText,
    getTransactionTypeColor,
    getTransactionStatusText,
} from '@/feature/history/status'

export function TransactionHistoryList() {
    const router = useRouter()
    const {
        transactions,
        isLoading,
        page,
        totalPages,
        searchText,
        handleSearch,
        setPage,
        refetch,
    } = useTransactionHistory()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">ประวัติธุรกรรม</h2>
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
                placeholder="ค้นหาจากรายละเอียด, ชื่อสินค้า, รหัสห้อง..."
            />

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <TransactionSkeleton key={i} />
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <EmptyState
                    icon="credit-card"
                    title="ยังไม่มีประวัติธุรกรรม"
                    description="ธุรกรรมของคุณจะแสดงที่นี่"
                />
            ) : (
                <>
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <Card
                                key={tx.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() =>
                                    router.push(`/rooms/${tx.room.roomCode}`)
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
                                                รหัสห้อง: {tx.room.roomCode}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={cn(
                                                    'font-semibold text-lg',
                                                    tx.type === 'PAYMENT' ||
                                                        tx.type ===
                                                            'PLATFORM_FEE' ||
                                                        tx.type ===
                                                            'SHIPPING_FEE'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                )}
                                            >
                                                {tx.type === 'PAYMENT' ||
                                                tx.type === 'PLATFORM_FEE' ||
                                                tx.type === 'SHIPPING_FEE'
                                                    ? '-'
                                                    : '+'}
                                                ฿{formatPrice(tx.amountCents)}
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
                                            <ShIcon name="calendar" size={12} />
                                            <span>
                                                {formatDate(tx.createdAt)}
                                            </span>
                                        </div>
                                        {tx.paymentMethod && (
                                            <div className="flex items-center gap-1">
                                                <ShIcon
                                                    name="credit-card"
                                                    size={12}
                                                />
                                                <span>{tx.paymentMethod}</span>
                                            </div>
                                        )}
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
