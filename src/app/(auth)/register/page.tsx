'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ShButton } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShInput } from '@/components/ui/input'
import { ShBadge } from '@/components/ui/badge'
// TODO: OTP functionality temporarily disabled - waiting for team budget approval
// import { setOtpSessionCookie } from '@/lib/auth-cookies'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useState } from 'react'
import { ShIcon } from '@/components/ui/icon'
import { register, registerSchema } from '@/services/login/register'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = registerSchema
    .extend({
        confirmPassword: z.string(),
        agreeToTerms: z.optional(z.boolean()),
        agreeToMarketing: z.optional(z.boolean()),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormValues = z.infer<typeof formSchema>

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            username: '',
            phone: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
            agreeToMarketing: false,
        },
    })

    async function onSubmit(data: RegisterFormValues) {
        try {
            const response = await register({
                email: data.email,
                fullName: data.fullName,
                username: data.username,
                phone: data.phone,
                password: data.password,
            })

            if (response.data.error) {
                toast.error(
                    response.data.error.description ||
                        'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง'
                )
                return
            }

            // TODO: OTP verification temporarily disabled - redirect to login instead
            // setOtpSessionCookie(data.email)
            // toast.success(
            //     response.data.data?.item?.message ||
            //         'ลงทะเบียนสำเร็จ! กรุณายืนยัน OTP ที่ส่งไปยังอีเมลของคุณ'
            // )
            // router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)

            toast.success('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ')
            router.push('/login')
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง')
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-lg">
                    <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md">
                        <CardHeader className="text-center space-y-6 pb-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <ShIcon
                                            name="user-plus"
                                            className="h-8 w-8 text-white"
                                        />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                        <ShIcon
                                            name="sparkles"
                                            className="h-3 w-3 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                                    สร้างบัญชีใหม่
                                </CardTitle>

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
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <ShInput
                                                                label="ชื่อ นามสกุล"
                                                                placeholder="ชื่อนามสกุลของคุณ"
                                                                leftIcon="user"
                                                                className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <ShInput
                                                            label="อีเมล"
                                                            type="email"
                                                            leftIcon="mail"
                                                            placeholder="your.email@example.com"
                                                            className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <ShInput
                                                            label="ชื่อผู้ใช้"
                                                            leftIcon="at-sign"
                                                            placeholder="username"
                                                            className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <ShInput
                                                            label="เบอร์โทรศัพท์"
                                                            leftIcon="phone"
                                                            type="tel"
                                                            maxLength={10}
                                                            placeholder="08x-xxx-xxxx"
                                                            className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <ShInput
                                                                label="รหัสผ่าน"
                                                                leftIcon="lock"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                rightIcon={
                                                                    showPassword
                                                                        ? 'eye'
                                                                        : 'eye-off'
                                                                }
                                                                onRightIconClick={() =>
                                                                    setShowPassword(
                                                                        !showPassword
                                                                    )
                                                                }
                                                                placeholder="สร้างรหัสผ่าน"
                                                                className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <ShInput
                                                                label="ยืนยันรหัสผ่าน"
                                                                leftIcon="lock"
                                                                type={
                                                                    showConfirmPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                rightIcon={
                                                                    showConfirmPassword
                                                                        ? 'eye'
                                                                        : 'eye-off'
                                                                }
                                                                onRightIconClick={() =>
                                                                    setShowConfirmPassword(
                                                                        !showConfirmPassword
                                                                    )
                                                                }
                                                                placeholder="ยืนยันรหัสผ่าน"
                                                                className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="text-xs text-muted-foreground bg-gradient-to-r from-primary/5 to-green-500/5 border border-primary/20 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShIcon
                                                name="info"
                                                className="h-4 w-4 text-primary"
                                            />
                                            <p className="font-medium text-foreground">
                                                ข้อกำหนดรหัสผ่าน:
                                            </p>
                                        </div>
                                        <ul className="space-y-1 ml-6">
                                            <li>• อย่างน้อย 6 ตัวอักษร</li>
                                            <li>
                                                •
                                                ใช้อักขระที่ปลอดภัยและจดจำได้ง่าย
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="agreeToTerms"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="mt-1"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                                            ฉันยอมรับ{' '}
                                                            <Link
                                                                href="/terms"
                                                                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                                                            >
                                                                ข้อกำหนดการให้บริการ
                                                            </Link>{' '}
                                                            และ{' '}
                                                            <Link
                                                                href="/privacy"
                                                                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                                                            >
                                                                นโยบายความเป็นส่วนตัว
                                                            </Link>
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <ShButton
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                        disabled={
                                            form.formState.isSubmitting ||
                                            !form.watch('agreeToTerms')
                                        }
                                    >
                                        {form.formState.isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                กำลังสร้างบัญชี...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <ShIcon
                                                    name="user-plus"
                                                    className="h-4 w-4"
                                                />
                                                สร้างบัญชี
                                            </div>
                                        )}
                                    </ShButton>
                                </form>
                            </Form>

                            <div className="mt-8 text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    มีบัญชีอยู่แล้ว?{' '}
                                    <Link
                                        href="/login"
                                        className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
                                    >
                                        เข้าสู่ระบบที่นี่
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
