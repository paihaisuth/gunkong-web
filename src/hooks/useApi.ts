import { useState, useCallback } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'next/navigation'

interface IHttpOptions {
    baseUrl: null
}

type PartialIHttpOptions = Partial<IHttpOptions>

const http = (options: PartialIHttpOptions = {}): AxiosInstance => {
    const { baseUrl } = options
    const { accessToken } = useUserStore.getState()

    return axios.create({
        baseURL: baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

const httpWithoutHeader = (
    options: PartialIHttpOptions = {}
): AxiosInstance => {
    const { baseUrl } = options

    return axios.create({
        baseURL: baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL,
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleResponse = (response: any): any => {
    if (response.data?.data) {
        return response.data.data
    }

    if (response.data?.error) {
        throw new Error(response.data.error.message)
    }

    if (response.response?.data?.error) {
        throw new Error(response.response.data.error.message)
    }

    if (response.message) {
        throw new Error(response.message)
    }

    return response
}

interface Options {
    baseURL?: string
    httpOptions?: Partial<IHttpOptions>
    notifyError?: boolean
    withToken?: boolean
    path: string
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    payload?: Record<string, unknown>
    onOk?: (data: unknown) => void
    onError?: (error: unknown) => void
    initFetchState?: boolean
}

export const useApi = <IResponse>(options: Options) => {
    const {
        baseURL,
        httpOptions,
        notifyError = true,
        withToken = true,
        path,
        method,
        onOk,
        onError,
        initFetchState = true,
    } = options
    const { payload } = options
    const router = useRouter()

    const [state, setState] = useState({
        isFetching: initFetchState,
        data: {} as IResponse,
        error: null as unknown,
        abort: null as AbortController | null,
    })

    const abort = useCallback(() => {
        if (state.abort) {
            state.abort.abort()
        }
    }, [state.abort])

    const execute = useCallback(
        async (dynamicPayload?: Record<string, unknown>) => {
            const tryApi = async (fetchPromise: () => Promise<unknown>) => {
                setState((prev) => ({ ...prev, isFetching: true, error: null }))

                try {
                    let response = await fetchPromise()

                    response = handleResponse(response)

                    const data =
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (response as any)?.item || (response as any)?.items
                    setState((prev) => ({ ...prev, data, isFetching: false }))

                    if (onOk) {
                        onOk(data)
                    }
                } catch (error: unknown) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((error as any).response?.status === 401) {
                        useUserStore.getState().logout()

                        if (notifyError) {
                            console.error(
                                'Authentication failed. Please login again.'
                            )
                        }

                        const currentPath = window.location.pathname
                        if (currentPath !== '/login') {
                            router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`)
                        }
                    }

                    if (onError) {
                        onError(error)
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((error as any).response) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ((error as any).response.data?.error?.message) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const { message } = (error as any).response.data
                                .error

                            // TODO: Replace with your notification system
                            if (notifyError) {
                                console.error(message)
                            }
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } else if ((error as any).request) {
                        // TODO: Replace with your notification system
                        if (notifyError) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            console.error((error as any).request)
                        }
                    } else {
                        // TODO: Replace with your notification system
                        if (notifyError) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            console.error((error as any).message)
                        }
                    }

                    setState((prev) => ({ ...prev, error, isFetching: false }))
                }
            }

            const abortController = new AbortController()
            setState((prev) => ({ ...prev, abort: abortController }))

            let _payload: string | Record<string, unknown> | FormData

            const payloadToUse = dynamicPayload || payload

            if (payloadToUse) {
                _payload =
                    payloadToUse instanceof FormData
                        ? payloadToUse
                        : JSON.stringify(payloadToUse)
            }

            if (withToken) {
                return await tryApi(() =>
                    http(httpOptions)({
                        baseURL,
                        url: path,
                        method,
                        data: _payload,
                        signal: abortController.signal,
                    })
                )
            }

            await tryApi(() =>
                httpWithoutHeader(httpOptions)({
                    baseURL,
                    url: path,
                    method,
                    data: _payload,
                    signal: abortController.signal,
                })
            )
        },
        [
            baseURL,
            httpOptions,
            withToken,
            path,
            method,
            payload,
            notifyError,
            onOk,
            onError,
            router,
        ]
    )

    return {
        isFetching: state.isFetching,
        data: state.data,
        error: state.error,
        abort,
        execute,
    }
}
