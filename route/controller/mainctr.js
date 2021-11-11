const router = require('express').Router()
const main = require('../model/main')
router.get('/', main.main)
router.get('/notice', main.notice)

router.get(['/minboard','/pagenum=:pno'], main.minboard)
router.get(['/minborad_get','/minborad_get?num=:pno'], main.minboard_get);

module.exports = router