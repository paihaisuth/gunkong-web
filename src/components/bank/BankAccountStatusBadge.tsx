'use client'

import { ShBadge } from '@/components/ui/badge'
import type { BankAccountVerificationStatus } from '@/types/bankAccount'

interface BankAccountStatusBadgeProps {
    status: BankAccountVerificationStatus
    isPrimary?: boolean
}

export function BankAccountStatusBadge({
    status,
    isPrimary,
}: BankAccountStatusBadgeProps) {
    const getVariant = () => {
        switch (status) {
            case 'VERIFIED':
                return 'default'
            case 'PENDING':
                return 'secondary'
            case 'REJECTED':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'VERIFIED':
                return 'ยืนยันแล้ว'
            case 'PENDING':
                return 'รอการตรวจสอบ'
            case 'REJECTED':
                return 'ไม่อนุมัติ'
            default:
                return 'ไม่ทราบ'
        }
    }

    return (
        <div className="flex gap-2 flex-wrap">
            <ShBadge variant={getVariant()}>
                {getStatusText()}
            </ShBadge>
            {isPrimary && status === 'VERIFIED' && (
                <ShBadge variant="default">
                    บัญชีหลัก
                </ShBadge>
            )}
        </div>
    )
}
