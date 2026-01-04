import z from 'zod'
import { callApi, type ApiResponse } from '@/lib/service'
import { api } from '@/plugin/axios'
import type {
    BankAccount,
    BankAccountDetail,
    BankCode,
} from '@/types/bankAccount'

const addBankAccountSchema = z.object({
    bankCode: z.string().length(3),
    accountNumber: z.string().min(10).max(12),
    accountName: z.string().min(1).max(200),
    verificationDocumentUrl: z.string().url().optional(),
})

export type AddBankAccountData = z.infer<typeof addBankAccountSchema>

export const getBankCodes = (): ApiResponse<BankCode[]> =>
    api.get('/bank-accounts/banks')

export const addBankAccount = (data: AddBankAccountData): ApiResponse<BankAccount> =>
    callApi(data, addBankAccountSchema, (validated) =>
        api.post('/bank-accounts', validated)
    )

export const getMyBankAccounts = (): ApiResponse<BankAccount[]> =>
    api.get('/bank-accounts')

export const getBankAccountById = (id: string): ApiResponse<BankAccountDetail> =>
    api.get(`/bank-accounts/${id}`)

export const setPrimaryAccount = (id: string): ApiResponse<BankAccount> =>
    api.put(`/bank-accounts/${id}/primary`)

export const deleteBankAccount = (id: string): ApiResponse<void> =>
    api.delete(`/bank-accounts/${id}`)
