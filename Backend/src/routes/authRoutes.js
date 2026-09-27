import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { signup, verify, login, resend,logout, getMe, UpdateMe, updatePassword} from "../controller/authController.js";

const router = e.Router();

router.post('/signup',signup);

router.post('/verify',verify);

router.post('/resend-otp',resend);

router.post('/login',login);

router.post('/logout',logout);

router.get('/me', authMiddleware, getMe);

router.put('/me', authMiddleware, UpdateMe);

router.put('/updatePassword', authMiddleware, updatePassword);

export default router;