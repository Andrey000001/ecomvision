import express from 'express';
import { getUser } from '../controllers/general.js';
console.log('🚀 ~ getUser:', getUser);

const router = express.Router();

router.get('/user/:id', getUser);
export default router;
