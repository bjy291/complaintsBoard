const router = require('express').Router()
const main = require('../model/main')
router.get('/', main.main)
//router.post('/chat',chat.chat)
module.exports = router