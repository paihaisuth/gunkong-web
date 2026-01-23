'use client'

import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShBadge } from '@/components/ui/badge'
import { ShIcon } from '@/components/ui/icon'
import { getPayment } from '@/services/payment'
import { Payment } from '@/services/room'

interface PaymentStatusCardProps {
    roomCode: string
}

type PaymentStatusIconName =
    | 'clock'
    | 'shield'
    | 'check-circle'
    | 'arrow-left-circle'

const paymentStatusConfig: Record<
    string,
    {
        label: string
        icon: PaymentStatusIconName
        color: string
        bgColor: string
        variant: 'secondary' | 'default' | 'outline'
    }
> = {
    PENDING: {
        label: 'รอตรวจสอบ',
        icon: 'clock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        variant: 'secondary',
    },
    HELD: {
        label: 'พักเงินแล้ว',
        icon: 'shield',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        variant: 'default',
    },
    RELEASED: {
        label: 'จ่ายให้ผู้ขายแล้ว',
        icon: 'check-circle',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        variant: 'default',
    },
    REFUNDED: {
        label: 'คืนเงินแล้ว',
        icon: 'arrow-left-circle',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        variant: 'outline',
    },
}

const providerLabels = {
    OMISE: 'บัตรเครดิต/เดบิต',
    PROMPTPAY: 'พร้อมเพย์',
    BANK_TRANSFER: 'โอนเงินผ่านธนาคาร',
}

export function PaymentStatusCard({ roomCode }: PaymentStatusCardProps) {
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    useEffect(() => {
        if (!isFirstLoad) return
        const fetchPayment = async () => {
            try {
                setLoading(true)
                setIsFirstLoad(false)
                const response = await getPayment({ roomCode })
                if (response.data?.data?.item) {
                    setPayment(response.data.data.item)
                }
            } catch (err) {
                console.error('Error fetching payment:', err)
                setError('ไม่สามารถโหลดข้อมูลการชำระเงินได้')
            } finally {
                setLoading(false)
            }
        }

        fetchPayment()
    }, [roomCode])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>สถานะการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error || !payment) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>สถานะการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <ShIcon
                            name="alert-circle"
                            size={24}
                            className="mx-auto mb-2"
                        />
                        <p className="text-sm">
                            {error || 'ยังไม่มีการชำระเงิน'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const statusConfig = paymentStatusConfig[payment.status]

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>สถานะการชำระเงิน</CardTitle>
                    <ShBadge variant={statusConfig.variant}>
                        {statusConfig.label}
                    </ShBadge>
                </div>
                <CardDescription>
                    {providerLabels[payment.provider]}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            จำนวนเงิน:
                        </span>
                        <span className="font-semibold">
                            ฿{(payment.amountCents / 100).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            ช่องทางการชำระ:
                        </span>
                        <span>{providerLabels[payment.provider]}</span>
                    </div>

                    {payment.omiseChargeId && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                รหัสธุรกรรม:
                            </span>
                            <span className="font-mono text-xs">
                                {payment.omiseChargeId}
                            </span>
                        </div>
                    )}

                    {payment.slipImage && (
                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground mb-2">
                                สลิปการโอน:
                            </p>
                            <a
                                href={payment.slipImage.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full rounded-lg border overflow-hidden hover:border-primary transition-colors"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={payment.slipImage.url}
                                    alt="Payment Slip"
                                    className="w-full h-auto"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            '/placeholder-slip.png'
                                    }}
                                />
                            </a>
                        </div>
                    )}
                </div>

                <div className={`rounded-lg p-3 ${statusConfig.bgColor}`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${statusConfig.color}`}>
                            <ShIcon name={statusConfig.icon} size={20} />
                        </div>
                        <div className="flex-1">
                            <p
                                className={`font-medium text-sm ${statusConfig.color}`}
                            >
                                {statusConfig.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getStatusDescription(payment.status)}
                            </p>
                            {payment.heldAt && payment.status === 'HELD' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    เมื่อ{' '}
                                    {new Date(payment.heldAt).toLocaleString(
                                        'th-TH',
                                    )}
                                </p>
                            )}
                            {payment.releasedAt &&
                                payment.status === 'RELEASED' && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        เมื่อ{' '}
                                        {new Date(
                                            payment.releasedAt,
                                        ).toLocaleString('th-TH')}
                                    </p>
                                )}
                            {payment.refundedAt &&
                                payment.status === 'REFUNDED' && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        เมื่อ{' '}
                                        {new Date(
                                            payment.refundedAt,
                                        ).toLocaleString('th-TH')}
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function getStatusDescription(status: string): string {
    switch (status) {
        case 'PENDING':
            return 'รอแอดมินตรวจสอบและยืนยันการชำระเงิน'
        case 'HELD':
            return 'เงินถูกพักไว้ใน Escrow จนกว่าผู้ซื้อจะยืนยันการรับสินค้า'
        case 'RELEASED':
            return 'เงินได้ถูกโอนให้ผู้ขายเรียบร้อยแล้ว'
        case 'REFUNDED':
            return 'เงินได้ถูกคืนให้ผู้ซื้อเรียบร้อยแล้ว'
        default:
            return ''
    }
}
