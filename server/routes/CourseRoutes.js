import express from 'express';
import { addCourse, displayAllCourse, deleteCourse, singleCourseDisplay, updateCourse } from '../controller/CourseController.js';
import { requireAuth } from '../middleware/RequireAuth.js';

const router = express.Router();


// Route 1: Displaying all courses
router.get('/displayCourse', displayAllCourse);

// Route 2: Displaying a single course
router.get('/displayCourse/:id', singleCourseDisplay);

// Route 3: Add a course
router.post('/addCourse',requireAuth(['teacher','admin']),addCourse);

// Route 4: Delete a course
router.delete('/deleteCourse/:id',requireAuth('teacher'),deleteCourse);

// Route 5: Update a course
router.patch('/updateCourse/:id',requireAuth('teacher'), updateCourse);

export default router;
