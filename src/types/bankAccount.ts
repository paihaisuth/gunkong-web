export type BankAccountVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface BankAccount {
    id: string
    bankCode: string
    bankName: string
    accountNumber: string
    accountName: string
    verificationStatus: BankAccountVerificationStatus
    isPrimary: boolean
    rejectionReason?: string
    createdAt: string
}

export interface BankAccountDetail extends BankAccount {
    fullAccountNumber?: string
    verificationDocumentUrl?: string
}

export interface BankCode {
    code: string
    name: string
}

export interface AddBankAccountRequest {
    bankCode: string
    accountNumber: string
    accountName: string
    verificationDocumentUrl?: string
}
