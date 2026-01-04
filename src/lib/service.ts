import type { z, ZodTypeAny } from 'zod'
import type { ApiResponse } from '../types/services'
import { ValidationDtoError } from '../types/services'

export type { ApiResponse }

export const callApi = <D, T extends ZodTypeAny>(
    rawData: z.input<T>,
    schema: T,
    onValidDataCallApi: (data: z.infer<T>) => ApiResponse<D>
) => {
    const validData = schema.safeParse(rawData)

    if (!validData.success) {
        throw new ValidationDtoError('ValidationDtoError', {
            cause: validData.error.issues.map((f) => ({
                field: f.path[0],
                message: f.message,
            })),
        })
    }

    return onValidDataCallApi(validData.data)
}
