import express, { Router } from 'express';
import { handleContent } from '../controllers/sentimentController';

const router = Router();

router.post('/', handleContent);

export default router;
