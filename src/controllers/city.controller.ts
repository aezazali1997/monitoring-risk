import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics'
export class CityController {
    googleAnalytics = new GoogleAnalyticsDataApi();

    constructor() {
        this.get24HourCitiesList = this.get24HourCitiesList.bind(this)
    }
    async get24HourCitiesList(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await this.googleAnalytics.getCitiesReport(startDate, endDate);
            return res.status(200).json({
                data
            })


        } catch (error) {

        }
        res.status(200);

    }
}