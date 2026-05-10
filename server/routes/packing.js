const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

const findOwnedPackingItem = async (itemId, userId) => {
  return prisma.packingItem.findFirst({
    where: { id: itemId, trip: { userId } },
  })
}

router.get('/:tripId', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.id } })
  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const items = await prisma.packingItem.findMany({ where: { tripId: req.params.tripId } })
  res.json(items)
})

router.post('/', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user.id } })
  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const item = await prisma.packingItem.create({
    data: {
      tripId: req.body.tripId,
      name: req.body.name,
      category: req.body.category,
      isPacked: Boolean(req.body.isPacked),
    },
  })

  res.status(201).json(item)
})

router.put('/:id', auth, async (req, res) => {
  const existing = await findOwnedPackingItem(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Packing item not found', message: 'Packing item not found' })

  const item = await prisma.packingItem.update({ where: { id: req.params.id }, data: req.body })
  res.json(item)
})

router.delete('/:id', auth, async (req, res) => {
  const existing = await findOwnedPackingItem(req.params.id, req.user.id)
  if (!existing) return res.status(404).json({ error: 'Packing item not found', message: 'Packing item not found' })

  await prisma.packingItem.delete({ where: { id: req.params.id } })
  res.json({ message: 'Deleted' })
})

module.exports = router
