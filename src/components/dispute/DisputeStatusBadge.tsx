'use client'

import { ShBadge } from '@/components/ui/badge'
import { DisputeStatus } from '@/types/dispute'

interface DisputeStatusBadgeProps {
  status: DisputeStatus
  size?: 'sm' | 'md' | 'lg'
}

export function DisputeStatusBadge({ status, size = 'md' }: DisputeStatusBadgeProps) {
  const statusConfig: Record<DisputeStatus, { label: string; variant: string; bgColor: string }> = {
    OPEN: {
      label: 'เปิดสู่การพิจารณา',
      variant: 'secondary',
      bgColor: 'bg-amber-100',
    },
    UNDER_REVIEW: {
      label: 'อยู่ระหว่างตรวจสอบ',
      variant: 'secondary',
      bgColor: 'bg-blue-100',
    },
    RESOLVED_BUYER_FAVOR: {
      label: 'คืนเงินให้ผู้ซื้อ',
      variant: 'success',
      bgColor: 'bg-green-100',
    },
    RESOLVED_SELLER_FAVOR: {
      label: 'ปล่อยเงินให้ผู้ขาย',
      variant: 'success',
      bgColor: 'bg-green-100',
    },
    RESOLVED_PARTIAL: {
      label: 'แก้ไขบางส่วน',
      variant: 'secondary',
      bgColor: 'bg-cyan-100',
    },
    CLOSED: {
      label: 'ปิดแล้ว',
      variant: 'secondary',
      bgColor: 'bg-gray-100',
    },
  }

  const config = statusConfig[status]
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'

  return (
    <ShBadge className={`${config.bgColor} ${sizeClass}`}>
      {config.label}
    </ShBadge>
  )
}
