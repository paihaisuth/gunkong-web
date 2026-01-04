import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'

interface SimplePaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export function SimplePagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}: SimplePaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <ShButton
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
            >
                <ShIcon name="chevron-left" size={16} />
            </ShButton>
            <span className="text-sm">
                หน้า {currentPage} จาก {totalPages}
            </span>
            <ShButton
                variant="outline"
                size="sm"
                onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || isLoading}
            >
                <ShIcon name="chevron-right" size={16} />
            </ShButton>
        </div>
    )
}
