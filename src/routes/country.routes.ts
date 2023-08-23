import Express from "express";
import { CountryController } from '../controllers/country.controller'
const countContr = new CountryController();
export const CountryRouter = Express.Router();

CountryRouter.post('/', countContr.get24HourCountriesList);