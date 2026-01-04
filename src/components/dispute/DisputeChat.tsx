'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShButton } from '@/components/ui/button'
import { ShIcon } from '@/components/ui/icon'
import { ShInput } from '@/components/ui/input'
import { ShLabel } from '@/components/ui/label'
import { toast } from 'sonner'
import { getDisputeMessages, addDisputeMessage } from '@/services/dispute'
import { DisputeMessage, Dispute } from '@/types/dispute'
import { getUserIdFromToken } from '@/lib/token-utils'
import { useUserStore } from '@/stores/useUserStore'

interface DisputeChatProps {
  dispute: Dispute
  onMessageAdded?: () => void
}

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  evidenceUrls: z.array(z.string().url()).optional(),
})

type MessageFormData = z.infer<typeof messageSchema>

export function DisputeChat({ dispute, onMessageAdded }: DisputeChatProps) {
  const [messages, setMessages] = useState<DisputeMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const accessToken = useUserStore((state) => state.accessToken)
  const currentUserId = accessToken ? getUserIdFromToken(accessToken) : null

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
      evidenceUrls: [],
    },
  })

  const isDisputeResolved = dispute.status.includes('RESOLVED') || dispute.status === 'CLOSED'

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispute.disputeCode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await getDisputeMessages(dispute.disputeCode)
      if (response.data?.data?.items) {
        setMessages(response.data.data.items)
      }
    } catch (error) {
      console.error('Fetch messages error:', error)
      toast.error('ไม่สามารถโหลดข้อความได้')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: MessageFormData) => {
    if (isDisputeResolved) {
      toast.error('ไม่สามารถเพิ่มข้อความในข้อพิพาทที่แก้ไขแล้ว')
      return
    }

    setIsSubmitting(true)
    try {
      await addDisputeMessage(dispute.disputeCode, {
        content: data.content,
        evidenceUrls: data.evidenceUrls?.length ? data.evidenceUrls : undefined,
      })
      toast.success('เพิ่มข้อความสำเร็จ')
      form.reset()
      await fetchMessages()
      onMessageAdded?.()
    } catch (error) {
      console.error('Add message error:', error)
      toast.error('ไม่สามารถเพิ่มข้อความได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ข้อความและหลักฐาน</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">กำลังโหลด...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อความและหลักฐาน</CardTitle>
        <CardDescription>
          {messages.length} ข้อความ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">ยังไม่มีข้อความ</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId
              const isSystemMessage = message.messageType === 'SYSTEM'
              const isInternalNote = message.isInternalNote

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      isSystemMessage
                        ? 'bg-gray-200 text-gray-800'
                        : isInternalNote
                          ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                          : isCurrentUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.sender && !isSystemMessage && (
                      <p className="text-xs font-semibold opacity-75">
                        {message.sender.fullName || message.sender.username}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    {message.evidenceUrls && message.evidenceUrls.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-current opacity-50 space-y-1">
                        {message.evidenceUrls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 hover:underline"
                          >
                            <ShIcon name="file" size={12} />
                            หลักฐาน {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-50 mt-1">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isDisputeResolved && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 border-t pt-4">
            <div>
              <ShLabel htmlFor="message-content">เพิ่มข้อความ</ShLabel>
              <textarea
                id="message-content"
                placeholder="พิมพ์ข้อความหรือข้อมูลเพิ่มเติม..."
                rows={3}
                {...form.register('content')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                disabled={isSubmitting}
              />
              {form.formState.errors.content && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div>
              <ShLabel htmlFor="evidence-urls">ลิงก์หลักฐาน (URL)</ShLabel>
              <ShInput
                id="evidence-urls"
                placeholder="https://example.com/evidence.jpg (แยกด้วย comma หรือ enter)"
                {...form.register('evidenceUrls')}
                disabled={isSubmitting}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                สูงสุด 5 ลิงก์ (ลิงก์รูปภาพหรือเอกสาร)
              </p>
            </div>

            <div className="flex gap-2">
              <ShButton
                type="submit"
                className="flex-1"
                disabled={isSubmitting || isDisputeResolved}
              >
                {isSubmitting ? (
                  <>
                    <ShIcon name="loader-2" size={14} className="mr-2 animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <ShIcon name="send" size={14} className="mr-2" />
                    ส่งข้อความ
                  </>
                )}
              </ShButton>
            </div>
          </form>
        )}

        {isDisputeResolved && (
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              ข้อพิพาทนี้แก้ไขแล้ว ไม่สามารถเพิ่มข้อความได้อีก
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
