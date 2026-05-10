const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

const findOwnedActivity = async (activityId, userId) => {
  return prisma.activity.findFirst({
    where: { id: activityId, stop: { trip: { userId } } },
  })
}

router.get('/global', auth, async (req, res) => {
  const { cityId, type, maxCost } = req.query
  const where = {}
  if (cityId) where.cityId = cityId
  if (type) where.type = type
  if (maxCost) where.cost = { lte: Number(maxCost) }

  const activities = await prisma.globalActivity.findMany({ where })
  res.json(activities)
})

router.get('/search', auth, async (req, res) => {
  const query = req.query.q || ''
  const activities = await prisma.activity.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
      stop: { trip: { userId: req.user.id } },
    },
    take: 20,
  })

  res.json(activities)
})

router.post('/', auth, async (req, res) => {
  const stop = await prisma.stop.findFirst({
    where: { id: req.body.stopId, trip: { userId: req.user.id } },
  })

  if (!stop) return res.status(404).json({ error: 'Stop not found', message: 'Stop not found' })

  const activity = await prisma.activity.create({
    data: {
      stopId: req.body.stopId,
      name: req.body.name,
      type: req.body.type,
      cost: Number(req.body.cost || 0),
      duration: req.body.duration,
      timeOfDay: req.body.timeOfDay,
      description: req.body.description,
    },
  })

  res.status(201).json(activity)
})

router.put('/:id', auth, async (req, res) => {
  const existing = await findOwnedActivity(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Activity not found', message: 'Activity not found' })

  const data = { ...req.body }
  if (data.cost !== undefined) data.cost = Number(data.cost)

  const activity = await prisma.activity.update({ where: { id: req.params.id }, data })
  res.json(activity)
})

router.delete('/:id', auth, async (req, res) => {
  const existing = await findOwnedActivity(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Activity not found', message: 'Activity not found' })

  await prisma.activity.delete({ where: { id: req.params.id } })
  res.json({ message: 'Deleted' })
})

module.exports = router
