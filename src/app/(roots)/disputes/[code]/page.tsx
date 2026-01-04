'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { toast } from 'sonner'
import {
  getDisputeByCode,
} from '@/services/dispute'
import { Dispute } from '@/types/dispute'
import { DisputeDetails } from '@/components/dispute/DisputeDetails'
import { DisputeChat } from '@/components/dispute/DisputeChat'

export default function UserDisputeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)

  const disputeCode = params.code as string

  const fetchDisputeDetails = async () => {
    try {
      setLoading(true)
      const response = await getDisputeByCode(disputeCode)
      if (response.data?.data?.item) {
        setDispute(response.data.data.item)
      }
    } catch (error) {
      console.error('Fetch dispute error:', error)
      toast.error('ไม่สามารถโหลดข้อพิพาท')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDisputeDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeCode])

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <ShButton variant="ghost" size="icon" onClick={() => router.back()}>
            <ShIcon name="arrow-left" size={20} />
          </ShButton>
          <h1 className="text-2xl font-bold">กำลังโหลด...</h1>
        </div>
      </div>
    )
  }

  if (!dispute) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <ShButton variant="ghost" size="icon" onClick={() => router.back()}>
            <ShIcon name="arrow-left" size={20} />
          </ShButton>
          <h1 className="text-2xl font-bold">ไม่พบข้อพิพาท</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <ShButton variant="ghost" size="icon" onClick={() => router.back()}>
          <ShIcon name="arrow-left" size={20} />
        </ShButton>
        <div>
          <h1 className="text-2xl font-bold">ข้อพิพาท {dispute.disputeCode}</h1>
          <p className="text-muted-foreground">ดูรายละเอียดและเพิ่มข้อมูลเพิ่มเติม</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DisputeDetails dispute={dispute} />
          <DisputeChat dispute={dispute} onMessageAdded={fetchDisputeDetails} />
        </div>
      </div>
    </div>
  )
}
