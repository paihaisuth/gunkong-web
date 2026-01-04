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
import { useCreateRoom } from '@/hooks/useCreateRoom'

interface CreateRoomDialogProps {
    onSuccess?: () => void
}

export function CreateRoomDialog({ onSuccess }: CreateRoomDialogProps) {
    const { form, isOpen, setIsOpen, handleCreateRoom } =
        useCreateRoom(onSuccess)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ShButton size="lg" className="w-full">
                    สร้างห้อง
                </ShButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>สร้างห้องใหม่</DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลสินค้าเพื่อสร้างห้องขาย
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleCreateRoom)}
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
                                    ? 'กำลังสร้าง...'
                                    : 'สร้างห้อง'}
                            </ShButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
