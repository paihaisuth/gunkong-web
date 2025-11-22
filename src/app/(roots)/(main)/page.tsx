'use client'

import { ShButton } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { ShBadge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ShInput } from '@/components/ui/input'
import { searchRooms, Room } from '@/services/room'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

export default function Home() {
    const router = useRouter()
    const [roomCode, setRoomCode] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Room | null>(null)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('gunkong-recent-searches')
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved))
            } catch (error) {
                logger.error('Error loading recent searches:', error)
            }
        }
    }, [])

    const saveRecentSearch = (code: string) => {
        const uppercaseCode = code.toUpperCase()
        const updated = [
            uppercaseCode,
            ...recentSearches.filter((s) => s !== uppercaseCode),
        ].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('gunkong-recent-searches', JSON.stringify(updated))
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
                return
            }

            setSearchResults(response.data.data?.item)
            saveRecentSearch(code)
            logger.debug('Room search result:', response.data.data?.item)
            toast('ค้นหาห้องสำเร็จ')
        } catch (error) {
            logger.error('Error fetching room:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'เกิดข้อผิดพลาดในการดึงข้อมูลห้อง'
            setSearchError(errorMessage)
            toast(errorMessage)
            setSearchResults(null)
        } finally {
            setIsSearching(false)
        }
    }

    const clearSearch = () => {
        setRoomCode('')
        setSearchResults(null)
        setSearchError(null)
    }

    const selectRecentSearch = (code: string) => {
        setRoomCode(code)
        fetchRoom(code)
    }

    const handleJoinRoom = () => {
        if (searchResults?.roomCode) {
            router.push(`/${searchResults.roomCode}`)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        ยินดีต้อนรับสู่ระบบจัดการร้านค้า Gunkong
                    </h1>
                </div>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>ค้นหาห้อง</CardTitle>
                        <CardDescription>
                            ป้อนรหัสห้องเพื่อค้นหาข้อมูล (สูงสุด 8 ตัวอักษร)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                fetchRoom(roomCode)
                            }}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <ShInput
                                    placeholder="ป้อนรหัสห้อง เช่น ABC123"
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) =>
                                        setRoomCode(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    maxLength={8}
                                    className={
                                        searchError ? 'border-destructive' : ''
                                    }
                                />
                                {roomCode && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {searchError && (
                                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                                    ไม่พบห้องที่ระบุ
                                </div>
                            )}

                            {recentSearches.length > 0 && !searchResults && (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        การค้นหาล่าสุด:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map(
                                            (recentCode, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() =>
                                                        selectRecentSearch(
                                                            recentCode
                                                        )
                                                    }
                                                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                                                    disabled={isSearching}
                                                >
                                                    {recentCode}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <ShButton
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSearching || !roomCode.trim()}
                                >
                                    {isSearching ? 'กำลังค้นหา...' : 'ค้นหา'}
                                </ShButton>
                                {(searchResults || searchError) && (
                                    <ShButton
                                        type="button"
                                        variant="outline"
                                        onClick={clearSearch}
                                    >
                                        ล้าง
                                    </ShButton>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {searchResults && (
                <Card>
                    <CardHeader>
                        <CardTitle>ผลการค้นหา</CardTitle>
                        <CardDescription>
                            ข้อมูลห้องที่พบจากการค้นหา -
                            เข้าร่วมห้องเพื่อดูรายละเอียดเพิ่มเติม
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            {searchResults ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-primary font-bold text-lg">
                                                        {searchResults.roomCode?.substring(
                                                            0,
                                                            2
                                                        ) || 'RM'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl">
                                                        ห้อง{' '}
                                                        {searchResults.roomCode}
                                                    </h3>
                                                    <p className="text-base text-foreground font-medium">
                                                        {searchResults.itemTitle ||
                                                            'ไม่ระบุชื่อสินค้า'}
                                                    </p>
                                                    {searchResults.sellerId && (
                                                        <p className="text-sm text-muted-foreground">
                                                            ผู้ขาย:{' '}
                                                            {
                                                                searchResults
                                                                    .seller
                                                                    .fullName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <ShBadge
                                                    variant={
                                                        searchResults.status ===
                                                        'COMPLETED'
                                                            ? 'default'
                                                            : searchResults.status ===
                                                              'CANCELLED'
                                                            ? 'destructive'
                                                            : searchResults.status ===
                                                              'PENDING'
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {searchResults.status}
                                                </ShBadge>
                                                <ShButton
                                                    onClick={handleJoinRoom}
                                                    size="lg"
                                                >
                                                    เข้าร่วมห้อง
                                                </ShButton>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-muted/50">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-4 h-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-yellow-600 text-xs">
                                                    🔒
                                                </span>
                                            </div>
                                            <span>
                                                รายละเอียดสินค้า ราคา
                                                และข้อมูลการทำธุรกรรมจะแสดงหลังจากเข้าร่วมห้อง
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-2xl">🔍</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        ไม่พบข้อมูลห้อง
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        กรุณาตรวจสอบรหัสห้องและลองอีกครั้ง
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
