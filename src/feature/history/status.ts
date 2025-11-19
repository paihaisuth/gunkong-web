import {
    type TransactionStatus,
    type TransactionType,
    type RoomStatus,
} from '@/services/history'

export const getTransactionTypeText = (type: TransactionType) => {
    switch (type) {
        case 'PAYMENT':
            return 'ชำระเงิน'
        case 'REFUND':
            return 'คืนเงิน'
        case 'PLATFORM_FEE':
            return 'ค่าธรรมเนียมแพลตฟอร์ม'
        case 'SHIPPING_FEE':
            return 'ค่าจัดส่ง'
        case 'RELEASE':
            return 'โอนเงิน'
        default:
            return type
    }
}

export const getTransactionStatusColor = (status: TransactionStatus) => {
    switch (status) {
        case 'COMPLETED':
            return 'bg-green-100 text-green-800'
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800'
        case 'FAILED':
            return 'bg-red-100 text-red-800'
        case 'CANCELLED':
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const getTransactionStatusText = (status: TransactionStatus) => {
    switch (status) {
        case 'COMPLETED':
            return 'สำเร็จ'
        case 'PENDING':
            return 'รอดำเนินการ'
        case 'FAILED':
            return 'ล้มเหลว'
        case 'CANCELLED':
            return 'ยกเลิก'
        default:
            return status
    }
}

export const getRoomStatusColor = (status: RoomStatus) => {
    switch (status) {
        case 'CREATED':
            return 'bg-blue-100 text-blue-800'
        case 'PENDING_PAYMENT':
            return 'bg-yellow-100 text-yellow-800'
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

export const getRoomStatusText = (status: RoomStatus) => {
    switch (status) {
        case 'CREATED':
            return 'สร้างแล้ว'
        case 'PENDING_PAYMENT':
            return 'รอชำระเงิน'
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

export const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
        case 'PAYMENT':
            return 'bg-blue-100 text-blue-800'
        case 'REFUND':
            return 'bg-purple-100 text-purple-800'
        case 'PLATFORM_FEE':
            return 'bg-orange-100 text-orange-800'
        case 'SHIPPING_FEE':
            return 'bg-cyan-100 text-cyan-800'
        case 'RELEASE':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}
