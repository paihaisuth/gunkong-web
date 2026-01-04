import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchJoinedRooms, type JoinedRoom } from '@/services/history'

export function useJoinedRooms() {
    const [rooms, setRooms] = useState<JoinedRoom[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchText, setSearchText] = useState('')

    const fetchRooms = async (currentPage = 1, search = '') => {
        try {
            setIsLoading(true)
            const response = await fetchJoinedRooms({
                page: currentPage,
                perPage: 10,
                searchText: search || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setRooms(response.data.data?.items || [])
            setTotalPages(response.data.data?.pagination?.totalPages || 1)
        } catch (error) {
            toast('เกิดข้อผิดพลาดในการโหลดห้องที่เข้าร่วม')
            console.error('Error fetching joined rooms:', error)
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
            fetchRooms(page, searchText)
        }, 300)

        return () => clearTimeout(timer)
    }, [page, searchText])

    return {
        rooms,
        isLoading,
        page,
        totalPages,
        searchText,
        handleSearch,
        setPage,
        refetch: () => fetchRooms(page, searchText),
    }
}
