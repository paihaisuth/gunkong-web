import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createRoom } from '@/services/room'

const createRoomSchema = z.object({
    itemTitle: z
        .string()
        .min(1, 'กรุณาป้อนชื่อสินค้า')
        .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร'),
    price: z
        .string()
        .min(1, 'กรุณาป้อนราคา')
        .refine(
            (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
            'กรุณาป้อนราคาที่ถูกต้อง'
        ),
    quantity: z
        .string()
        .min(1, 'กรุณาป้อนจำนวน')
        .refine(
            (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
            'กรุณาป้อนจำนวนที่ถูกต้อง'
        ),
    description: z
        .string()
        .max(500, 'รายละเอียดต้องไม่เกิน 500 ตัวอักษร')
        .optional(),
})

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>

export function useCreateRoom(onSuccess?: () => void) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<CreateRoomFormValues>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            itemTitle: '',
            price: '',
            quantity: '1',
            description: '',
        },
    })

    const handleCreateRoom = async (data: CreateRoomFormValues) => {
        try {
            const priceInCents = Math.round(parseFloat(data.price) * 100)

            const payload = {
                itemTitle: data.itemTitle.trim(),
                itemDescription: data.description?.trim() || undefined,
                quantity: parseInt(data.quantity),
                itemPriceCents: priceInCents,
                itemImages: [],
            }

            const response = await createRoom(payload)

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            toast('สร้างห้องสำเร็จ!')
            setIsOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error('Error creating room:', error)
            toast('เกิดข้อผิดพลาดในการสร้างห้อง')
        }
    }

    return {
        form,
        isOpen,
        setIsOpen,
        handleCreateRoom,
    }
}
