const express = require('express');
const {
    createClient,
    getClients,
    updateClient,
    deleteClient
} = require('../controllers/client.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); 
router.post('/:salonId', authorize(['owner', 'master', 'admin']), createClient);
router.get('/:salonId', authorize(['owner', 'master', 'admin']), getClients);
router.put('/:clientId', authorize(['owner', 'master', 'admin']), updateClient);
router.delete('/:clientId', authorize(['owner', 'admin']), deleteClient);


module.exports = router;