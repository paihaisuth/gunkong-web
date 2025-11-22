'use client'

import React, { Component, ReactNode } from 'react'
import { ShButton } from './ui/button'
import { ShIcon } from './ui/icon'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to error reporting service
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught an error:', error, errorInfo)
        }
        // In production, you would send this to an error tracking service
        // e.g., Sentry, LogRocket, etc.
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                <ShIcon
                                    name="alert-circle"
                                    size={32}
                                    className="text-destructive"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">
                                เกิดข้อผิดพลาด
                            </h1>
                            <p className="text-muted-foreground">
                                ขออภัย มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง
                            </p>
                            {process.env.NODE_ENV === 'development' &&
                                this.state.error && (
                                    <details className="mt-4 p-4 bg-muted rounded-lg text-left text-sm">
                                        <summary className="cursor-pointer font-medium mb-2">
                                            รายละเอียดข้อผิดพลาด (Development
                                            Only)
                                        </summary>
                                        <pre className="text-xs overflow-auto mt-2 p-2 bg-background rounded">
                                            {this.state.error.message}
                                            {'\n\n'}
                                            {this.state.error.stack}
                                        </pre>
                                    </details>
                                )}
                        </div>

                        <div className="flex gap-2 justify-center">
                            <ShButton onClick={this.handleReset}>
                                <ShIcon name="refresh-cw" size={16} />
                                <span className="ml-2">ลองใหม่อีกครั้ง</span>
                            </ShButton>
                            <ShButton
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = '/')
                                }
                            >
                                <ShIcon name="home" size={16} />
                                <span className="ml-2">กลับหน้าหลัก</span>
                            </ShButton>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
