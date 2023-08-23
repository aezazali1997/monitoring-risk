import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics'

export class VisitController {

    googleAnalytics = new GoogleAnalyticsDataApi();


    get24HourVisitList = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.getWebsiteViews(startDate, endDate);
        return res.status(200).json({
            data
        })
    }
    getAverageEngagementTime = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.averageEngagementTime(startDate, endDate);
        return res.status(200).json({
            data
        })
    }
    top3MostViewed = async (req: Request, res: Response) => {

        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.getMostViewedPages(startDate, endDate);
        return res.status(200).json({
            data
        })



    }
    getVisitorsDetails = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let totalViews = await this.googleAnalytics.getWebsiteViews(startDate, endDate);
        let averageEngagementTime = await this.googleAnalytics.averageEngagementTime(startDate, endDate);
        let uniqueVisitors = await this.googleAnalytics.uniqueVisitors(startDate, endDate)
        res.status(200).json({
            totalViews,
            averageEngagementTimeInMiliSeconds: averageEngagementTime,
            uniqueVisitors
        })

    }

}