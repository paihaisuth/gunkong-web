'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { BankAccountList } from '@/components/bank/BankAccountList'
import { AddBankAccountDialog } from '@/components/bank/AddBankAccountDialog'

export function BankAccountSection() {
    const [isAccountsLoading, setIsAccountsLoading] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShIcon name="building-2" size={20} />
                    บัญชีธนาคาร
                </CardTitle>
                <AddBankAccountDialog
                    onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                    trigger={
                        <ShButton size="sm" disabled={isAccountsLoading}>
                            <ShIcon name="plus" size={14} className="mr-2" />
                            เพิ่ม
                        </ShButton>
                    }
                />
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-sm text-blue-900">
                            <ShIcon
                                name="info"
                                size={16}
                                className="inline mr-2 align-text-bottom"
                            />
                            บัญชีธนาคารของคุณจะต้องผ่านการตรวจสอบจากแอดมิน
                            ก่อนที่คุณจะสามารถรับเงินจากการขาย
                        </p>
                    </div>

                    <BankAccountList
                        key={refreshTrigger}
                        onLoadingChange={setIsAccountsLoading}
                        onAccountDeleted={() =>
                            setRefreshTrigger((prev) => prev + 1)
                        }
                    />
                </div>
            </CardContent>
        </Card>
    )
}
