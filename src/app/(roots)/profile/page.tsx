'use client'

import { BankAccountSection } from './components/BankAccountSection'

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">โปรไฟล์</h1>
                <p className="text-muted-foreground mt-1">
                    จัดการข้อมูลบัญชีธนาคารของคุณ
                </p>
            </div>

            <div className="grid gap-6">
                <BankAccountSection />
            </div>
        </div>
    )
}
