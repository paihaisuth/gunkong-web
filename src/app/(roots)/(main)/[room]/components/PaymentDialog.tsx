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
import { ShInput } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { ShIcon } from '@/components/ui/icon'
import { ShBadge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { submitPayment, type SubmitPaymentSchema } from '@/services/payment'

const paymentSchema = z.object({
    provider: z.enum(['OMISE', 'PROMPTPAY', 'BANK_TRANSFER'], {
        required_error: 'กรุณาเลือกช่องทางการชำระเงิน',
    }),
    omiseToken: z.string().optional(),
    slipImageUrl: z.string().url('URL รูปภาพไม่ถูกต้อง').optional().or(z.literal('')),
    slipImagePublicId: z.string().optional(),
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
    const [selectedProvider, setSelectedProvider] = useState<string>('BANK_TRANSFER')

    const form = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            provider: 'BANK_TRANSFER',
            omiseToken: '',
            slipImageUrl: '',
            slipImagePublicId: '',
        },
    })

    const onSubmit = async (data: PaymentFormData) => {
        try {
            const payload: SubmitPaymentSchema = {
                roomCode,
                provider: data.provider,
            }

            if (data.provider === 'OMISE' && data.omiseToken) {
                payload.omiseToken = data.omiseToken
            }

            if (
                data.provider === 'BANK_TRANSFER' &&
                data.slipImageUrl &&
                data.slipImagePublicId
            ) {
                payload.slipImage = {
                    url: data.slipImageUrl,
                    publicId: data.slipImagePublicId,
                }
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

    const providerOptions = [
        {
            value: 'BANK_TRANSFER',
            label: 'โอนเงินผ่านธนาคาร',
            icon: 'building-2',
            description: 'โอนเงินและอัปโหลดสลิป',
        },
        {
            value: 'PROMPTPAY',
            label: 'พร้อมเพย์',
            icon: 'smartphone',
            description: 'ชำระผ่าน QR Code',
        },
        {
            value: 'OMISE',
            label: 'บัตรเครดิต/เดบิต',
            icon: 'credit-card',
            description: 'ผ่าน Omise Payment Gateway',
        },
    ]

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
                    <DialogTitle>ชำระเงิน</DialogTitle>
                    <DialogDescription>
                        เลือกช่องทางการชำระเงินและกรอกข้อมูล
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
                            เงินจะถูกพักไว้ใน Escrow จนกว่าคุณจะยืนยันการรับสินค้า
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            ช่องทางการชำระเงิน{' '}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid gap-3">
                                                {providerOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className={`
                                                            relative flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors
                                                            ${
                                                                field.value === option.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border hover:border-primary/50'
                                                            }
                                                        `}
                                                        onClick={() => {
                                                            field.onChange(option.value)
                                                            setSelectedProvider(option.value)
                                                        }}
                                                    >
                                                        <div
                                                            className={`
                                                                mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                                                ${
                                                                    field.value === option.value
                                                                        ? 'border-primary'
                                                                        : 'border-muted-foreground'
                                                                }
                                                            `}
                                                        >
                                                            {field.value === option.value && (
                                                                <div className="w-3 h-3 rounded-full bg-primary" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <ShIcon
                                                                    name={option.icon as any}
                                                                    size={20}
                                                                />
                                                                <span className="font-medium">
                                                                    {option.label}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedProvider === 'OMISE' && (
                                <FormField
                                    control={form.control}
                                    name="omiseToken"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Omise Token{' '}
                                                <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <ShInput
                                                    placeholder="tokn_test_..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Token จะถูกสร้างจาก Omise.js เมื่อกรอกข้อมูลบัตร
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {selectedProvider === 'BANK_TRANSFER' && (
                                <>
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
                                                <span className="font-medium">
                                                    กสิกรไทย
                                                </span>
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

                                    <FormField
                                        control={form.control}
                                        name="slipImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    URL รูปภาพสลิป{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <ShInput
                                                        placeholder="https://example.com/slip.jpg"
                                                        type="url"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    อัปโหลดสลิปไปยัง cloud storage
                                                    แล้วนำ URL มาใส่
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slipImagePublicId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Public ID (ไม่บังคับ)</FormLabel>
                                                <FormControl>
                                                    <ShInput
                                                        placeholder="slip_123"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {selectedProvider === 'PROMPTPAY' && (
                                <div className="rounded-lg border p-4 space-y-3 bg-muted/50">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <ShIcon name="smartphone" size={16} />
                                        สแกน QR Code เพื่อชำระเงิน
                                    </h4>
                                    <div className="flex justify-center p-6 bg-white rounded-lg">
                                        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                                            <p className="text-sm text-muted-foreground text-center">
                                                QR Code จะแสดงที่นี่
                                                <br />
                                                (ต้องเชื่อมต่อ Omise)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-center">
                                        สแกนและชำระเงินผ่านแอปธนาคารของคุณ
                                    </div>
                                </div>
                            )}

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
