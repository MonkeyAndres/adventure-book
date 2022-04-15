const { Router } = require('express')
const { PrismaClient } = require('@prisma/client')

const formatAdventureTags = ({ TagInAdventure, ...adventure }) => ({
  ...adventure,
  tags: TagInAdventure.map((adventureTag) => adventureTag.tag),
})

const createTagQuery = (userId, isPerson) => (label) => ({
  tag: {
    connectOrCreate: {
      where: {
        label_creatorId: {
          label,
          creatorId: userId,
        },
      },
      create: {
        label,
        isPerson,
        creatorId: userId,
      },
    },
  },
})

const RECENT_ADVENTURES_RECORDS_LIMIT = 15
const SEARCH_ADVENTURES_RECORDS_LIMIT = 20

const adventureDataSelect = {
  id: true,
  title: true,
  content: true,
  updatedAt: true,

  TagInAdventure: {
    select: {
      tag: {
        select: {
          label: true,
          isPerson: true,
        },
      },
    },
  },
}

const adventureRoutes = () => {
  const router = Router()
  const prisma = new PrismaClient()

  const removeUnusedTags = async (tagInAdventureList) => {
    const tagsToRemove = []

    for (const adventureTag of tagInAdventureList) {
      const tagOccurrences = await prisma.tagInAdventure.count({
        where: {
          tagId: adventureTag.tagId,
        },
      })

      if (tagOccurrences === 0) {
        tagsToRemove.push(adventureTag.tagId)
      }
    }

    if (tagsToRemove.length === 0) {
      return
    }

    await prisma.tag.deleteMany({
      where: {
        id: {
          in: tagsToRemove,
        },
      },
    })
  }

  // POST /adventure

  router.post('/adventure', async (req, res) => {
    const { title, content, tags = [], people = [] } = req.body
    const userId = req.user.id

    if (!title || !content || !tags || !people) {
      return res.status(400).json({ error: `Missing fields` })
    }

    const tagsToCreate = tags.map(createTagQuery(userId, false))
    const peopleToCreate = people.map(createTagQuery(userId, true))

    const adventure = await prisma.adventure.create({
      data: {
        title,
        content,
        authorId: userId,

        TagInAdventure: {
          create: [...tagsToCreate, ...peopleToCreate],
        },
      },

      select: adventureDataSelect,
    })

    return res.json(formatAdventureTags(adventure))
  })

  // PUT /adventure/:id

  router.put('/adventure/:id', async (req, res) => {
    const { id } = req.params
    const numericId = parseInt(id, 10)

    if (!numericId || !Number.isInteger(numericId)) {
      return res.status(400).json({ message: `Invalid adventure id "${id}"` })
    }

    const userId = req.user.id

    // 0. Check if user owns an adventure with `numericId`

    const adventureInDB = await prisma.adventure.findUnique({
      where: {
        id_authorId: {
          id: numericId,
          authorId: userId,
        },
      },

      select: {
        TagInAdventure: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
      },
    })

    if (!adventureInDB) {
      return res
        .status(500)
        .json({ message: `There's no adventure with id "${numericId}"` })
    }

    const { title, content, tags = [], people = [] } = req.body

    // 1. Get which tags should be added

    const existingTagLabels = adventureInDB.TagInAdventure.map(
      (adventureTag) => adventureTag.tag.label,
    )

    const newTags = tags
      .filter((label) => !existingTagLabels.includes(label))
      .map(createTagQuery(userId, false))

    const newPeople = people
      .filter((label) => !existingTagLabels.includes(label))
      .map(createTagQuery(userId, true))

    // 2. Get which tags should be removed

    const removedTags = adventureInDB.TagInAdventure.filter(
      ({ tag: { label } }) => !tags.includes(label) && !people.includes(label),
    ).map((adventureTag) => adventureTag.tag.id)

    // 3. Update the adventure

    const adventure = await prisma.adventure.update({
      where: {
        id_authorId: {
          id: numericId,
          authorId: userId,
        },
      },

      data: {
        title,
        content,

        TagInAdventure: {
          create: [...newTags, ...newPeople],

          deleteMany: {
            adventureId: numericId,
            tagId: {
              in: removedTags,
            },
          },
        },
      },

      select: adventureDataSelect,
    })

    // 4. Remove any unused tags after updating the adventure

    await removeUnusedTags(removedTags.map((tagId) => ({ tagId })))

    return res.json(formatAdventureTags(adventure))
  })

  // DELETE /adventure/:id

  router.delete('/adventure/:id', async (req, res) => {
    const userId = req.user.id
    const { id } = req.params
    const numericId = parseInt(id, 10)

    if (!numericId || !Number.isInteger(numericId)) {
      return res.status(400).json({ message: `Invalid adventure id "${id}"` })
    }

    try {
      const removedAdventure = await prisma.adventure.delete({
        where: {
          id_authorId: {
            id: numericId,
            authorId: userId,
          },
        },

        select: {
          id: true,
          TagInAdventure: {
            select: {
              tagId: true,
            },
          },
        },
      })

      await removeUnusedTags(removedAdventure.TagInAdventure)

      return res.status(200).end()
    } catch (error) {
      return res.status(500).json({ message: error.meta.cause })
    }
  })

  // GET /adventure/recent

  router.get('/adventure/recent', async (req, res) => {
    const userId = req.user.id

    const adventures = await prisma.adventure.findMany({
      select: adventureDataSelect,

      where: {
        authorId: userId,
      },

      orderBy: {
        updatedAt: 'desc',
      },

      take: RECENT_ADVENTURES_RECORDS_LIMIT,
    })

    if (!adventures) {
      res.json({})
    }

    const formattedAdventures = adventures.map(formatAdventureTags)

    return res.json(formattedAdventures)
  })

  // GET /adventure/search/?query=""

  router.get('/adventure/search', async (req, res) => {
    const userId = req.user.id
    const searchQuery = req.query.query

    const searchResults = await prisma.adventure.findMany({
      where: {
        authorId: userId,

        OR: [
          {
            content: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            TagInAdventure: {
              some: {
                tag: {
                  label: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },

      take: SEARCH_ADVENTURES_RECORDS_LIMIT,

      orderBy: {
        updatedAt: 'desc',
      },

      select: adventureDataSelect,
    })

    return res.json(searchResults.map(formatAdventureTags))
  })

  return router
}

module.exports = adventureRoutes
