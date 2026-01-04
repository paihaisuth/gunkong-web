import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShInput } from '@/components/ui/input'

interface SearchRoomCardProps {
    roomCode: string
    onRoomCodeChange: (value: string) => void
    onSearch: (code: string) => void
    onClear: () => void
    onSelectRecent: (code: string) => void
    isSearching: boolean
    searchError: string | null
    recentSearches: string[]
    hasSearchResult: boolean
}

export function SearchRoomCard({
    roomCode,
    onRoomCodeChange,
    onSearch,
    onClear,
    onSelectRecent,
    isSearching,
    searchError,
    recentSearches,
    hasSearchResult,
}: SearchRoomCardProps) {
    return (
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
                        onSearch(roomCode)
                    }}
                    className="space-y-4"
                >
                    <div className="relative">
                        <ShInput
                            placeholder="ป้อนรหัสห้อง เช่น ABC123"
                            type="text"
                            value={roomCode}
                            onChange={(e) => onRoomCodeChange(e.target.value)}
                            maxLength={8}
                            className={searchError ? 'border-destructive' : ''}
                        />
                        {roomCode && (
                            <button
                                type="button"
                                onClick={onClear}
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

                    {recentSearches.length > 0 && !hasSearchResult && (
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                การค้นหาล่าสุด:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((recentCode, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => onSelectRecent(recentCode)}
                                        className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                                        disabled={isSearching}
                                    >
                                        {recentCode}
                                    </button>
                                ))}
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
                        {(hasSearchResult || searchError) && (
                            <ShButton
                                type="button"
                                variant="outline"
                                onClick={onClear}
                            >
                                ล้าง
                            </ShButton>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
