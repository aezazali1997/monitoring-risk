import { Request, Response } from 'express';
import { SQLService } from '../services/sql';

export class SqlController {
    sqlService: SQLService
    constructor() {
        this.sqlService = SQLService.init();
    }


    getIPs = async (req: Request, res: Response) => {
        const { pageSize, pageNumber, startDate, endDate } = req.body


        try {
            let data = await this.sqlService.getAllIP(pageNumber, pageSize, new Date(startDate), new Date(endDate));
            return res.status(200).json({ data })

        } catch (error) {
            res.status(400).send('Error while fetching data');
        }
    }
    bestAudio = async (req: Request, res: Response) => {
        try {
            let data = await this.sqlService.bestAudio()
            res.status(200).json({
                ...data
            })

        } catch (error) {
            res.status(400).send('Error while fetchong data')
        }

    }
    bestArticle = async (req: Request, res: Response) => {
        try {
            let data = await this.sqlService.bestArticle()
            res.status(200).json({
                ...data
            })

        } catch (error) {
            res.status(400).send('Error while fetchong data')
        }

    }
    getAllContent = async (req: Request, res: Response) => {
        const { startDate, endDate, type } = req.body
        try {
            let data = await this.sqlService.getAllContent(startDate, endDate, type);
            res.status(200).json({
                data
            })
        } catch (error) {
            console.log(error)
        }

    }

}
