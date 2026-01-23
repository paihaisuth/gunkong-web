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
import { EmptyState } from '@/components/ui/empty-state'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { DisputeStatusBadge } from '@/components/dispute/DisputeStatusBadge'
import { useDisputesList } from '@/hooks/useDisputesList'
import { formatPrice, formatDate } from '@/lib/format'
import type { DisputeStatus, DisputeReason } from '@/types/dispute'

const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  ITEM_NOT_RECEIVED: 'ไม่ได้รับสินค้า',
  ITEM_NOT_AS_DESCRIBED: 'สินค้าไม่ตรงตามคำอธิบาย',
  ITEM_DAMAGED: 'สินค้าชำรุด',
  PAYMENT_ISSUE: 'ปัญหาเกี่ยวกับการชำระเงิน',
  SHIPPING_ISSUE: 'ปัญหาเกี่ยวกับการจัดส่ง',
  SELLER_NOT_SHIPPING: 'ผู้ขายไม่จัดส่งสินค้า',
  BUYER_NOT_CONFIRMING: 'ผู้ซื้อไม่ยืนยันการรับสินค้า',
  OTHER: 'อื่นๆ',
}

const STATUS_OPTIONS: { value: DisputeStatus | undefined; label: string }[] = [
  { value: undefined, label: 'ทั้งหมด' },
  { value: 'OPEN', label: 'เปิดสู่การพิจารณา' },
  { value: 'UNDER_REVIEW', label: 'อยู่ระหว่างตรวจสอบ' },
  { value: 'RESOLVED_BUYER_FAVOR', label: 'คืนเงินให้ผู้ซื้อ' },
  { value: 'RESOLVED_SELLER_FAVOR', label: 'ปล่อยเงินให้ผู้ขาย' },
  { value: 'RESOLVED_PARTIAL', label: 'แก้ไขบางส่วน' },
  { value: 'CLOSED', label: 'ปิดแล้ว' },
]

export default function DisputesPage() {
  const router = useRouter()
  const {
    disputes,
    isLoading,
    page,
    totalPages,
    total,
    statusFilter,
    setPage,
    handleStatusChange,
    refetch,
  } = useDisputesList()

  const getReasonLabel = (reason: DisputeReason): string => {
    return DISPUTE_REASON_LABELS[reason] || reason
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ข้อพิพาท</CardTitle>
          <CardDescription>ดูและจัดการข้อพิพาทของคุณ</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">รายการข้อพิพาท</h2>
          <p className="text-sm text-muted-foreground">พบ {total} ข้อพิพาท</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter || ''}
            onChange={(e) =>
              handleStatusChange(
                (e.target.value as DisputeStatus) || undefined
              )
            }
            className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value || ''}>
                {option.label}
              </option>
            ))}
          </select>
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
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      ) : disputes.length === 0 ? (
        <EmptyState
          icon="alert-circle"
          title="ไม่มีข้อพิพาท"
          description="ข้อพิพาทของคุณจะแสดงที่นี่"
        />
      ) : (
        <>
          <div className="space-y-3">
            {disputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/disputes/${dispute.disputeCode}`)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-sm">
                          {dispute.disputeCode}
                        </p>
                        <DisputeStatusBadge status={dispute.status} size="sm" />
                      </div>
                      <h3 className="font-semibold text-base mb-1">
                        {dispute.itemTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        ห้อง: {dispute.roomCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ฿{formatPrice(dispute.totalCents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(dispute.openedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <ShBadge
                      variant="secondary"
                      className="text-xs"
                    >
                      {getReasonLabel(dispute.reason)}
                    </ShBadge>
                    <ShIcon
                      name="chevron-right"
                      size={16}
                      className="text-muted-foreground"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  )
}
