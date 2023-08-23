import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics';

export class ListController {

    googleAnalytics = new GoogleAnalyticsDataApi();
    constructor() {
        this.ageStats = this.ageStats.bind(this)
        this.getList = this.getList.bind(this)
    }
    getList = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }


        try {
            let data = await this.googleAnalytics.getList(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error) {
            res.status(400).send('Error while fetching data');
        }
    }

    maleVsFemale = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await this.googleAnalytics.maleVsFemale(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error) {
            res.status(400).send('Error while fetching male vs female data');
        }
    }

    ageStats = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await this.googleAnalytics.AgeStats(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error: any) {
            console.log("error", error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}
