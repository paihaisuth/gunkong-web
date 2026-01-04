import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShBadge } from '@/components/ui/badge'
import type { Room } from '@/services/room'

interface SearchResultCardProps {
    room: Room
    onJoinRoom: () => void
}

export function SearchResultCard({ room, onJoinRoom }: SearchResultCardProps) {
    return (
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
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-bold text-lg">
                                            {room.roomCode?.substring(0, 2) ||
                                                'RM'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">
                                            ห้อง {room.roomCode}
                                        </h3>
                                        <p className="text-base text-foreground font-medium">
                                            {room.itemTitle ||
                                                'ไม่ระบุชื่อสินค้า'}
                                        </p>
                                        {room.sellerId && (
                                            <p className="text-sm text-muted-foreground">
                                                ผู้ขาย: {room.seller.fullName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <ShBadge
                                        variant={
                                            room.status === 'COMPLETED'
                                                ? 'default'
                                                : room.status === 'CANCELLED'
                                                ? 'destructive'
                                                : room.status ===
                                                  'PENDING_PAYMENT'
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {room.status}
                                    </ShBadge>
                                    <ShButton onClick={onJoinRoom} size="lg">
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
                </div>
            </CardContent>
        </Card>
    )
}
