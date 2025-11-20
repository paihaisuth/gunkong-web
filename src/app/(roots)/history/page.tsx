'use client'

import { useState } from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { TransactionHistoryList } from './components/TransactionHistoryList'
import { JoinedRoomsList } from './components/JoinedRoomsList'

type ViewMode = 'transactions' | 'rooms'

export default function HistoryPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('transactions')

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>ประวัติ</CardTitle>
                    <CardDescription>
                        ดูประวัติธุรกรรมและห้องที่คุณเข้าร่วม
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex gap-2">
                <ShButton
                    variant={
                        viewMode === 'transactions' ? 'default' : 'outline'
                    }
                    onClick={() => setViewMode('transactions')}
                    className="flex-1"
                >
                    <ShIcon name="credit-card" size={16} className="mr-2" />
                    ประวัติธุรกรรม
                </ShButton>
                <ShButton
                    variant={viewMode === 'rooms' ? 'default' : 'outline'}
                    onClick={() => setViewMode('rooms')}
                    className="flex-1"
                >
                    <ShIcon name="store" size={16} className="mr-2" />
                    ห้องที่เข้าร่วม
                </ShButton>
            </div>

            {viewMode === 'transactions' ? (
                <TransactionHistoryList />
            ) : (
                <JoinedRoomsList />
            )}
        </div>
    )
}
