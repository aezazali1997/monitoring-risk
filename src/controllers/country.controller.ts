import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics'
export class CountryController {
    googleAnalytics = new GoogleAnalyticsDataApi();

    constructor() {
        this.get24HourCountriesList = this.get24HourCountriesList.bind(this);
    }

    async get24HourCountriesList(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await this.googleAnalytics.getCountires(startDate, endDate)
            res.status(200).json({

                data
            })
        } catch (error) {
            console.log('Error', error);
        }
    }

}