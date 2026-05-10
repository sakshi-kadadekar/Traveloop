const router = require('express').Router()
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

const profileFields = ({ firstName, lastName, username, phone, city, country, photo }) => ({
  ...(firstName !== undefined && { firstName }),
  ...(lastName !== undefined && { lastName }),
  ...(username !== undefined && { username }),
  ...(phone !== undefined && { phone }),
  ...(city !== undefined && { city }),
  ...(country !== undefined && { country }),
  ...(photo !== undefined && { photo }),
})

router.get('/', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })

  if (!user) {
    return res.status(404).json({ error: 'User not found', message: 'User not found' })
  }

  res.json(publicUser(user))
})

const updateProfile = async (req, res) => {
  try {
    const data = profileFields(req.body)

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
    })

    res.json(publicUser(user))
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed', message: error.message })
  }
}

router.put('/', auth, updateProfile)
router.patch('/', auth, updateProfile)

module.exports = router
