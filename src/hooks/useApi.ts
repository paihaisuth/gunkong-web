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

const handleResponse = (response: any) => {
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
}

interface Options {
    baseURL?: string
    httpOptions?: Partial<IHttpOptions>
    notifyError?: boolean
    withToken?: boolean
    path: string
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    payload?: Record<string, any>
    onOk?: (data: any) => void
    onError?: (error: any) => void
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
        error: null as any,
        abort: null as AbortController | null,
    })

    const abort = useCallback(() => {
        if (state.abort) {
            state.abort.abort()
        }
    }, [state.abort])

    const tryApi = async (fetchPromise: () => Promise<any>) => {
        setState((prev) => ({ ...prev, isFetching: true, error: null }))

        try {
            let response = await fetchPromise()

            response = handleResponse(response)

            const data = response?.item || response?.items
            setState((prev) => ({ ...prev, data, isFetching: false }))

            onOk && onOk(data)
        } catch (error: any) {
            if (error.response?.status === 401) {
                useUserStore.getState().logout()

                if (notifyError) {
                    console.error('Authentication failed. Please login again.')
                }
            }

            onError && onError(error)

            if (error.response) {
                if (error.response.data?.error?.message) {
                    const { message } = error.response.data.error

                    // TODO: Replace with your notification system
                    notifyError && console.error(message)
                }
            } else if (error.request) {
                // TODO: Replace with your notification system
                notifyError && console.error(error.request)
            } else {
                // TODO: Replace with your notification system
                notifyError && console.error(error.message)
            }

            setState((prev) => ({ ...prev, error, isFetching: false }))
        }
    }

    const execute = useCallback(
        async (dynamicPayload?: Record<string, any>) => {
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
        [baseURL, httpOptions, withToken, path, method, payload]
    )

    return {
        isFetching: state.isFetching,
        data: state.data,
        error: state.error,
        abort,
        execute,
    }
}
