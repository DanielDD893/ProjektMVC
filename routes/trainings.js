const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

router.get('/', trainingController.index);

router.get('/new', trainingController.new);

router.post('/', trainingController.create);

router.get('/:id', trainingController.show);

router.get('/:id/edit', trainingController.edit);

router.put('/:id', trainingController.update);

router.delete('/:id', trainingController.destroy);

module.exports = router; 