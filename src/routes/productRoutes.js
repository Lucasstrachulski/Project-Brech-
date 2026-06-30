const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', requireAuth, upload.single('image'), create);
router.put('/:id', requireAuth, upload.single('image'), update);
router.delete('/:id', requireAuth, remove);

module.exports = router;
