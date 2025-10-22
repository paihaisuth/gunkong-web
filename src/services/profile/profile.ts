import { ApiResponse } from '@/types/services'
import { UserProfileResponse } from '@/types/services/user'
import api from '@/plugin/axios'

export const fetchUserProfile = async (): ApiResponse<UserProfileResponse> => {
    return api.get('/profile')
}
