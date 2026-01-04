'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import {
    getMyBankAccounts,
    setPrimaryAccount,
    deleteBankAccount,
} from '@/services/bankAccount'
import { BankAccountStatusBadge } from './BankAccountStatusBadge'
import type { BankAccount } from '@/types/bankAccount'

interface BankAccountListProps {
    onLoadingChange?: (isLoading: boolean) => void
    onAccountDeleted?: () => void
}

export function BankAccountList({
    onLoadingChange,
    onAccountDeleted,
}: BankAccountListProps) {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actioningId, setActioningId] = useState<string | null>(null)

    const loadAccounts = useCallback(async () => {
        setIsLoading(true)
        onLoadingChange?.(true)
        try {
            const response = await getMyBankAccounts()
            if (response.data?.data?.items) {
                setAccounts(response.data.data.items)
            }
        } catch (error) {
            console.error('Load bank accounts error:', error)
            toast.error('ไม่สามารถโหลดบัญชีธนาคาร', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            })
        } finally {
            setIsLoading(false)
            onLoadingChange?.(false)
        }
    }, [onLoadingChange])

    useEffect(() => {
        loadAccounts()
    }, [loadAccounts])

    const handleSetPrimary = async (accountId: string) => {
        setActioningId(accountId)
        try {
            await setPrimaryAccount(accountId)
            toast.success('ตั้งเป็นบัญชีหลักสำเร็จ')
            await loadAccounts()
        } catch (error) {
            console.error('Set primary account error:', error)
            toast.error('ไม่สามารถตั้งเป็นบัญชีหลัก', {
                description: 'เฉพาะบัญชีที่ยืนยันแล้วเท่านั้น',
            })
        } finally {
            setActioningId(null)
        }
    }

    const handleDelete = async (accountId: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?')) {
            return
        }

        setActioningId(accountId)
        try {
            await deleteBankAccount(accountId)
            toast.success('ลบบัญชีธนาคารสำเร็จ')
            await loadAccounts()
            onAccountDeleted?.()
        } catch (error) {
            console.error('Delete bank account error:', error)
            toast.error('ไม่สามารถลบบัญชีธนาคาร', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            })
        } finally {
            setActioningId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 bg-muted rounded-lg animate-pulse"
                    />
                ))}
            </div>
        )
    }

    if (accounts.length === 0) {
        return (
            <EmptyState
                icon="building-2"
                title="ยังไม่มีบัญชีธนาคาร"
                description="เพิ่มบัญชีธนาคารของคุณเพื่อรับเงินจากการขาย"
            />
        )
    }

    return (
        <div className="space-y-3">
            {accounts.map((account) => (
                <Card
                    key={account.id}
                    className="hover:shadow-md transition-shadow"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShIcon
                                        name="building-2"
                                        size={20}
                                        className="text-muted-foreground"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-sm">
                                            {account.bankName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {account.accountName}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-muted rounded px-3 py-2 mb-3 font-mono text-sm">
                                    {account.accountNumber}
                                </div>

                                <div className="flex items-center gap-2">
                                    <BankAccountStatusBadge
                                        status={account.verificationStatus}
                                        isPrimary={account.isPrimary}
                                    />
                                </div>

                                {account.verificationStatus === 'REJECTED' &&
                                    account.rejectionReason && (
                                        <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/30">
                                            <p className="text-xs text-destructive font-medium mb-1">
                                                เหตุผลการไม่อนุมัติ:
                                            </p>
                                            <p className="text-xs text-destructive/80">
                                                {account.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                {account.verificationStatus === 'VERIFIED' &&
                                    !account.isPrimary && (
                                        <ShButton
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleSetPrimary(account.id)
                                            }
                                            disabled={
                                                actioningId === account.id
                                            }
                                        >
                                            <ShIcon
                                                name="star"
                                                size={14}
                                                className="mr-1"
                                            />
                                            ตั้งเป็นหลัก
                                        </ShButton>
                                    )}

                                <ShButton
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(account.id)}
                                    disabled={actioningId === account.id}
                                >
                                    <ShIcon name="trash-2" size={14} />
                                </ShButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
