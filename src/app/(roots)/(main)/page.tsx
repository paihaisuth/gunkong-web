'use client'

import { useRouter } from 'next/navigation'
import { useRoomSearch } from '@/hooks/useRoomSearch'
import { SearchRoomCard } from './components/SearchRoomCard'
import { SearchResultCard } from './components/SearchResultCard'

export default function Home() {
    const router = useRouter()
    const {
        roomCode,
        isSearching,
        searchResult,
        searchError,
        recentSearches,
        handleRoomCodeChange,
        fetchRoom,
        clearSearch,
        selectRecentSearch,
    } = useRoomSearch()

    const handleJoinRoom = () => {
        if (searchResult?.roomCode) {
            router.push(`/${searchResult.roomCode}`)
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

            <SearchRoomCard
                roomCode={roomCode}
                onRoomCodeChange={handleRoomCodeChange}
                onSearch={fetchRoom}
                onClear={clearSearch}
                onSelectRecent={selectRecentSearch}
                isSearching={isSearching}
                searchError={searchError}
                recentSearches={recentSearches}
                hasSearchResult={!!searchResult}
            />

            {searchResult && (
                <SearchResultCard
                    room={searchResult}
                    onJoinRoom={handleJoinRoom}
                />
            )}
        </div>
    )
}
