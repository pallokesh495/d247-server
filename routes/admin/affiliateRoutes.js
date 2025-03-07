import express from 'express';
const router = express.Router();
import AffiliateController from '../../controller/admin/AffiliateController.js'

// List all affiliates
router.get('/affiliates', AffiliateController.listAffiliates);

// Update the friends field for a specific affiliate
router.put('/affiliates/:uid/friends', AffiliateController.updateFriends);

export default router;