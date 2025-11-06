import express from 'express';
import { verifyToken } from '../middlware/verifyToken.js';
import { createSwapRequest, getSwappableSlots, respondToSwapRequest, swapRequests } from '../controllers/swapRequest.controller.js';



const router = express.Router();

router.post('/',verifyToken,createSwapRequest);
router.get("/",verifyToken,getSwappableSlots);
router.post("/:id",verifyToken,respondToSwapRequest);
router.get("/req-slots",verifyToken,swapRequests);

export default router;