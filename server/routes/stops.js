const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

const findOwnedStop = async (stopId, userId) => {
  return prisma.stop.findFirst({
    where: { id: stopId, trip: { userId } },
  })
}

router.post('/', auth, async (req, res) => {
  const { tripId, city, country, startDate, endDate, orderIndex } = req.body
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } })

  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })
  if (!city || !startDate || !endDate) {
    return res.status(400).json({ error: 'City, start date, and end date are required', message: 'City, start date, and end date are required' })
  }

  const stop = await prisma.stop.create({
    data: {
      tripId,
      city,
      country,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      orderIndex: Number(orderIndex || 0),
    },
  })

  res.status(201).json(stop)
})

router.put('/:id', auth, async (req, res) => {
  const existing = await findOwnedStop(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Stop not found', message: 'Stop not found' })

  const data = { ...req.body }
  if (data.startDate) data.startDate = new Date(data.startDate)
  if (data.endDate) data.endDate = new Date(data.endDate)

  const stop = await prisma.stop.update({ where: { id: req.params.id }, data })
  res.json(stop)
})

router.delete('/:id', auth, async (req, res) => {
  const existing = await findOwnedStop(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Stop not found', message: 'Stop not found' })

  await prisma.stop.delete({ where: { id: req.params.id } })
  res.json({ message: 'Deleted' })
})

module.exports = router
