const router = require('express').Router();
const root=require('../model/root');

router.get('/', root.root)
router.post('/', root.rootpost)

router.get('/chart1', root.chart1)
module.exports = router