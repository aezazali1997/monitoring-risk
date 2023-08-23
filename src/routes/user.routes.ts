import Express from 'express';
export const userRouter = Express.Router();
import { UserController } from '../controllers/user.controller'
import { SqlController } from '../controllers/sql.controller';
const usrController = new UserController()
const sqlController = new SqlController()


userRouter.get('/last-30-minutes', usrController.last30Minute)
userRouter.post('/', usrController.getTotalUsers)
userRouter.post('/monthly', usrController.usersVsMonth)
userRouter.post('/unique', usrController.uniqueVisitors)
userRouter.post('/unique-returning', usrController.uniqueVsReturningVisitors)
userRouter.post('/interest', usrController.getUserInterest)
userRouter.get('/best-audio', sqlController.bestAudio)
userRouter.get('/best-article', sqlController.bestArticle)
userRouter.post('/all-content', sqlController.getAllContent)







