'use client'

import * as React from 'react'
import Image from 'next/image'
import { ShIcon } from './icon'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    maxImages?: number
    onImagesChange: (images: string[]) => void
    existingImages?: string[]
    accept?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

function ShImageUpload({
    maxImages = 5,
    onImagesChange,
    existingImages = [],
    accept = 'image/*',
}: ImageUploadProps) {
    const [images, setImages] = React.useState<string[]>(existingImages)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [dragActive, setDragActive] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFiles = React.useCallback(
        async (files: FileList | null) => {
            if (!files) return

            setError(null)
            setIsLoading(true)

            try {
                const newImages: string[] = []

                for (let i = 0; i < files.length; i++) {
                    if (images.length + newImages.length >= maxImages) {
                        setError(`คุณสามารถเพิ่มได้สูงสุด ${maxImages} รูปภาพ`)
                        break
                    }

                    const file = files[i]

                    if (!file.type.startsWith('image/')) {
                        setError('โปรดเลือกไฟล์รูปภาพเท่านั้น')
                        continue
                    }

                    if (file.size > MAX_FILE_SIZE) {
                        setError('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB')
                        continue
                    }

                    const reader = new FileReader()
                    await new Promise<void>((resolve, reject) => {
                        reader.onload = () => {
                            const result = reader.result as string
                            newImages.push(result)
                            resolve()
                        }
                        reader.onerror = () => {
                            reject(new Error('Failed to read file'))
                        }
                        reader.readAsDataURL(file)
                    })
                }

                const updatedImages = [...images, ...newImages]
                setImages(updatedImages)
                onImagesChange(updatedImages)

                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
                setError(message)
            } finally {
                setIsLoading(false)
            }
        },
        [images, maxImages, onImagesChange],
    )

    const handleClick = () => {
        if (images.length < maxImages) {
            fileInputRef.current?.click()
        }
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        onImagesChange(updatedImages)
        setError(null)
    }

    const canAddMore = images.length < maxImages

    return (
        <div className="space-y-3">
            {canAddMore && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={cn(
                        'relative flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 px-6 py-8 transition-colors cursor-pointer',
                        dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                        isLoading && 'opacity-50 pointer-events-none',
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={accept}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="hidden"
                        aria-label="Upload images"
                    />

                    <div className="flex flex-col items-center gap-2 text-center">
                        {isLoading ? (
                            <>
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                                <p className="text-sm text-muted-foreground">
                                    กำลังอัปโหลด...
                                </p>
                            </>
                        ) : (
                            <>
                                <ShIcon
                                    name="image-plus"
                                    className="h-8 w-8 text-muted-foreground"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        ลากรูปภาพมาที่นี่ หรือคลิกเพื่อเลือก
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF (สูงสุด 5MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    <ShIcon
                        name="alert-circle"
                        className="h-4 w-4 mt-0.5 flex-shrink-0"
                    />
                    <p>{error}</p>
                </div>
            )}

            {images.length > 0 && (
                <div>
                    <p className="text-sm font-medium mb-2">
                        รูปภาพที่อัปโหลด ({images.length}/{maxImages})
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square overflow-hidden rounded-lg border border-input bg-muted"
                            >
                                <Image
                                    src={image}
                                    alt={`Upload preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className={cn(
                                        'absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity',
                                        'group-hover:opacity-100',
                                    )}
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <ShIcon
                                        name="trash-2"
                                        className="h-4 w-4 text-white"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {images.length === 0 && !canAddMore && (
                <div className="flex items-start gap-2 rounded-md bg-muted p-3">
                    <ShIcon
                        name="info"
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                        คุณได้อัปโหลดรูปภาพครบจำนวนสูงสุดแล้ว
                    </p>
                </div>
            )}
        </div>
    )
}

export { ShImageUpload }
