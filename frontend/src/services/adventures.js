import useQuery from '../common/useQuery'
import enhancedFetch from '../libs/enhancedFetch'

export const useRecentAdventures = ({ autoRun = false } = {}) => {
  const { isLoading, data } = useQuery(
    'recentAdventures',
    () => enhancedFetch('GET', '/api/adventure/recent', { parseJSON: true }),
    {
      autoRun,
      selector: ({ data }) => data,
    },
  )

  return {
    isLoading,
    data,
  }
}
