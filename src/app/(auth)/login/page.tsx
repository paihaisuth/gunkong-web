'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ShButton } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ShInput } from '@/components/ui/input'
import { ShBadge } from '@/components/ui/badge'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'
import { login } from '@/services/login/login'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShIcon } from '@/components/ui/icon'
import { Checkbox } from '@/components/ui/checkbox'

const loginSchema = z.object({
    usernameEmail: z.string().min(1, 'Username or email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const { setTokens } = useUserStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/'

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usernameEmail: '',
            password: '',
            rememberMe: false,
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data)

            if (response.data.error || !response.data.data) {
                toast('username/email หรือ password ไม่ถูกต้อง')
                return
            }

            const accessToken = response.data.data.item.accessToken
            const refreshToken = response.data.data.item.refreshToken

            setTokens(accessToken, refreshToken)
            toast('เข้าสู่ระบบสำเร็จ')
            router.push(redirectTo)
        } catch {
            toast('เข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง')
        }
    }

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-md">
                    <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md">
                        <CardHeader className="text-center space-y-6 pb-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-linear-to-r from-primary to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <ShIcon
                                            name="shield-check"
                                            className="h-8 w-8 text-white"
                                        />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                        <ShIcon
                                            name="check"
                                            className="h-3 w-3 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-green-600 bg-clip-text text-transparent">
                                    ยินดีต้อนรับกลับ
                                </CardTitle>
                                <CardDescription className="text-base text-muted-foreground">
                                    เข้าสู่ระบบเพื่อเข้าถึงบัญชีของคุณ
                                </CardDescription>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <ShBadge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    >
                                        <ShIcon
                                            name="shield"
                                            className="h-3 w-3 mr-1"
                                        />
                                        ปลอดภัย
                                    </ShBadge>

                                    <ShBadge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        <ShIcon
                                            name="zap"
                                            className="h-3 w-3 mr-1"
                                        />
                                        ฟรี
                                    </ShBadge>

                                    <ShBadge
                                        variant="secondary"
                                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    >
                                        <ShIcon
                                            name="clock-2"
                                            className="h-3 w-3 mr-1"
                                        />
                                        24/7 บริการ
                                    </ShBadge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="usernameEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <ShInput
                                                            label="ชื่อผู้ใช้หรืออีเมล"
                                                            leftIcon="user"
                                                            placeholder="กรุณากรอกชื่อผู้ใช้หรืออีเมลของคุณ"
                                                            className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <ShInput
                                                            type={
                                                                showPassword
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            label="รหัสผ่าน"
                                                            leftIcon="lock"
                                                            rightIcon={
                                                                showPassword
                                                                    ? 'eye'
                                                                    : 'eye-off'
                                                            }
                                                            placeholder="กรุณากรอกรหัสผ่านของคุณ"
                                                            className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            onRightIconClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex items-center justify-between">
                                        <FormField
                                            control={form.control}
                                            name="rememberMe"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                                        จดจำการเข้าสู่ระบบ
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                        >
                                            ลืมรหัสผ่าน?
                                        </Link>
                                    </div>

                                    <ShButton
                                        type="submit"
                                        className="w-full h-12 bg-linear-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                กำลังเข้าสู่ระบบ...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <ShIcon
                                                    name="log-in"
                                                    className="h-4 w-4"
                                                />
                                                เข้าสู่ระบบ
                                            </div>
                                        )}
                                    </ShButton>
                                </form>
                            </Form>

                            <div className="mt-8 text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    ยังไม่มีบัญชี?{' '}
                                    <Link
                                        href="/register"
                                        className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
                                    >
                                        สมัครสมาชิกที่นี่
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
