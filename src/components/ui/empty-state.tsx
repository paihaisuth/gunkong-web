import { Card } from '@/components/ui/card'
import { ShIcon } from '@/components/ui/icon'

interface EmptyStateProps {
    icon: string
    title: string
    description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShIcon name={icon} size={24} className="text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </Card>
    )
}
