import Express from "express";
import { VisitController } from '../controllers/visit.controller'
export const VisitRouter = Express.Router();
const visitController = new VisitController();
// VisitRouter.post('/', visitController.get24HourVisitList);
VisitRouter.post('/average-time', visitController.getAverageEngagementTime);
VisitRouter.post('/most-viewed', visitController.top3MostViewed);
VisitRouter.post('/', visitController.getVisitorsDetails);

