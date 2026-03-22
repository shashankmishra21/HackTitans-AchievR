const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/certificate.controller');

router.get('/certificates/verify/:certificateId', verifyCertificate);

module.exports = router;