import { ShIcon } from '@/components/ui/icon'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'ค้นหา...',
    className = '',
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <ShIcon
                name="search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <ShIcon name="x" size={16} />
                </button>
            )}
        </div>
    )
}
