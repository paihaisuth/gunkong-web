import { useState, useCallback } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useUserStore } from '@/stores/useUserStore'

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

const handleResponse = (response: any): any => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
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
                        (response as any)?.item || (response as any)?.items
                    setState((prev) => ({ ...prev, data, isFetching: false }))

                    if (onOk) {
                        onOk(data)
                    }
                } catch (error: unknown) {
                    if ((error as any).response?.status === 401) {
                        useUserStore.getState().logout()

                        if (notifyError) {
                            console.error(
                                'Authentication failed. Please login again.'
                            )
                        }
                    }

                    if (onError) {
                        onError(error)
                    }

                    if ((error as any).response) {
                        if ((error as any).response.data?.error?.message) {
                            const { message } = (error as any).response.data
                                .error

                            // TODO: Replace with your notification system
                            if (notifyError) {
                                console.error(message)
                            }
                        }
                    } else if ((error as any).request) {
                        // TODO: Replace with your notification system
                        if (notifyError) {
                            console.error((error as any).request)
                        }
                    } else {
                        // TODO: Replace with your notification system
                        if (notifyError) {
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
