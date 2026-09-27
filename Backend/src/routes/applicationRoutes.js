import e from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import requireRole from '../middleware/requireRole.js';
import { createApplication, getMyApplications, updateApplication, deleteApplication, getSingleApplication } from "../controller/applicationController.js";

const router = e.Router();

router.post('/', authMiddleware, requireRole('student'),createApplication);
router.get('/',authMiddleware,requireRole('student'),getMyApplications);
router.get('/:id',authMiddleware,requireRole('student'),getSingleApplication);


router.put('/:id', authMiddleware, requireRole('student'),updateApplication);
router.delete('/:id', authMiddleware, requireRole('student'),deleteApplication);

export default router;