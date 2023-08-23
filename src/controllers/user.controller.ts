import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics'
export class UserController {
    googleAnalytics = new GoogleAnalyticsDataApi
    getTotalUsers = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.getTotalUsers(startDate, endDate);
        res.status(200).json({
            data
        })
    }
    usersVsMonth = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.usersVSMonth(startDate, endDate)
        res.status(200).json({
            data
        })
    }
    uniqueVisitors = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.uniqueVisitors(startDate, endDate)
        res.status(200).json({
            data
        })
    }
    uniqueVsReturningVisitors = async (req: Request, res: Response) => {

        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.uniqueVsReturningVisitors(startDate, endDate)
        res.status(200).json({
            data
        })
    }
    last30Minute = async (req: Request, res: Response) => {


        let data = await this.googleAnalytics.last30Minute()
        res.status(200).json({
            data
        })
    }
    getUserInterest = async (req: Request, res: Response) => {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.getUserInterests(startDate, endDate)
        res.status(200).json({
            data
        })
    }


}