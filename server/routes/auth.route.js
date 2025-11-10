import express from 'express';
import { getUser, login, logOut, register } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlware/verifyToken.js';

const router = express.Router();


router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)
router.post('/user',verifyToken,getUser)


export default router;