const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(getAll));
router.get('/:id', asyncHandler(getById));
router.post('/', requireAuth, upload.single('image'), asyncHandler(create));
router.put('/:id', requireAuth, upload.single('image'), asyncHandler(update));
router.delete('/:id', requireAuth, asyncHandler(remove));

module.exports = router;
