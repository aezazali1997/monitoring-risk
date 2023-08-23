import Express from 'express';
export const sqlRouter = Express.Router();
import { SqlController } from '../controllers/sql.controller'
const sqlController = new SqlController()

sqlRouter.post('/', sqlController.getIPs)




