/*
 * TODO: OTP VERIFICATION PAGE - TEMPORARILY DISABLED
 *
 * This page has been temporarily disabled as the team is not ready to pay for OTP service costs.
 * The authentication flow has been simplified to: Register -> Login
 *
 * To re-enable OTP verification:
 * 1. Uncomment all code below
 * 2. Update register page to redirect here instead of /login
 * 3. Uncomment the setOtpSessionCookie import and usage in register page
 *
 * Last modified: 2025-11-26
 */

'use client'

import { useRouter } from 'next/navigation'
import { ShButton } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyOtpPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-screen">
                <div className="w-full max-w-md">
                    <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md">
                        <CardHeader className="text-center space-y-6 pb-8">
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                                    ฟีเจอร์ยังไม่พร้อมใช้งาน
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    ระบบยืนยัน OTP ถูกปิดใช้งานชั่วคราว
                                </p>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    กรุณาสมัครสมาชิกและเข้าสู่ระบบตามปกติ
                                </p>

                                <div className="flex flex-col gap-2">
                                    <ShButton
                                        onClick={() => router.push('/register')}
                                        className="w-full"
                                    >
                                        ไปหน้าสมัครสมาชิก
                                    </ShButton>
                                    <ShButton
                                        onClick={() => router.push('/login')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        ไปหน้าเข้าสู่ระบบ
                                    </ShButton>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

/* ========== COMMENTED OUT CODE - OTP VERIFICATION FEATURE ========== */

// import { useState, useEffect, useRef } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { ShIcon } from '@/components/ui/icon'
// import { toast } from 'sonner'
// import { verifyOtp, resendOtp } from '@/services/otp'
// import { useUserStore } from '@/stores/useUserStore'
// import { removeOtpSessionCookie } from '@/lib/auth-cookies'

// export default function VerifyOtpPage() {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const email = searchParams.get('email') || ''
//     const { setTokens } = useUserStore()
//
//     const [otp, setOtp] = useState(['', '', '', '', '', ''])
//     const [isVerifying, setIsVerifying] = useState(false)
//     const [isResending, setIsResending] = useState(false)
//     const [countdown, setCountdown] = useState(60)
//     const [canResend, setCanResend] = useState(false)
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([])
//
//     useEffect(() => {
//         inputRefs.current[0]?.focus()
//     }, [])
//
//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
//             return () => clearTimeout(timer)
//         } else {
//             setCanResend(true)
//         }
//     }, [countdown])
//
//     const handleChange = (index: number, value: string) => {
//         if (!/^\d*$/.test(value)) return
//
//         const newOtp = [...otp]
//         newOtp[index] = value.slice(-1)
//         setOtp(newOtp)
//
//         if (value && index < 5) {
//             inputRefs.current[index + 1]?.focus()
//         }
//
//         if (index === 5 && value && newOtp.every((digit) => digit !== '')) {
//             handleVerify(newOtp.join(''))
//         }
//     }
//
//     const handleKeyDown = (
//         index: number,
//         e: React.KeyboardEvent<HTMLInputElement>
//     ) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus()
//         }
//     }
//
//     const handlePaste = (e: React.ClipboardEvent) => {
//         e.preventDefault()
//         const pastedData = e.clipboardData.getData('text').slice(0, 6)
//         if (!/^\d+$/.test(pastedData)) return
//
//         const newOtp = pastedData
//             .split('')
//             .concat(Array(6).fill(''))
//             .slice(0, 6)
//         setOtp(newOtp)
//
//         const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
//         const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
//         inputRefs.current[focusIndex]?.focus()
//
//         if (newOtp.every((digit) => digit !== '')) {
//             handleVerify(newOtp.join(''))
//         }
//     }
//
//     const handleVerify = async (otpCode?: string) => {
//         const otpToVerify = otpCode || otp.join('')
//
//         if (otpToVerify.length !== 6) {
//             toast.error('กรุณากรอก OTP ให้ครบ 6 หลัก')
//             return
//         }
//
//         console.log('Verifying OTP:', otpToVerify)
//
//         setIsVerifying(true)
//         try {
//             const response = await verifyOtp({
//                 email,
//                 otp: otpToVerify,
//             })
//
//             if (response.data.error) {
//                 toast.error(
//                     response.data.error.description || 'รหัส OTP ไม่ถูกต้อง'
//                 )
//                 setOtp(['', '', '', '', '', ''])
//                 inputRefs.current[0]?.focus()
//             } else {
//                 removeOtpSessionCookie()
//                 const tokens = response.data.data?.item?.data
//                 if (tokens?.accessToken) {
//                     setTokens(tokens.accessToken, tokens.refreshToken)
//                     toast.success('ยืนยันอีเมลสำเร็จ! กำลังเข้าสู่ระบบ...')
//                     const randomDelay = Math.floor(Math.random() * 2000) + 1000
//                     setTimeout(() => {
//                         router.push('/')
//                     }, randomDelay)
//                 } else {
//                     toast.success('ยืนยันอีเมลสำเร็จ!')
//                     const randomDelay = Math.floor(Math.random() * 2000) + 1000
//                     setTimeout(() => {
//                         router.push('/login')
//                     }, randomDelay)
//                 }
//             }
//         } catch (error) {
//             console.error('OTP verification error:', error)
//             toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
//             setOtp(['', '', '', '', '', ''])
//             inputRefs.current[0]?.focus()
//         } finally {
//             setIsVerifying(false)
//         }
//     }
//
//     const handleResend = async () => {
//         if (!canResend || isResending) return
//
//         setIsResending(true)
//         try {
//             const response = await resendOtp({ email })
//
//             if (response.data.error) {
//                 toast.error(
//                     response.data.error.description ||
//                         'ไม่สามารถส่ง OTP ใหม่ได้'
//                 )
//             } else {
//                 toast.success('ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว')
//                 setCountdown(60)
//                 setCanResend(false)
//                 setOtp(['', '', '', '', '', ''])
//                 inputRefs.current[0]?.focus()
//             }
//         } catch (error) {
//             console.error('Resend OTP error:', error)
//             toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
//         } finally {
//             setIsResending(false)
//         }
//     }
//
//     return (
//         <div className="min-h-screen relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
//                 <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
//                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
//                 <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//             </div>
//
//             <div className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-screen">
//                 <div className="w-full max-w-md">
//                     <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md">
//                         <CardHeader className="text-center space-y-6 pb-8">
//                             <div className="flex justify-center">
//                                 <div className="relative">
//                                     <div className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
//                                         <ShIcon
//                                             name="mail"
//                                             className="h-8 w-8 text-white"
//                                         />
//                                     </div>
//                                     <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
//                                         <ShIcon
//                                             name="check"
//                                             className="h-3 w-3 text-white"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
//                                     ยืนยันอีเมล
//                                 </CardTitle>
//                                 <p className="text-sm text-muted-foreground">
//                                     เราได้ส่งรหัส OTP 6 หลักไปยัง
//                                 </p>
//                                 <p className="text-sm font-medium text-foreground">
//                                     {email}
//                                 </p>
//                             </div>
//                         </CardHeader>
//
//                         <CardContent className="space-y-6">
//                             <div>
//                                 <label className="block text-sm font-medium text-center mb-4">
//                                     กรอกรหัส OTP
//                                 </label>
//                                 <div
//                                     className="flex justify-center gap-2"
//                                     onPaste={handlePaste}
//                                 >
//                                     {otp.map((digit, index) => (
//                                         <input
//                                             key={index}
//                                             ref={(el) => {
//                                                 inputRefs.current[index] = el
//                                             }}
//                                             type="text"
//                                             inputMode="numeric"
//                                             maxLength={1}
//                                             value={digit}
//                                             onChange={(e) =>
//                                                 handleChange(
//                                                     index,
//                                                     e.target.value
//                                                 )
//                                             }
//                                             onKeyDown={(e) =>
//                                                 handleKeyDown(index, e)
//                                             }
//                                             className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                                             disabled={isVerifying}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//
//                             <div className="text-center space-y-2">
//                                 {!canResend ? (
//                                     <p className="text-sm text-muted-foreground">
//                                         ส่งรหัสใหม่ได้ใน{' '}
//                                         <span className="font-semibold text-primary">
//                                             {countdown}
//                                         </span>{' '}
//                                         วินาที
//                                     </p>
//                                 ) : (
//                                     <ShButton
//                                         variant="link"
//                                         onClick={handleResend}
//                                         disabled={isResending}
//                                         className="text-primary hover:text-primary/80"
//                                     >
//                                         {isResending ? (
//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
//                                                 กำลังส่ง...
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center gap-2">
//                                                 <ShIcon
//                                                     name="rotate-cw"
//                                                     className="h-4 w-4"
//                                                 />
//                                                 ส่งรหัส OTP ใหม่
//                                             </div>
//                                         )}
//                                     </ShButton>
//                                 )}
//                             </div>
//
//                             <ShButton
//                                 onClick={() => handleVerify()}
//                                 className="w-full h-12 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
//                                 disabled={
//                                     isVerifying || otp.some((digit) => !digit)
//                                 }
//                             >
//                                 {isVerifying ? (
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//                                         กำลังตรวจสอบ...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-2">
//                                         <ShIcon
//                                             name="check-circle"
//                                             className="h-4 w-4"
//                                         />
//                                         ยืนยัน OTP
//                                     </div>
//                                 )}
//                             </ShButton>
//
//                             <div className="pt-4 border-t border-border/50">
//                                 <div className="text-center space-y-4">
//                                     <p className="text-sm text-muted-foreground">
//                                         ไม่ได้รับรหัส OTP?
//                                     </p>
//                                     <div className="flex flex-col gap-2 text-xs text-muted-foreground">
//                                         <div className="flex items-center justify-center gap-1">
//                                             <ShIcon
//                                                 name="info"
//                                                 className="h-3 w-3"
//                                             />
//                                             <span>ตรวจสอบในกล่องจดหมายขยะ</span>
//                                         </div>
//                                         <div className="flex items-center justify-center gap-1">
//                                             <ShIcon
//                                                 name="clock"
//                                                 className="h-3 w-3"
//                                             />
//                                             <span>
//                                                 รอสักครู่แล้วลองอีกครั้ง
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="text-center">
//                                 <ShButton
//                                     variant="ghost"
//                                     onClick={() => router.push('/register')}
//                                     className="text-sm"
//                                 >
//                                     <ShIcon
//                                         name="arrow-left"
//                                         className="h-4 w-4 mr-2"
//                                     />
//                                     กลับไปหน้าสมัครสมาชิก
//                                 </ShButton>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }
