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
} from '@/components/ui/form'
import { ShIcon } from '@/components/ui/icon'
import { toast } from 'sonner'
import {
    addShippingAddress,
    updateShippingAddress,
    type AddShippingAddressSchema,
} from '@/services/shipping'

const shippingAddressSchema = z.object({
    recipientName: z
        .string()
        .min(1, 'กรุณากรอกชื่อผู้รับ')
        .max(100, 'ชื่อผู้รับต้องไม่เกิน 100 ตัวอักษร'),
    phone: z
        .string()
        .regex(/^\+?[0-9]{9,15}$/, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-15 หลัก'),
    addressLine1: z
        .string()
        .min(5, 'ที่อยู่ต้องมีอย่างน้อย 5 ตัวอักษร')
        .max(200, 'ที่อยู่ต้องไม่เกิน 200 ตัวอักษร'),
    addressLine2: z.string().max(200, 'ที่อยู่ต้องไม่เกิน 200 ตัวอักษร').optional(),
    district: z
        .string()
        .min(1, 'กรุณากรอกเขต/อำเภอ')
        .max(100, 'เขต/อำเภอต้องไม่เกิน 100 ตัวอักษร'),
    province: z
        .string()
        .min(1, 'กรุณากรอกจังหวัด')
        .max(100, 'จังหวัดต้องไม่เกิน 100 ตัวอักษร'),
    postalCode: z.string().regex(/^\d{5}$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'),
})

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>

interface ShippingAddressDialogProps {
    roomCode: string
    mode: 'add' | 'edit'
    initialData?: Partial<ShippingAddressFormData>
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function ShippingAddressDialog({
    roomCode,
    mode,
    initialData,
    onSuccess,
    trigger,
}: ShippingAddressDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<ShippingAddressFormData>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: initialData || {
            recipientName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            district: '',
            province: '',
            postalCode: '',
        },
    })

    const onSubmit = async (data: ShippingAddressFormData) => {
        try {
            const payload: AddShippingAddressSchema = {
                roomCode,
                ...data,
            }

            if (mode === 'edit') {
                await updateShippingAddress(payload)
                toast.success('แก้ไขที่อยู่จัดส่งสำเร็จ')
            } else {
                await addShippingAddress(payload)
                toast.success('เพิ่มที่อยู่จัดส่งสำเร็จ')
            }

            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Shipping address error:', error)
            toast.error(
                mode === 'edit'
                    ? 'ไม่สามารถแก้ไขที่อยู่จัดส่งได้'
                    : 'ไม่สามารถเพิ่มที่อยู่จัดส่งได้'
            )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <ShButton className="w-full">
                        <ShIcon name="map-pin" size={16} className="mr-2" />
                        {mode === 'edit' ? 'แก้ไขที่อยู่จัดส่ง' : 'เพิ่มที่อยู่จัดส่ง'}
                    </ShButton>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'แก้ไขที่อยู่จัดส่ง' : 'เพิ่มที่อยู่จัดส่ง'}
                    </DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลที่อยู่สำหรับจัดส่งสินค้า
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="recipientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        ชื่อผู้รับ{' '}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="ชื่อ-นามสกุลผู้รับ"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        เบอร์โทรศัพท์{' '}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="0812345678"
                                            type="tel"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        ที่อยู่ (บ้านเลขที่ ถนน){' '}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="เช่น 123 ถนนพระราม 4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="addressLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ที่อยู่เพิ่มเติม (ไม่บังคับ)</FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="เช่น หมู่บ้าน อาคาร ห้อง"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            เขต/อำเภอ{' '}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShInput placeholder="เช่น ปทุมวัน" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            จังหวัด{' '}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShInput placeholder="เช่น กรุงเทพฯ" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        รหัสไปรษณีย์{' '}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput placeholder="10330" maxLength={5} {...field} />
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
                                    : mode === 'edit'
                                    ? 'บันทึกการแก้ไข'
                                    : 'เพิ่มที่อยู่'}
                            </ShButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
