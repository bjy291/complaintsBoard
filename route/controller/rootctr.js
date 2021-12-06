const router = require('express').Router();
const root=require('../model/root');

router.get('/', root.root);
router.post('/', root.rootpost);

router.post('/min_boardClick', root.min_boardClick);
router.post('/insert_minComplaints', root.insert_minComplaints);
router.post('/delete_minComplaints', root.delete_minComplaints);

router.get('/chart1', root.chart1);
router.post('/chartMonth', root.chartMonth);

router.get('/calender', root.calender);
module.exports = router