import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { searchRooms, type Room } from '@/services/room'

const RECENT_SEARCHES_KEY = 'gunkong-recent-searches'
const MAX_RECENT_SEARCHES = 5

export function useRoomSearch() {
    const [roomCode, setRoomCode] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchResult, setSearchResult] = useState<Room | null>(null)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved))
            } catch (error) {
                console.error('Error loading recent searches:', error)
            }
        }
    }, [])

    const saveRecentSearch = (code: string) => {
        const uppercaseCode = code.toUpperCase()
        const updated = [
            uppercaseCode,
            ...recentSearches.filter((s) => s !== uppercaseCode),
        ].slice(0, MAX_RECENT_SEARCHES)
        setRecentSearches(updated)
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    }

    const fetchRoom = async (code: string) => {
        if (!code.trim()) {
            toast('กรุณาป้อนรหัสห้อง')
            return
        }

        if (code.length > 8) {
            toast('รหัสห้องต้องไม่เกิน 8 ตัวอักษร')
            return
        }

        setIsSearching(true)
        setSearchError(null)
        try {
            const response = await searchRooms({ roomCode: code.toUpperCase() })
            if (!response.data.data?.item) {
                toast('ไม่พบห้องที่ระบุ')
                setSearchError('ไม่พบห้องที่ระบุ')
                setSearchResult(null)
                return
            }

            setSearchResult(response.data.data?.item)
            saveRecentSearch(code)
            toast('ค้นหาห้องสำเร็จ')
        } catch (error) {
            console.error('Error fetching room:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'เกิดข้อผิดพลาดในการดึงข้อมูลห้อง'
            setSearchError(errorMessage)
            toast(errorMessage)
            setSearchResult(null)
        } finally {
            setIsSearching(false)
        }
    }

    const clearSearch = () => {
        setRoomCode('')
        setSearchResult(null)
        setSearchError(null)
    }

    const selectRecentSearch = (code: string) => {
        setRoomCode(code)
        fetchRoom(code)
    }

    const handleRoomCodeChange = (code: string) => {
        setRoomCode(code.toUpperCase())
    }

    return {
        roomCode,
        isSearching,
        searchResult,
        searchError,
        recentSearches,
        handleRoomCodeChange,
        fetchRoom,
        clearSearch,
        selectRecentSearch,
    }
}
