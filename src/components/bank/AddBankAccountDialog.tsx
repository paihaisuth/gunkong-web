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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { addBankAccount, getBankCodes } from '@/services/bankAccount'
import type { BankCode } from '@/types/bankAccount'

const bankAccountFormSchema = z.object({
    bankCode: z.string().length(3, 'โปรดเลือกธนาคาร'),
    accountNumber: z
        .string()
        .min(10, 'เลขบัญชีต้อง 10-12 หลัก')
        .max(12, 'เลขบัญชีต้อง 10-12 หลัก')
        .regex(/^\d+$/, 'เลขบัญชีต้องเป็นตัวเลข'),
    accountName: z
        .string()
        .min(1, 'ชื่อบัญชีต้องระบุ')
        .max(200, 'ชื่อบัญชีต้องไม่เกิน 200 ตัวอักษร'),
    verificationDocumentUrl: z
        .string()
        .url('URL ของเอกสารไม่ถูกต้อง')
        .optional()
        .or(z.literal('')),
})

type BankAccountFormData = z.infer<typeof bankAccountFormSchema>

interface AddBankAccountDialogProps {
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function AddBankAccountDialog({
    onSuccess,
    trigger,
}: AddBankAccountDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [banks, setBanks] = useState<BankCode[]>([])
    const [isLoadingBanks, setIsLoadingBanks] = useState(false)

    const form = useForm<BankAccountFormData>({
        resolver: zodResolver(bankAccountFormSchema),
        defaultValues: {
            bankCode: '',
            accountNumber: '',
            accountName: '',
            verificationDocumentUrl: '',
        },
    })

    const loadBanks = async () => {
        if (banks.length > 0) return

        setIsLoadingBanks(true)
        try {
            const response = await getBankCodes()
            if (response.data?.data?.items) {
                setBanks(response.data.data.items)
            }
        } catch (error) {
            console.error('Failed to load banks:', error)
            toast.error('ไม่สามารถโหลดรายชื่อธนาคาร')
        } finally {
            setIsLoadingBanks(false)
        }
    }

    const onSubmit = async (data: BankAccountFormData) => {
        try {
            await addBankAccount({
                bankCode: data.bankCode,
                accountNumber: data.accountNumber,
                accountName: data.accountName,
                verificationDocumentUrl:
                    data.verificationDocumentUrl || undefined,
            })

            toast.success('เพิ่มบัญชีธนาคารสำเร็จ', {
                description: 'บัญชีของคุณรอการตรวจสอบจากแอดมิน',
            })

            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Add bank account error:', error)
            toast.error('ไม่สามารถเพิ่มบัญชีธนาคาร', {
                description: 'กรุณาลองใหม่อีกครั้ง',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <ShButton>
                        <ShIcon name="plus" size={16} className="mr-2" />
                        เพิ่มบัญชีธนาคาร
                    </ShButton>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>เพิ่มบัญชีธนาคาร</DialogTitle>
                    <DialogDescription>
                        กรุณากรอกข้อมูลบัญชีธนาคารของคุณ บัญชีจะรอการตรวจสอบจากแอดมิน
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="bankCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        ธนาคาร{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            onOpenChange={(open) => {
                                                if (open) {
                                                    loadBanks()
                                                }
                                            }}
                                            disabled={
                                                isLoadingBanks ||
                                                form.formState.isSubmitting
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกธนาคาร" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {banks.map((bank) => (
                                                    <SelectItem
                                                        key={bank.code}
                                                        value={bank.code}
                                                    >
                                                        {bank.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        เลขที่บัญชี{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="0123456789"
                                            {...field}
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        เลขบัญชีต้อง 10-12 หลัก
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        ชื่อบัญชี{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            placeholder="ชื่อเจ้าของบัญชี"
                                            {...field}
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        ต้องตรงกับชื่อเจ้าของบัญชี
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="verificationDocumentUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        URL เอกสารยืนยัน (ไม่บังคับ)
                                    </FormLabel>
                                    <FormControl>
                                        <ShInput
                                            type="url"
                                            placeholder="https://example.com/document.jpg"
                                            {...field}
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        อัปโหลดหลักฐานการเป็นเจ้าของบัญชี
                                        (เช่น หน้าแรกสมุดบัญชี)
                                    </FormDescription>
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
                                    ? 'กำลังเพิ่ม...'
                                    : 'เพิ่มบัญชี'}
                            </ShButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
