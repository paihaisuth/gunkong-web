import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchTransactionHistory, type Transaction } from '@/services/history'

export function useTransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchText, setSearchText] = useState('')

    const fetchTransactions = async (currentPage = 1, search = '') => {
        try {
            setIsLoading(true)
            const response = await fetchTransactionHistory({
                page: currentPage,
                perPage: 10,
                searchText: search || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setTransactions(response.data.data?.items || [])
            setTotalPages(response.data.data?.pagination?.totalPages || 1)
        } catch (error) {
            toast('เกิดข้อผิดพลาดในการโหลดประวัติธุรกรรม')
            console.error('Error fetching transaction history:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        setSearchText(value)
        setPage(1)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions(page, searchText)
        }, 300)

        return () => clearTimeout(timer)
    }, [page, searchText])

    return {
        transactions,
        isLoading,
        page,
        totalPages,
        searchText,
        handleSearch,
        setPage,
        refetch: () => fetchTransactions(page, searchText),
    }
}
