import express from 'express';
import { userSignUp,userLogin } from '../controller/UserController.js';
const router=express.Router();
import validationReq from '../middleware/Validation.js';

//Route 1: SignUp
router.post('/signUp',validationReq,userSignUp);

//Route 2: LogIn
router.post('/logIn',userLogin);

export default router;