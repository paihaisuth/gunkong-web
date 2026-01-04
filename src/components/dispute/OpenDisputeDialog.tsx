'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { ShLabel } from '@/components/ui/label'
import { toast } from 'sonner'
import { openDispute } from '@/services/dispute'
import { DisputeReason } from '@/types/dispute'

interface OpenDisputeDialogProps {
  roomCode: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const disputeSchema = z.object({
  reason: z.enum(
    [
      'ITEM_NOT_RECEIVED',
      'ITEM_NOT_AS_DESCRIBED',
      'ITEM_DAMAGED',
      'PAYMENT_ISSUE',
      'SHIPPING_ISSUE',
      'SELLER_NOT_SHIPPING',
      'BUYER_NOT_CONFIRMING',
      'OTHER',
    ],
    {
      errorMap: () => ({ message: 'กรุณาเลือกเหตุผล' }),
    }
  ),
  description: z
    .string()
    .min(20, 'คำอธิบายต้องมีอย่างน้อย 20 ตัวอักษร')
    .max(2000, 'คำอธิบายไม่ควรเกิน 2000 ตัวอักษร'),
})

type DisputeFormData = z.infer<typeof disputeSchema>

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

export function OpenDisputeDialog({
  roomCode,
  onSuccess,
  trigger,
}: OpenDisputeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DisputeFormData>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      reason: undefined,
      description: '',
    },
  })

  const onSubmit = async (data: DisputeFormData) => {
    setIsSubmitting(true)
    try {
      await openDispute(roomCode, {
        reason: data.reason,
        description: data.description,
      })
      toast.success('เปิดข้อพิพาทสำเร็จ', {
        description: 'ข้อพิพาทของคุณได้ถูกส่งให้ผู้ดูแลระบบแล้ว',
      })
      setIsOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Open dispute error:', error)
      toast.error('ไม่สามารถเปิดข้อพิพาท', {
        description: 'กรุณาลองใหม่อีกครั้งหรือติดต่อฝ่ายสนับสนุน',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <ShButton variant="destructive" size="sm">
            <ShIcon name="alert-circle" size={14} className="mr-1" />
            เปิดข้อพิพาท
          </ShButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เปิดข้อพิพาทสำหรับสินค้า</DialogTitle>
          <DialogDescription>
            อธิบายปัญหาที่คุณพบและวิธีแก้ปัญหาที่คุณต้องการ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <ShLabel htmlFor="reason">เหตุผล</ShLabel>
            <select
              id="reason"
              {...form.register('reason')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกเหตุผล</option>
              {Object.entries(reasonLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {form.formState.errors.reason && (
              <p className="text-sm text-red-600">
                {form.formState.errors.reason.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <ShLabel htmlFor="description">คำอธิบายรายละเอียด</ShLabel>
            <textarea
              id="description"
              placeholder="โปรดอธิบายรายละเอียดเกี่ยวกับปัญหา (ต้องมีอย่างน้อย 20 ตัวอักษร)"
              rows={5}
              {...form.register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm text-blue-900 flex items-start gap-2">
              <ShIcon
                name="info"
                size={16}
                className="flex-shrink-0 mt-0.5"
              />
              <span>
                ผู้ดูแลระบบจะตรวจสอบข้อพิพาทของคุณและตัดสินใจตามหลักฐานที่ได้รับ
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <ShButton
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              ยกเลิก
            </ShButton>
            <ShButton
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'เปิดข้อพิพาท'}
            </ShButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
