'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { ShButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShIcon } from '@/components/ui/icon'
import { ShLabel } from '@/components/ui/label'
import { ShInput } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  adminGetDisputeDetails,
  adminTakeUnderReview,
  adminResolveDispute,
  adminAddNote,
} from '@/services/dispute'
import { Dispute, DisputeResolution } from '@/types/dispute'
import { DisputeDetails } from '@/components/dispute/DisputeDetails'
import { DisputeChat } from '@/components/dispute/DisputeChat'

const resolveSchema = z.object({
  resolution: z.enum(
    ['RESOLVED_BUYER_FAVOR', 'RESOLVED_SELLER_FAVOR', 'RESOLVED_PARTIAL', 'CLOSED'],
    {
      message: 'กรุณาเลือกการแก้ไข',
    }
  ),
  notes: z
    .string()
    .min(10, 'หมายเหตุต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(2000, 'หมายเหตุไม่ควรเกิน 2000 ตัวอักษร'),
  buyerRefundPercent: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  sellerReleasePercent: z
    .number()
    .min(0)
    .max(100)
    .optional(),
})

type ResolveFormData = z.infer<typeof resolveSchema>

const noteSchema = z.object({
  note: z
    .string()
    .min(1, 'หมายเหตุต้องไม่ว่าง')
    .max(2000, 'หมายเหตุไม่ควรเกิน 2000 ตัวอักษร'),
})

type NoteFormData = z.infer<typeof noteSchema>

export default function AdminDisputeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [takingUnderReview, setTakingUnderReview] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [showResolveForm, setShowResolveForm] = useState(false)
  const [selectedResolution, setSelectedResolution] = useState<DisputeResolution | null>(null)

  const disputeCode = params.code as string

  const resolveForm = useForm<ResolveFormData>({
    resolver: zodResolver(resolveSchema),
    defaultValues: {
      resolution: undefined,
      notes: '',
      buyerRefundPercent: undefined,
      sellerReleasePercent: undefined,
    },
  })

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: '',
    },
  })

  useEffect(() => {
    fetchDisputeDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeCode])

  const fetchDisputeDetails = async () => {
    try {
      setLoading(true)
      const response = await adminGetDisputeDetails(disputeCode)
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

  const handleTakeUnderReview = async () => {
    try {
      setTakingUnderReview(true)
      await adminTakeUnderReview(disputeCode)
      toast.success('อัปเดตสถานะเป็นอยู่ระหว่างตรวจสอบสำเร็จ')
      await fetchDisputeDetails()
    } catch (error) {
      console.error('Take under review error:', error)
      toast.error('ไม่สามารถอัปเดตสถานะได้')
    } finally {
      setTakingUnderReview(false)
    }
  }

  const onResolveSubmit = async (data: ResolveFormData) => {
    try {
      setIsResolving(true)
      await adminResolveDispute(disputeCode, {
        resolution: data.resolution,
        notes: data.notes,
        buyerRefundPercent: data.buyerRefundPercent,
        sellerReleasePercent: data.sellerReleasePercent,
      })
      toast.success('แก้ไขข้อพิพาทสำเร็จ')
      setShowResolveForm(false)
      resolveForm.reset()
      await fetchDisputeDetails()
    } catch (error) {
      console.error('Resolve dispute error:', error)
      toast.error('ไม่สามารถแก้ไขข้อพิพาทได้')
    } finally {
      setIsResolving(false)
    }
  }

  const onAddNote = async (data: NoteFormData) => {
    try {
      await adminAddNote(disputeCode, { note: data.note })
      toast.success('เพิ่มหมายเหตุสำเร็จ')
      noteForm.reset()
      await fetchDisputeDetails()
    } catch (error) {
      console.error('Add note error:', error)
      toast.error('ไม่สามารถเพิ่มหมายเหตุได้')
    }
  }

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

  const isResolved = dispute.status.includes('RESOLVED') || dispute.status === 'CLOSED'

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <ShButton variant="ghost" size="icon" onClick={() => router.back()}>
          <ShIcon name="arrow-left" size={20} />
        </ShButton>
        <div>
          <h1 className="text-2xl font-bold">ข้อพิพาท {dispute.disputeCode}</h1>
          <p className="text-muted-foreground">บริหารจัดการและแก้ไขข้อพิพาท</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DisputeDetails dispute={dispute} />
          <DisputeChat dispute={dispute} onMessageAdded={fetchDisputeDetails} />
        </div>

        <div className="space-y-6">
          {!isResolved && dispute.status === 'OPEN' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">สถานะ</CardTitle>
              </CardHeader>
              <CardContent>
                <ShButton
                  onClick={handleTakeUnderReview}
                  disabled={takingUnderReview}
                  className="w-full"
                >
                  {takingUnderReview ? (
                    <>
                      <ShIcon name="loader-2" size={14} className="mr-2 animate-spin" />
                      กำลังอัปเดต...
                    </>
                  ) : (
                    'อัปเดตเป็นอยู่ระหว่างตรวจสอบ'
                  )}
                </ShButton>
              </CardContent>
            </Card>
          )}

          {!isResolved && dispute.status === 'UNDER_REVIEW' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">แก้ไขข้อพิพาท</CardTitle>
              </CardHeader>
              <CardContent>
                {showResolveForm ? (
                  <form
                    onSubmit={resolveForm.handleSubmit(onResolveSubmit)}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <ShLabel htmlFor="resolution">การแก้ไข</ShLabel>
                      <select
                        id="resolution"
                        {...resolveForm.register('resolution')}
                        onChange={(e) => {
                          resolveForm.setValue('resolution', e.target.value as DisputeResolution)
                          setSelectedResolution(e.target.value as DisputeResolution)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">เลือกการแก้ไข</option>
                        <option value="RESOLVED_BUYER_FAVOR">คืนเงินให้ผู้ซื้อ</option>
                        <option value="RESOLVED_SELLER_FAVOR">ปล่อยเงินให้ผู้ขาย</option>
                        <option value="RESOLVED_PARTIAL">แก้ไขบางส่วน</option>
                        <option value="CLOSED">ปิดข้อพิพาท</option>
                      </select>
                      {resolveForm.formState.errors.resolution && (
                        <p className="text-xs text-red-600">
                          {resolveForm.formState.errors.resolution.message}
                        </p>
                      )}
                    </div>

                    {selectedResolution === 'RESOLVED_PARTIAL' && (
                      <>
                        <div className="space-y-2">
                          <ShLabel htmlFor="buyerRefundPercent">
                            เปอร์เซ็นต์คืนเงินผู้ซื้อ
                          </ShLabel>
                          <ShInput
                            id="buyerRefundPercent"
                            type="number"
                            min="0"
                            max="100"
                            {...resolveForm.register('buyerRefundPercent', {
                              valueAsNumber: true,
                            })}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <ShLabel htmlFor="sellerReleasePercent">
                            เปอร์เซ็นต์ปล่อยเงินผู้ขาย
                          </ShLabel>
                          <ShInput
                            id="sellerReleasePercent"
                            type="number"
                            min="0"
                            max="100"
                            {...resolveForm.register('sellerReleasePercent', {
                              valueAsNumber: true,
                            })}
                            className="text-sm"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <ShLabel htmlFor="notes">หมายเหตุการแก้ไข</ShLabel>
                      <textarea
                        id="notes"
                        placeholder="อธิบายเหตุผลในการแก้ไข..."
                        rows={4}
                        {...resolveForm.register('notes')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {resolveForm.formState.errors.notes && (
                        <p className="text-xs text-red-600">
                          {resolveForm.formState.errors.notes.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <ShButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResolveForm(false)}
                        disabled={isResolving}
                      >
                        ยกเลิก
                      </ShButton>
                      <ShButton
                        type="submit"
                        size="sm"
                        disabled={isResolving}
                      >
                        {isResolving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                      </ShButton>
                    </div>
                  </form>
                ) : (
                  <ShButton
                    onClick={() => setShowResolveForm(true)}
                    className="w-full"
                  >
                    <ShIcon name="check-circle" size={14} className="mr-2" />
                    เริ่มแก้ไข
                  </ShButton>
                )}
              </CardContent>
            </Card>
          )}

          {dispute.status === 'UNDER_REVIEW' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">เพิ่มหมายเหตุภายใน</CardTitle>
                <CardDescription className="text-xs">
                  สำหรับติดตามการสอบสวน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={noteForm.handleSubmit(onAddNote)}
                  className="space-y-2"
                >
                  <textarea
                    placeholder="เพิ่มหมายเหตุสำหรับติดตาม..."
                    rows={3}
                    {...noteForm.register('note')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {noteForm.formState.errors.note && (
                    <p className="text-xs text-red-600">
                      {noteForm.formState.errors.note.message}
                    </p>
                  )}
                  <ShButton
                    type="submit"
                    size="sm"
                    className="w-full"
                  >
                    <ShIcon name="plus" size={14} className="mr-2" />
                    เพิ่มหมายเหตุ
                  </ShButton>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
