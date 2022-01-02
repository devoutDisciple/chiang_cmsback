const express = require('express');

const router = express.Router();
const addressService = require('../services/addressService');

// 获取地区
router.get('/all', (req, res) => {
	addressService.getAll(req, res);
});

// 获取地区
router.post('/addProvince', (req, res) => {
	addressService.addProvince(req, res);
});

// 删除地区
router.post('/deleteAddressById', (req, res) => {
	addressService.deleteAddressById(req, res);
});

module.exports = router;
