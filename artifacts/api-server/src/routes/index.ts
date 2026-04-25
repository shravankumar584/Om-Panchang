import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subscribersRouter from "./subscribers";
import horoscopesRouter from "./horoscopes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subscribersRouter);
router.use(horoscopesRouter);

export default router;
