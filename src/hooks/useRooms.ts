import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchRooms, type Room } from '@/services/room'

export function useRooms() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchText, setSearchText] = useState('')
    const itemsPerPage = 9

    const getRooms = async (currentPage = 1, search = '') => {
        try {
            setIsLoading(true)
            const response = await fetchRooms({
                page: currentPage,
                perPage: itemsPerPage,
                searchText: search || undefined,
            })

            if (response.data.error) {
                toast('เกิดข้อผิดพลาด: ' + response.data.error.description)
                return
            }

            setRooms(response.data.data?.items || [])
            setTotalPages(response.data.data?.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Error fetching rooms:', error)
            toast('เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง')
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
            getRooms(page, searchText)
        }, 500)

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
        refetch: () => getRooms(page, searchText),
    }
}
