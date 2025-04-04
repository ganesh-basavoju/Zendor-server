import { Router } from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/me', validateRequest, userController.getMe);
router.patch('/updateMe', validateRequest, userController.updateMe);
router.delete('/deleteMe', validateRequest, userController.deleteMe);

router.use(protect); // Protect all routes after this middleware

export default router;
