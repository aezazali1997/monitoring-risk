import Express from "express";
import { CityController } from '../controllers/city.controller'
const cityController = new CityController();
export const CityRouter = Express.Router();

CityRouter.post('/', cityController.get24HourCitiesList);
