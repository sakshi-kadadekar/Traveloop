const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const prisma = require('../prisma')

const publicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  phone: user.phone,
  city: user.city,
  country: user.country,
  photo: user.photo,
  role: user.role,
})

const signToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
}

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, city, country } = req.body

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: 'Required fields missing', message: 'Required fields missing' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email: email.toLowerCase(),
        phone,
        password: hashed,
        city,
        country,
      },
    })

    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch {
    res.status(400).json({ error: 'User already exists', message: 'User already exists' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email: email?.toLowerCase() } })

    if (!user) {
      return res.status(400).json({ error: 'User not found', message: 'User not found' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ error: 'Wrong password', message: 'Wrong password' })
    }

    res.json({ token: signToken(user), user: publicUser(user) })
  } catch {
    res.status(500).json({ error: 'Server error', message: 'Server error' })
  }
})

router.get('/me', auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phone: true,
      city: true,
      country: true,
      photo: true,
      role: true,
    },
  })

  if (!user) return res.status(404).json({ error: 'User not found', message: 'User not found' })
  res.json(user)
})

router.put('/me', auth, async (req, res) => {
  const { password, role, id, email, ...data } = req.body
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
  })

  res.json(publicUser(user))
})

module.exports = router
