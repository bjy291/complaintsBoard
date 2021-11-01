const router = require('express').Router()
const main = require('../model/main')
router.get('/', main.main)
router.get('/notice', main.notice)
router.get('/login', main.login)
router.get('/regi', main.regi)
module.exports = router