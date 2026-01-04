'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShIcon } from '@/components/ui/icon'
import { Dispute, DisputeReason } from '@/types/dispute'
import { DisputeStatusBadge } from './DisputeStatusBadge'

interface DisputeDetailsProps {
  dispute: Dispute
}

const reasonLabels: Record<DisputeReason, string> = {
  ITEM_NOT_RECEIVED: 'ไม่ได้รับสินค้า',
  ITEM_NOT_AS_DESCRIBED: 'สินค้าไม่ตรงตามคำอธิบาย',
  ITEM_DAMAGED: 'สินค้าชำรุด',
  PAYMENT_ISSUE: 'ปัญหาเกี่ยวกับการชำระเงิน',
  SHIPPING_ISSUE: 'ปัญหาเกี่ยวกับการจัดส่ง',
  SELLER_NOT_SHIPPING: 'ผู้ขายไม่จัดส่งสินค้า',
  BUYER_NOT_CONFIRMING: 'ผู้ซื้อไม่ยืนยันการรับสินค้า',
  OTHER: 'อื่นๆ',
}

export function DisputeDetails({ dispute }: DisputeDetailsProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShIcon name="alert-triangle" size={20} className="text-amber-500" />
              ข้อพิพาท {dispute.disputeCode}
            </CardTitle>
            <CardDescription>
              เปิดเมื่อ {formatDate(dispute.openedAt)}
            </CardDescription>
          </div>
          <DisputeStatusBadge status={dispute.status} size="lg" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">เหตุผล</p>
            <p className="text-sm">
              {reasonLabels[dispute.reason]}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">สถานะ</p>
            <DisputeStatusBadge status={dispute.status} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">คำอธิบายรายละเอียด</p>
          <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
            {dispute.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-600">ผู้เปิดข้อพิพาท</p>
            <p>{dispute.opener?.fullName || dispute.opener?.username || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-600">ผู้ซื้อ</p>
            <p>{dispute.buyer?.fullName || dispute.buyer?.username || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-600">ผู้ขาย</p>
            <p>{dispute.seller?.fullName || dispute.seller?.username || '-'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-600">เปิดเมื่อ</p>
            <p>{formatDate(dispute.openedAt)}</p>
          </div>
        </div>

        {dispute.status === 'UNDER_REVIEW' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 flex items-start gap-2">
              <ShIcon name="info" size={16} className="flex-shrink-0 mt-0.5" />
              <span>ข้อพิพาทนี้กำลังอยู่ระหว่างตรวจสอบจากผู้ดูแลระบบ</span>
            </p>
          </div>
        )}

        {dispute.status.includes('RESOLVED') || dispute.status === 'CLOSED' ? (
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-600">ผลการแก้ไข</p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-600">ชนิดการแก้ไข</p>
                <p className="font-medium capitalize">
                  {dispute.resolution === 'RESOLVED_BUYER_FAVOR'
                    ? 'คืนเงินให้ผู้ซื้อ'
                    : dispute.resolution === 'RESOLVED_SELLER_FAVOR'
                      ? 'ปล่อยเงินให้ผู้ขาย'
                      : dispute.resolution === 'RESOLVED_PARTIAL'
                        ? 'แก้ไขบางส่วน'
                        : 'ปิดข้อพิพาท'}
                </p>
              </div>
              {dispute.resolutionNotes && (
                <div>
                  <p className="text-xs text-gray-600">หมายเหตุ</p>
                  <p className="whitespace-pre-wrap">{dispute.resolutionNotes}</p>
                </div>
              )}
              {dispute.buyerRefundPercent !== null && (
                <div>
                  <p className="text-xs text-gray-600">เปอร์เซ็นต์คืนเงินผู้ซื้อ</p>
                  <p>{dispute.buyerRefundPercent}%</p>
                </div>
              )}
              {dispute.sellerReleasePercent !== null && (
                <div>
                  <p className="text-xs text-gray-600">เปอร์เซ็นต์ปล่อยเงินผู้ขาย</p>
                  <p>{dispute.sellerReleasePercent}%</p>
                </div>
              )}
              {dispute.resolvedAt && (
                <div>
                  <p className="text-xs text-gray-600">แก้ไขเมื่อ</p>
                  <p>{formatDate(dispute.resolvedAt)}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
