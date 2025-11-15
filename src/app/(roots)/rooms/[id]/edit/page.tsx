'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShButton } from '@/components/ui/button'
import { ShInput } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShIcon } from '@/components/ui/icon'
import { toast } from 'sonner'
import { fetchCodeRoom, updateRoom, type Room } from '@/services/room'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const editRoomSchema = z.object({
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

type EditRoomFormValues = z.infer<typeof editRoomSchema>

export default function EditRoomPage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [roomData, setRoomData] = useState<Room | null>(null)

    const roomCode = params.id as string

    const form = useForm<EditRoomFormValues>({
        resolver: zodResolver(editRoomSchema),
        defaultValues: {
            itemTitle: '',
            price: '',
            quantity: '1',
            description: '',
        },
    })

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!roomCode) {
                setError('ไม่พบรหัสห้อง')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await fetchCodeRoom({
                    roomCode: roomCode.toUpperCase(),
                })

                if (response.data?.data?.item) {
                    const room = response.data.data.item
                    if (room.status !== 'CREATED' || room.buyerId) {
                        setError(
                            'ไม่สามารถแก้ไขห้องนี้ได้ เนื่องจากมีผู้ซื้อแล้วหรือสถานะไม่ใช่ "สร้างแล้ว"'
                        )
                        setLoading(false)
                        return
                    }

                    setRoomData(room)
                    form.reset({
                        itemTitle: room.itemTitle,
                        price: (room.itemPriceCents / 100).toString(),
                        quantity: room.quantity.toString(),
                        description: room.itemDescription || '',
                    })
                    setError(null)
                } else {
                    setError('ไม่พบข้อมูลห้อง')
                }
            } catch (err) {
                console.error('Error fetching room:', err)
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลห้อง')
                toast('ไม่สามารถดึงข้อมูลห้องได้')
            } finally {
                setLoading(false)
            }
        }

        fetchRoomData()
    }, [roomCode, form])

    const handleUpdateRoom = async (data: EditRoomFormValues) => {
        if (!roomData) return

        try {
            const priceInCents = Math.round(parseFloat(data.price) * 100)

            const payload = {
                roomId: roomData.id,
                itemTitle: data.itemTitle.trim(),
                itemDescription: data.description?.trim() || undefined,
                quantity: parseInt(data.quantity),
                itemPriceCents: priceInCents,
            }

            const response = await updateRoom(payload)

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            toast('อัปเดตห้องสำเร็จ!')
            router.push(`/rooms/${roomCode}`)
        } catch (error) {
            console.error('Error updating room:', error)
            toast('เกิดข้อผิดพลาดในการอัปเดตห้อง')
        }
    }

    const handleCancel = () => {
        router.push(`/rooms/${roomCode}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">
                        กำลังโหลดข้อมูลห้อง...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !roomData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                                <ShIcon
                                    name="alert-circle"
                                    size={24}
                                    className="text-destructive"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    ไม่สามารถแก้ไขห้อง
                                </h3>
                                <p className="text-muted-foreground">{error}</p>
                            </div>
                            <ShButton
                                onClick={() => router.push('/rooms')}
                                className="w-full"
                            >
                                กลับไปห้องทั้งหมด
                            </ShButton>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
                <ShButton
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    disabled={form.formState.isSubmitting}
                >
                    <ShIcon name="arrow-left" size={20} />
                </ShButton>
                <div>
                    <h1 className="text-2xl font-bold">แก้ไขรายละเอียดห้อง</h1>
                    <p className="text-muted-foreground">
                        รหัสห้อง: {roomData.roomCode}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ข้อมูลสินค้า</CardTitle>
                    <CardDescription>
                        แก้ไขข้อมูลสินค้าและรายละเอียดห้อง
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpdateRoom)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="itemTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            ชื่อสินค้า{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShInput
                                                placeholder="ป้อนชื่อสินค้าที่ต้องการขาย"
                                                type="text"
                                                maxLength={100}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            ราคา (บาท){' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShInput
                                                placeholder="0.00"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            จำนวน{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <ShInput
                                                placeholder="1"
                                                type="number"
                                                min="1"
                                                step="1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            รายละเอียดสินค้า (ไม่บังคับ)
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับสินค้า..."
                                                className="w-full p-3 border border-input bg-background rounded-md text-sm resize-none"
                                                rows={3}
                                                maxLength={500}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex text-xs text-red-600">
                                <span>
                                    * หมายเหตุ:
                                    ราคาที่ท่านใส่จะมีการบวกเพิ่มค่าธรรมเนียมการซื้อขาย
                                    15%
                                    ซึ่งจะถูกบวกหลังจากที่ท่านใส่ราคาสินค้าของท่านโดยอัตโนมัติ
                                </span>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <ShButton
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
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
                                        : 'บันทึกการเปลี่ยนแปลง'}
                                </ShButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <ShIcon
                            name="alert-triangle"
                            size={20}
                            className="text-yellow-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="space-y-1">
                            <h4 className="font-medium text-yellow-900">
                                ข้อควรระวัง
                            </h4>
                            <p className="text-sm text-yellow-800">
                                คุณสามารถแก้ไขห้องได้เฉพาะเมื่อยังไม่มีผู้ซื้อเข้าร่วม
                                หลังจากมีผู้ซื้อแล้ว
                                จะไม่สามารถแก้ไขข้อมูลได้
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
