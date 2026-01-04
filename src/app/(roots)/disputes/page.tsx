'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { fetchMyDisputes } from '@/services/dispute'
import { DisputeListItem, DisputeStatus } from '@/types/dispute'
import { DisputeStatusBadge } from '@/components/dispute/DisputeStatusBadge'

export default function DisputesPage() {
  const router = useRouter()
  const [disputes, setDisputes] = useState<DisputeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | undefined>()

  const itemsPerPage = 10

  useEffect(() => {
    const loadDisputes = async () => {
      try {
        setLoading(true)
        const response = await fetchMyDisputes({
          status: statusFilter,
          page,
          limit: itemsPerPage,
        })
        if (response.data?.data?.item?.disputes) {
          setDisputes(response.data.data.item.disputes)
          setTotal(response.data.data.item.total || 0)
          setTotalPages(response.data.data.item.totalPages || 1)
        }
      } catch (error) {
        console.error('Fetch disputes error:', error)
        toast.error('ไม่สามารถโหลดข้อพิพาท')
      } finally {
        setLoading(false)
      }
    }
    loadDisputes()
  }, [page, statusFilter])


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
    })
  }

  const reasonLabels: Record<string, string> = {
    ITEM_NOT_RECEIVED: 'ไม่ได้รับสินค้า',
    ITEM_NOT_AS_DESCRIBED: 'สินค้าไม่ตรงตามคำอธิบาย',
    ITEM_DAMAGED: 'สินค้าชำรุด',
    PAYMENT_ISSUE: 'ปัญหาเกี่ยวกับการชำระเงิน',
    SHIPPING_ISSUE: 'ปัญหาเกี่ยวกับการจัดส่ง',
    SELLER_NOT_SHIPPING: 'ผู้ขายไม่จัดส่งสินค้า',
    BUYER_NOT_CONFIRMING: 'ผู้ซื้อไม่ยืนยันการรับสินค้า',
    OTHER: 'อื่นๆ',
  }

  const statusOptions: { value: DisputeStatus | undefined; label: string }[] = [
    { value: undefined, label: 'ทั้งหมด' },
    { value: 'OPEN', label: 'เปิดสู่การพิจารณา' },
    { value: 'UNDER_REVIEW', label: 'อยู่ระหว่างตรวจสอบ' },
    { value: 'RESOLVED_BUYER_FAVOR', label: 'คืนเงินให้ผู้ซื้อ' },
    { value: 'RESOLVED_SELLER_FAVOR', label: 'ปล่อยเงินให้ผู้ขาย' },
    { value: 'RESOLVED_PARTIAL', label: 'แก้ไขบางส่วน' },
    { value: 'CLOSED', label: 'ปิดแล้ว' },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <ShButton
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ShIcon name="arrow-left" size={20} />
        </ShButton>
        <div>
          <h1 className="text-2xl font-bold">ข้อพิพาทของฉัน</h1>
          <p className="text-muted-foreground">
            ดูและจัดการข้อพิพาทของคุณ
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>รายการข้อพิพาท</CardTitle>
              <CardDescription>
                พบ {total} ข้อพิพาท
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter || ''}
                onChange={(e) => {
                  setStatusFilter(e.target.value ? (e.target.value as DisputeStatus) : undefined)
                  setPage(1)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value || ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ShButton
                variant="outline"
                size="sm"
                onClick={() => setPage(page)}
              >
                <ShIcon name="refresh-cw" size={16} />
              </ShButton>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">กำลังโหลด...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-8">
              <ShIcon name="inbox" size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">ไม่มีข้อพิพาท</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/disputes/${dispute.disputeCode}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">
                          {dispute.disputeCode}
                        </p>
                        <DisputeStatusBadge status={dispute.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {dispute.itemTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        ห้อง: {dispute.roomCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(dispute.totalCents)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(dispute.openedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShBadge variant="secondary" className="text-xs">
                        {reasonLabels[dispute.reason] || dispute.reason}
                      </ShBadge>
                    </div>
                    <ShIcon name="chevron-right" size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                หน้า {page} จาก {totalPages}
              </p>
              <div className="flex gap-2">
                <ShButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ShIcon name="chevron-left" size={16} />
                </ShButton>
                <ShButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ShIcon name="chevron-right" size={16} />
                </ShButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
