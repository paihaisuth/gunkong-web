'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ShButton } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ShIcon } from '@/components/ui/icon'
import { ShImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { submitPayment, type SubmitPaymentSchema } from '@/services/payment'

const paymentSchema = z.object({
    slipImages: z
        .array(z.string())
        .min(1, 'กรุณาอัปโหลดสลิปการโอนเงิน')
        .max(1, 'อัปโหลดได้เพียง 1 รูปเท่านั้น'),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentDialogProps {
    roomCode: string
    totalAmount: number
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function PaymentDialog({
    roomCode,
    totalAmount,
    onSuccess,
    trigger,
}: PaymentDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            slipImages: [],
        },
    })

    const onSubmit = async (data: PaymentFormData) => {
        try {
            // TODO: Upload image to cloud storage and get URL + publicId
            // For now, we'll use a placeholder structure
            const payload: SubmitPaymentSchema = {
                roomCode,
                provider: 'BANK_TRANSFER',
                slipImage: {
                    url: data.slipImages[0], // This should be the cloud URL
                    publicId: 'slip_' + Date.now(), // This should be from cloud storage
                },
            }

            await submitPayment(payload)
            toast.success('ส่งการชำระเงินสำเร็จ', {
                description: 'รอแอดมินตรวจสอบและยืนยันการชำระเงิน',
            })

            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Payment error:', error)
            toast.error('ไม่สามารถส่งการชำระเงินได้', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <ShButton className="w-full">
                        <ShIcon name="credit-card" size={16} className="mr-2" />
                        ชำระเงิน
                    </ShButton>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ชำระเงินผ่านการโอนเงิน</DialogTitle>
                    <DialogDescription>
                        โอนเงินเข้าบัญชีด้านล่างและอัปโหลดสลิปการโอน
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                ยอดที่ต้องชำระ:
                            </span>
                            <span className="text-2xl font-bold text-primary">
                                ฿{(totalAmount / 100).toLocaleString()}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            เงินจะถูกพักไว้ใน Escrow
                            จนกว่าคุณจะยืนยันการรับสินค้า
                        </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                        <h4 className="font-medium flex items-center gap-2">
                            <ShIcon name="building-2" size={16} />
                            บัญชีรับโอน
                        </h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    ธนาคาร:
                                </span>
                                <span className="font-medium">กสิกรไทย</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    เลขที่บัญชี:
                                </span>
                                <span className="font-mono font-medium">
                                    123-4-56789-0
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    ชื่อบัญชี:
                                </span>
                                <span className="font-medium">
                                    Gunkong Escrow
                                </span>
                            </div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="slipImages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            อัปโหลดสลิปการโอนเงิน{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShImageUpload
                                                maxImages={1}
                                                onImagesChange={field.onChange}
                                                existingImages={field.value}
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
                                        ? 'กำลังส่ง...'
                                        : 'ยืนยันการชำระเงิน'}
                                </ShButton>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
