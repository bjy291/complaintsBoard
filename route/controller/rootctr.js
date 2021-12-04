const router = require('express').Router();
const root=require('../model/root');

router.get('/', root.root);
router.post('/', root.rootpost);

router.post('/min_boardClick', root.min_boardClick);
router.post('/insert_minComplaints', root.insert_minComplaints);

router.get('/chart1', root.chart1)
module.exports = router