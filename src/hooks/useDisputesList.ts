import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchMyDisputes, type DisputeListItem } from '@/services/dispute'
import type { DisputeStatus } from '@/types/dispute'

export function useDisputesList() {
  const [disputes, setDisputes] = useState<DisputeListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | undefined>()

  const itemsPerPage = 10

  const fetchDisputes = async (currentPage = 1, status?: DisputeStatus) => {
    try {
      setIsLoading(true)
      const response = await fetchMyDisputes({
        status,
        page: currentPage,
        limit: itemsPerPage,
      })

      if (response.data?.error) {
        toast.error('ไม่สามารถโหลดข้อพิพาท')
        return
      }

      const items = response.data?.data?.item
      if (Array.isArray(items)) {
        setDisputes(items)
        setTotal(items.length || 0)
        setTotalPages(1)
      } else if (items?.disputes) {
        setDisputes(items.disputes)
        setTotal(items.total || 0)
        setTotalPages(items.totalPages || 1)
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อพิพาท')
      console.error('Error fetching disputes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (status: DisputeStatus | undefined) => {
    setStatusFilter(status)
    setPage(1)
  }

  useEffect(() => {
    fetchDisputes(page, statusFilter)
  }, [page, statusFilter])

  return {
    disputes,
    isLoading,
    page,
    totalPages,
    total,
    statusFilter,
    setPage,
    handleStatusChange,
    refetch: () => fetchDisputes(page, statusFilter),
  }
}
