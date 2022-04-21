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

export const useAdventuresSearch = () => {
  const { isPending, data, execute } = useQuery(
    'searchAdventures',
    (query) =>
      enhancedFetch(
        'GET',
        `/api/adventure/search?query=${encodeURIComponent(query)}`,
        { parseJSON: true },
      ),
    {
      selector: ({ data }) => data,
    },
  )

  return {
    isPending,
    data,

    search: execute,
  }
}
