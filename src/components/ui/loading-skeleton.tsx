import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function TransactionSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </CardContent>
        </Card>
    )
}

export function RoomSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </CardContent>
        </Card>
    )
}
