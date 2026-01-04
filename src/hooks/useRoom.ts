import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { fetchCodeRoom, type Room } from '@/services/room'

export function useRoom(roomCode: string) {
    const [roomData, setRoomData] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!roomCode) {
                setError('ไม่พบรหัสห้อง')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await fetchCodeRoom({
                    roomCode: roomCode.toUpperCase(),
                })

                if (response.data?.data?.item) {
                    setRoomData(response.data.data.item)
                    setError(null)
                } else {
                    setError('ไม่พบข้อมูลห้อง')
                }
            } catch (err) {
                console.error('Error fetching room:', err)
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลห้อง')
                toast('ไม่สามารถดึงข้อมูลห้องได้')
            } finally {
                setLoading(false)
            }
        }

        fetchRoomData()
    }, [roomCode])

    return {
        roomData,
        loading,
        error,
    }
}
