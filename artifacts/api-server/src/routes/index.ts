import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import simRouter from "./sim";
import twofaRouter from "./twofa";
import accountRouter from "./account";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(simRouter);
router.use(twofaRouter);
router.use(accountRouter);

export default router;
