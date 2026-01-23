import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'
import {
  Dispute,
  DisputeListResponse,
  DisputeListItem,
  DisputeMessage,
  DisputeStatus,
} from '@/types/dispute'

export type { DisputeListItem }

const reasonEnum = z.enum([
  'ITEM_NOT_RECEIVED',
  'ITEM_NOT_AS_DESCRIBED',
  'ITEM_DAMAGED',
  'PAYMENT_ISSUE',
  'SHIPPING_ISSUE',
  'SELLER_NOT_SHIPPING',
  'BUYER_NOT_CONFIRMING',
  'OTHER',
])

const openDisputeSchema = z.object({
  reason: reasonEnum,
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
})

export type OpenDisputeSchema = z.infer<typeof openDisputeSchema>

export const openDispute = (
  roomCode: string,
  payload: OpenDisputeSchema
): ApiResponse<Dispute> =>
  callApi(payload, openDisputeSchema, (data) => {
    return api.post(`/dispute/${roomCode}`, data)
  })

const addMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  evidenceUrls: z.array(z.string().url()).optional(),
})

export type AddMessageSchema = z.infer<typeof addMessageSchema>

export const addDisputeMessage = (
  disputeCode: string,
  payload: AddMessageSchema
): ApiResponse<DisputeMessage> =>
  callApi(payload, addMessageSchema, (data) => {
    return api.post(`/dispute/${disputeCode}/messages`, data)
  })

interface FetchDisputesParams {
  status?: DisputeStatus
  page?: number
  limit?: number
}

export const fetchMyDisputes = async (
  params?: FetchDisputesParams
): ApiResponse<DisputeListResponse> => {
  const queryParams = new URLSearchParams()

  if (params?.status) {
    queryParams.append('status', params.status)
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString())
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString())
  }

  const queryString = queryParams.toString()
  const url = queryString ? `/dispute?${queryString}` : '/dispute'

  return api.get(url)
}

export const getDisputeByCode = (disputeCode: string): ApiResponse<Dispute> => {
  return api.get(`/dispute/${disputeCode}`)
}

export const getDisputeMessages = (disputeCode: string): ApiResponse<DisputeMessage[]> => {
  return api.get(`/dispute/${disputeCode}/messages`)
}
