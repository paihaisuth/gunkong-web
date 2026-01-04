import z from 'zod'
import { api } from '@/plugin/axios'
import { ApiResponse } from '@/types/services'
import { callApi } from '@/lib/service'
import {
  Dispute,
  DisputeListResponse,
  DisputeMessage,
  DisputeStatus,
} from '@/types/dispute'

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

const resolutionEnum = z.enum([
  'RESOLVED_BUYER_FAVOR',
  'RESOLVED_SELLER_FAVOR',
  'RESOLVED_PARTIAL',
  'CLOSED',
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
    return api.post(`/disputes/${roomCode}`, data)
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
    return api.post(`/disputes/${disputeCode}/messages`, data)
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
  const url = queryString ? `/disputes?${queryString}` : '/disputes'

  return api.get(url)
}

export const getDisputeByCode = (disputeCode: string): ApiResponse<Dispute> => {
  return api.get(`/disputes/${disputeCode}`)
}

export const getDisputeMessages = (disputeCode: string): ApiResponse<DisputeMessage[]> => {
  return api.get(`/disputes/${disputeCode}/messages`)
}

const adminResolveSchema = z.object({
  resolution: resolutionEnum,
  notes: z.string().min(10).max(2000),
  buyerRefundPercent: z.number().min(0).max(100).optional(),
  sellerReleasePercent: z.number().min(0).max(100).optional(),
})

export type AdminResolveSchema = z.infer<typeof adminResolveSchema>

export const adminResolveDispute = (
  disputeCode: string,
  payload: AdminResolveSchema
): ApiResponse<Dispute> =>
  callApi(payload, adminResolveSchema, (data) => {
    return api.post(`/disputes/admin/${disputeCode}/resolve`, data)
  })

export const adminGetPendingDisputes = async (
  page: number = 1,
  limit: number = 10
): ApiResponse<DisputeListResponse> => {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())

  return api.get(`/disputes/admin/pending?${queryParams.toString()}`)
}

export const adminGetDisputeDetails = (disputeCode: string): ApiResponse<Dispute> => {
  return api.get(`/disputes/admin/${disputeCode}`)
}

const adminTakeUnderReviewSchema = z.object({})

export type AdminTakeUnderReviewSchema = z.infer<typeof adminTakeUnderReviewSchema>

export const adminTakeUnderReview = (
  disputeCode: string
): ApiResponse<Dispute> =>
  callApi({}, adminTakeUnderReviewSchema, () => {
    return api.post(`/disputes/admin/${disputeCode}/review`)
  })

const adminAddNoteSchema = z.object({
  note: z.string().min(1).max(2000),
})

export type AdminAddNoteSchema = z.infer<typeof adminAddNoteSchema>

export const adminAddNote = (
  disputeCode: string,
  payload: AdminAddNoteSchema
): ApiResponse<DisputeMessage> =>
  callApi(payload, adminAddNoteSchema, (data) => {
    return api.post(`/disputes/admin/${disputeCode}/note`, data)
  })
