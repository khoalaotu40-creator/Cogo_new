const express = require('express');
const app = express();
const router = express.Router();
router.get('/:userId', (req, res) => res.send('userId matched: ' + req.params.userId));
router.get('/status/:rideId', (req, res) => res.send('status matched: ' + req.params.rideId));
app.use('/api/rides', router);
app.listen(3001, () => console.log('started'));
