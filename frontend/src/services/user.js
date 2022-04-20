import useMutation from '../common/useMutation'
import useQuery from '../common/useQuery'
import enhancedFetch from '../libs/enhancedFetch'

export const useUserProfile = ({ autoRun = false } = {}) => {
  const { isLoading, hasSucceeded, refetch } = useQuery(
    'isLoggedIn',
    () => enhancedFetch('GET', '/api/auth/login'),
    {
      autoRun,
    },
  )

  return {
    isLoading,

    isLoggedIn: hasSucceeded,
    refetchProfile: refetch,
  }
}

export const useLoginMutation = () => {
  const { refetchProfile } = useUserProfile()

  return useMutation(async (values) => {
    await enhancedFetch('POST', '/api/auth/login', {
      data: values,
    })

    await refetchProfile()
  })
}

export const useRegisterMutation = () => {
  const { refetchProfile } = useUserProfile()

  return useMutation(async (values) => {
    await enhancedFetch('POST', '/api/auth/register', {
      data: values,
    })

    await refetchProfile()
  })
}

export const useLogoutMutation = () => {
  const { refetchProfile } = useUserProfile()

  return useMutation(async () => {
    await enhancedFetch('POST', '/api/auth/logout')

    await refetchProfile()
  })
}
