'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ShInput } from '@/components/ui/input'
import { toast } from 'sonner'
import {
    joinRoom,
    cancelRoom,
    markAsShipped,
    completeRoom,
} from '@/services/room'

interface RoomActionsProps {
    roomCode: string
    roomStatus: string
    currentUserId: string
    sellerId: string
    buyerId: string | null
    onSuccess?: () => void
}

export function RoomActions({
    roomCode,
    roomStatus,
    currentUserId,
    sellerId,
    buyerId,
    onSuccess,
}: RoomActionsProps) {
    const [isJoining, setIsJoining] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)

    const isSeller = currentUserId === sellerId
    const isBuyer = currentUserId === buyerId
    const canJoin = !buyerId && roomStatus === 'CREATED' && !isSeller

    const handleJoinRoom = async () => {
        try {
            setIsJoining(true)
            await joinRoom({ roomCode })
            toast.success('เข้าร่วมห้องสำเร็จ')
            onSuccess?.()
        } catch (error) {
            console.error('Join room error:', error)
            toast.error('ไม่สามารถเข้าร่วมห้องได้')
        } finally {
            setIsJoining(false)
        }
    }

    const handleCompleteRoom = async () => {
        try {
            setIsCompleting(true)
            await completeRoom({ roomCode })
            toast.success('ยืนยันการรับสินค้าสำเร็จ', {
                description: 'ธุรกรรมเสร็จสมบูรณ์',
            })
            onSuccess?.()
        } catch (error) {
            console.error('Complete room error:', error)
            toast.error('ไม่สามารถยืนยันการรับสินค้าได้')
        } finally {
            setIsCompleting(false)
        }
    }

    return (
        <div className="space-y-3">
            {canJoin && (
                <ShButton
                    className="w-full"
                    onClick={handleJoinRoom}
                    disabled={isJoining}
                >
                    <ShIcon name="user-plus" size={16} className="mr-2" />
                    {isJoining ? 'กำลังเข้าร่วม...' : 'เข้าร่วมห้อง'}
                </ShButton>
            )}

            {isSeller && roomStatus === 'PAID' && (
                <MarkAsShippedDialog
                    roomCode={roomCode}
                    onSuccess={onSuccess}
                />
            )}

            {isBuyer && roomStatus === 'SHIPPED' && (
                <ShButton
                    className="w-full"
                    onClick={handleCompleteRoom}
                    disabled={isCompleting}
                >
                    <ShIcon name="check-circle" size={16} className="mr-2" />
                    {isCompleting ? 'กำลังยืนยัน...' : 'ยืนยันการรับสินค้า'}
                </ShButton>
            )}

            {(isSeller || isBuyer) &&
                roomStatus !== 'COMPLETED' &&
                roomStatus !== 'CANCELLED' && (
                    <CancelRoomDialog
                        roomCode={roomCode}
                        onSuccess={onSuccess}
                    />
                )}
        </div>
    )
}

const markAsShippedSchema = z.object({
    trackingNumber: z
        .string()
        .min(3, 'เลขพัสดุต้องมีอย่างน้อย 3 ตัวอักษร')
        .max(100, 'เลขพัสดุต้องไม่เกิน 100 ตัวอักษร'),
})

type MarkAsShippedFormData = z.infer<typeof markAsShippedSchema>

function MarkAsShippedDialog({
    roomCode,
    onSuccess,
}: {
    roomCode: string
    onSuccess?: () => void
}) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<MarkAsShippedFormData>({
        resolver: zodResolver(markAsShippedSchema),
        defaultValues: {
            trackingNumber: '',
        },
    })

    const onSubmit = async (data: MarkAsShippedFormData) => {
        try {
            await markAsShipped({
                roomCode,
                trackingNumber: data.trackingNumber,
            })
            toast.success('บันทึกการจัดส่งสำเร็จ')
            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Mark as shipped error:', error)
            toast.error('ไม่สามารถบันทึกการจัดส่งได้')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ShButton className="w-full">
                    <ShIcon name="truck" size={16} className="mr-2" />
                    บันทึกการจัดส่ง
                </ShButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>บันทึกการจัดส่ง</DialogTitle>
                    <DialogDescription>
                        กรอกเลขพัสดุเพื่อยืนยันว่าได้ส่งสินค้าแล้ว
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="trackingNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        เลขพัสดุ (Tracking Number){' '}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="เช่น TH1234567890"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 pt-4">
                            <ShButton
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                ยกเลิก
                            </ShButton>
                            <ShButton
                                type="submit"
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? 'กำลังบันทึก...'
                                    : 'บันทึกการจัดส่ง'}
                            </ShButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const cancelRoomSchema = z.object({
    reason: z
        .string()
        .max(1000, 'เหตุผลต้องไม่เกิน 1000 ตัวอักษร')
        .optional(),
})

type CancelRoomFormData = z.infer<typeof cancelRoomSchema>

function CancelRoomDialog({
    roomCode,
    onSuccess,
}: {
    roomCode: string
    onSuccess?: () => void
}) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<CancelRoomFormData>({
        resolver: zodResolver(cancelRoomSchema),
        defaultValues: {
            reason: '',
        },
    })

    const onSubmit = async (data: CancelRoomFormData) => {
        try {
            await cancelRoom({
                roomCode,
                reason: data.reason,
            })
            toast.success('ยกเลิกธุรกรรมสำเร็จ')
            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Cancel room error:', error)
            toast.error('ไม่สามารถยกเลิกธุรกรรมได้')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ShButton variant="destructive" className="w-full">
                    <ShIcon name="x-circle" size={16} className="mr-2" />
                    ยกเลิกธุรกรรม
                </ShButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>ยกเลิกธุรกรรม</DialogTitle>
                    <DialogDescription>
                        คุณต้องการยกเลิกธุรกรรมนี้ใช่หรือไม่?
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>เหตุผล (ไม่บังคับ)</FormLabel>
                                    <FormControl>
                                        <textarea
                                            placeholder="ระบุเหตุผลในการยกเลิก..."
                                            className="w-full p-3 border border-input bg-background rounded-md text-sm resize-none"
                                            rows={3}
                                            maxLength={1000}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            <div className="flex gap-2">
                                <ShIcon name="alert-triangle" size={16} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">คำเตือน</p>
                                    <p className="text-xs mt-1">
                                        การยกเลิกจะคืนเงินให้ผู้ซื้อ (หากมีการชำระเงินแล้ว)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <ShButton
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                ยกเลิก
                            </ShButton>
                            <ShButton
                                type="submit"
                                variant="destructive"
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? 'กำลังยกเลิก...'
                                    : 'ยืนยันการยกเลิก'}
                            </ShButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
