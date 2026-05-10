const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

router.get('/public/:id', async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { id: req.params.id, isPublic: true },
    include: {
      stops: { include: { activities: true }, orderBy: { orderIndex: 'asc' } },
      budget: true,
      user: { select: { firstName: true, lastName: true, username: true } },
    },
  })

  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })
  res.json(trip)
})

router.get('/all/public', async (_req, res) => {
  const trips = await prisma.trip.findMany({
    where: { isPublic: true },
    include: {
      stops: true,
      user: { select: { firstName: true, lastName: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(trips)
})

router.get('/', auth, async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.id },
    include: { stops: true, budget: true },
    orderBy: { createdAt: 'desc' },
  })

  res.json(trips)
})

router.get('/:id', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      stops: { include: { activities: true }, orderBy: { orderIndex: 'asc' } },
      budget: true,
      packing: true,
      notes: { orderBy: { createdAt: 'desc' } },
      invoices: true,
    },
  })

  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })
  res.json(trip)
})

router.post('/', auth, async (req, res) => {
  const { name, description, coverPhoto, isPublic, status } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Trip name is required', message: 'Trip name is required' })
  }

  const trip = await prisma.trip.create({
    data: {
      name,
      description,
      coverPhoto,
      isPublic: Boolean(isPublic),
      status: status || 'upcoming',
      userId: req.user.id,
    },
  })

  res.status(201).json(trip)
})

router.put('/:id', auth, async (req, res) => {
  const existing = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } })
  if (!existing) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const trip = await prisma.trip.update({
    where: { id: req.params.id },
    data: req.body,
  })

  res.json(trip)
})

router.delete('/:id', auth, async (req, res) => {
  const existing = await prisma.trip.findFirst({ where: { id: req.params.id, userId: req.user.id } })
  if (!existing) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  await prisma.trip.delete({ where: { id: req.params.id } })
  res.json({ message: 'Deleted' })
})

router.post('/:id/copy', auth, async (req, res) => {
  const original = await prisma.trip.findUnique({
    where: { id: req.params.id },
    include: { stops: { include: { activities: true } } }
  })
  if (!original) return res.status(404).json({ error: 'Trip not found' })

  const copy = await prisma.trip.create({
    data: {
      userId: req.user.id,
      name: original.name + ' (Copy)',
      description: original.description,
      coverPhoto: original.coverPhoto,
      isPublic: false,
      status: 'upcoming',
      stops: {
        create: original.stops.map(stop => ({
          cityId: stop.cityId,
          cityName: stop.cityName,
          country: stop.country,
          startDate: stop.startDate,
          endDate: stop.endDate,
          orderIndex: stop.orderIndex,
          activities: {
            create: stop.activities.map(act => ({
              name: act.name,
              type: act.type,
              cost: act.cost,
              duration: act.duration,
              timeOfDay: act.timeOfDay,
              description: act.description
            }))
          }
        }))
      }
    }
  })
  res.json(copy)
})

module.exports = router
