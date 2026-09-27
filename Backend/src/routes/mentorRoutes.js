import { getAllMentors, getMyStudents, getStudentApplications} from "../controller/mentorController.js";
import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/requireRole.js";
const router = e.Router();

router.get('/mentors',getAllMentors);    //For Dropdown during the signup page.
router.get('/mentor/students',authMiddleware, requireRole('mentor'),getMyStudents);
router.get('/mentor/student/applications/:studentId', authMiddleware, requireRole('mentor'), getStudentApplications);

export default router;