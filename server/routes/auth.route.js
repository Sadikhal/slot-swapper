import express from 'express';
import { getUser, login, logOut, register } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)
router.post('/user',getUser)


export default router;