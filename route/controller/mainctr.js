const router = require('express').Router()
const main = require('../model/main')
router.get('/', main.main)
router.get('/notice', main.notice)

router.get(['/minboard','/pagenum=:pno'], main.minboard)
router.get(['/minborad_get','/minborad_get?num=:pno'], main.minboard_get);
router.get("/minboard_write", main.minboard_write);
router.post("/minboard_writepost", main.minboard_writepost);
router.post("/minboard_commentpost", main.minboard_commentpost);


module.exports = router