import useMutation from '../common/useMutation'
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

export const useAdventureData = (adventureId, autoRun) => {
  const { isLoading, hasErrored, data, refetch } = useQuery(
    `adventureData_${adventureId}`,
    () =>
      enhancedFetch('GET', `/api/adventure/${adventureId}`, {
        parseJSON: true,
      }),
    {
      autoRun,
      selector: ({ data }) => data,
    },
  )

  return {
    isLoading,
    hasErrored,
    data,

    refetch,
  }
}

export const useAdventureCreateMutation = (history) => {
  const { isPending, execute } = useMutation(async (values) => {
    const { data } = await enhancedFetch('POST', `/api/adventure`, {
      parseJSON: true,
      data: values,
    })

    history.replace(`/adventure/${data.id}`)
  })

  return {
    isCreatingAdventure: isPending,
    createAdventure: execute,
  }
}

export const useAdventureEditMutation = (adventureId) => {
  const { refetch } = useAdventureData(adventureId, false)

  const { isPending, execute } = useMutation(async (values) => {
    await enhancedFetch('PUT', `/api/adventure/${adventureId}`, {
      data: values,
    })
    await refetch()
  })

  return {
    isEditingAdventure: isPending,
    editAdventure: execute,
  }
}

export const useAdventureDeleteMutation = (adventureId, history) => {
  const { isPending, execute } = useMutation(async () => {
    await enhancedFetch('DELETE', `/api/adventure/${adventureId}`)
    history.push('/')
  })

  return {
    isDeletingAdventure: isPending,
    deleteAdventure: execute,
  }
}
