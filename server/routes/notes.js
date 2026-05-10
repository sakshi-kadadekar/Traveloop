const router = require('express').Router()
const auth = require('../middleware/auth')
const prisma = require('../prisma')

router.get('/:tripId', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.id } })
  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const notes = await prisma.tripNote.findMany({
    where: { tripId: req.params.tripId },
    orderBy: { createdAt: 'desc' },
  })

  res.json(notes)
})

router.post('/', auth, async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.body.tripId, userId: req.user.id } })
  if (!trip) return res.status(404).json({ error: 'Trip not found', message: 'Trip not found' })

  const note = await prisma.tripNote.create({
    data: {
      tripId: req.body.tripId,
      userId: req.user.id,
      content: req.body.content,
      day: req.body.day,
      stopName: req.body.stopName,
    },
  })

  res.status(201).json(note)
})

router.delete('/:id', auth, async (req, res) => {
  const note = await prisma.tripNote.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  })

  if (!note) return res.status(404).json({ error: 'Note not found', message: 'Note not found' })

  await prisma.tripNote.delete({ where: { id: req.params.id } })
  res.json({ message: 'Deleted' })
})

module.exports = router
