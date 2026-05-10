const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only', message: 'Admin only' })
  }

  next()
}

router.get('/stats', auth, adminOnly, async (_req, res) => {
  const totalUsers = await prisma.user.count()
  const totalTrips = await prisma.trip.count()
  const topCities = await prisma.stop.groupBy({
    by: ['city'],
    _count: { city: true },
    orderBy: { _count: { city: 'desc' } },
    take: 5,
  })
  const topActivities = await prisma.activity.groupBy({
    by: ['type'],
    _count: { type: true },
    orderBy: { _count: { type: 'desc' } },
    take: 5,
  })

  res.json({ totalUsers, totalTrips, topCities, topActivities })
})

router.get('/users', auth, adminOnly, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      trips: { select: { id: true } },
    },
  })

  res.json(users)
})

router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } })
  res.json({ message: 'User deleted' })
})

module.exports = router
