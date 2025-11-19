import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'CREATED':
            return 'bg-blue-100 text-blue-800'
        case 'PENDING':
        case 'PENDING_PAYMENT':
            return 'bg-yellow-100 text-yellow-800'
        case 'CONFIRMED':
        case 'PAID':
            return 'bg-green-100 text-green-800'
        case 'SHIPPED':
            return 'bg-purple-100 text-purple-800'
        case 'COMPLETED':
            return 'bg-green-100 text-green-800'
        case 'CANCELLED':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const getStatusText = (status: string) => {
    switch (status) {
        case 'CREATED':
            return 'สร้างแล้ว'
        case 'PENDING':
            return 'รอดำเนินการ'
        case 'PENDING_PAYMENT':
            return 'รอชำระเงิน'
        case 'CONFIRMED':
            return 'ยืนยันแล้ว'
        case 'PAID':
            return 'ชำระแล้ว'
        case 'SHIPPED':
            return 'จัดส่งแล้ว'
        case 'COMPLETED':
            return 'สำเร็จ'
        case 'CANCELLED':
            return 'ยกเลิก'
        default:
            return status
    }
}
