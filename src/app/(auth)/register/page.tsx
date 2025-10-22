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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useState } from 'react'
import { ShIcon } from '@/components/ui/icon'

const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(2, 'Full name must be at least 2 characters')
            .max(100, 'Full name must not exceed 100 characters'),
        email: z
            .string()
            .email('Please enter a valid email address')
            .toLowerCase(),
        phone: z
            .string()
            .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
            .min(10, 'Phone number is too short')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /(?=.*[a-z])/,
                'Password must contain at least one lowercase letter'
            )
            .regex(
                /(?=.*[A-Z])/,
                'Password must contain at least one uppercase letter'
            )
            .regex(/(?=.*\d)/, 'Password must contain at least one number')
            .regex(
                /(?=.*[@$!%*?&])/,
                'Password must contain at least one special character'
            ),
        confirmPassword: z.string(),
        agreeToTerms: z
            .boolean()
            .refine(
                (val) => val === true,
                'You must agree to the terms and conditions'
            ),
        agreeToMarketing: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
            agreeToMarketing: false,
        },
    })

    function onSubmit(data: RegisterFormValues) {
        try {
            console.log(data)
            alert('Registration functionality will be implemented later!')
        } catch (error) {
            console.error(error)
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
                                {/* <CardDescription className="text-base text-muted-foreground">
                                    เข้าร่วมกับเราและเริ่มต้นการเทรด P2P
                                </CardDescription> */}
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
                                                                label="ชื่อ"
                                                                placeholder="ชื่อของคุณ"
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
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    เราจะใช้อีเมลนี้สำหรับการยืนยันและข้อมูลสำคัญ
                                                </FormDescription>
                                                <FormMessage />
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
                                                            label="เบอร์โทรศัพท์ (ไม่บังคับ)"
                                                            leftIcon="phone"
                                                            placeholder="08x-xxx-xxxx"
                                                            className="pl-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    สำหรับการแจ้งเตือนการเทรดและติดต่อฉุกเฉิน
                                                </FormDescription>
                                                <FormMessage />
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
                                                                        ? 'eye-off'
                                                                        : 'eye'
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
                                                    <FormMessage />
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
                                                                    showPassword
                                                                        ? 'eye-off'
                                                                        : 'eye'
                                                                }
                                                                onRightIconClick={() =>
                                                                    setShowPassword(
                                                                        !showPassword
                                                                    )
                                                                }
                                                                placeholder="ยืนยันรหัสผ่าน"
                                                                className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-all duration-200 rounded-xl"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
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
                                            <li>• อย่างน้อย 8 ตัวอักษร</li>
                                            <li>
                                                •
                                                ตัวพิมพ์ใหญ่และตัวพิมพ์เล็กอย่างน้อย
                                                1 ตัว
                                            </li>
                                            <li>
                                                • ตัวเลขและอักขระพิเศษ (@$!%*?&)
                                                อย่างน้อย 1 ตัว
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="agreeToTerms"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-x-3">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            className="rounded border-border mt-1 w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
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

                                        <FormField
                                            control={form.control}
                                            name="agreeToMarketing"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-x-3">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            className="rounded border-border mt-1 w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                                        ฉันต้องการรับข้อมูลการตลาด
                                                        เกี่ยวกับผลิตภัณฑ์
                                                        ข้อเสนอ และโปรโมชั่น
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <ShButton
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                        disabled={form.formState.isSubmitting}
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

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border/50" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-4 text-muted-foreground font-medium">
                                                หรือสมัครด้วย
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <ShButton
                                            variant="outline"
                                            type="button"
                                            disabled
                                            className="h-11 border-2 hover:bg-primary/5 transition-all duration-200 rounded-xl"
                                        >
                                            <svg
                                                className="mr-2 h-4 w-4"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                            Google
                                        </ShButton>
                                        <ShButton
                                            variant="outline"
                                            type="button"
                                            disabled
                                            className="h-11 border-2 hover:bg-primary/5 transition-all duration-200 rounded-xl"
                                        >
                                            <svg
                                                className="mr-2 h-4 w-4"
                                                fill="#1DA1F2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                            Twitter
                                        </ShButton>
                                    </div>
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

                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <ShIcon
                                            name="shield"
                                            className="h-3 w-3"
                                        />
                                        <span>ข้อมูลปลอดภัย</span>
                                    </div>
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                    <div className="flex items-center gap-1">
                                        <ShIcon
                                            name="clock"
                                            className="h-3 w-3"
                                        />
                                        <span>24/7 บริการ</span>
                                    </div>
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                    <div className="flex items-center gap-1">
                                        <ShIcon
                                            name="users"
                                            className="h-3 w-3"
                                        />
                                        <span>เชื่อถือได้</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
