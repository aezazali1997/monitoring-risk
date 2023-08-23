import express from 'express';
import { ListController } from '../controllers/list.controller'
import { SqlController } from '../controllers/sql.controller';
const listController = new ListController();
const sqlController = new SqlController();
export const ListRouter = express.Router();

ListRouter.post('/', listController.getList)
ListRouter.post('/male-female-stats', listController.maleVsFemale)
ListRouter.post('/age-stats', listController.ageStats)
ListRouter.post('/ip', sqlController.getIPs)