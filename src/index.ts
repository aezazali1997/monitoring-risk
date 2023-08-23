
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { config } from 'dotenv'
config();
import { CountryRouter } from './routes/country.routes'
import { CityRouter } from './routes/city.routes'
import { VisitRouter } from './routes/visit.routes'
import { ListRouter } from './routes/list.routes'
import { DeviceRouter } from './routes/device.route';
import { userRouter } from './routes/user.routes';
class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.startServer();

  }
  private config(): void {
    this.app.use(cors({ origin: process.env.ORIGIN }));
    this.app.use(morgan('combined'));
    this.app.use(helmet());
    this.app.use(express.json());
    const API_BASE_PATH = process.env.API_BASE_PATH
    // list of countries that are visiting in 24 hr

    this.app.use(`${API_BASE_PATH}/country`, CountryRouter)
    // list of cities that are visiting in 24 hr
    this.app.use(`${API_BASE_PATH}/city`, CityRouter)
    // total number of visits from all over the world around 24h
    this.app.use(`${API_BASE_PATH}/visit`, VisitRouter)

    this.app.use(`${API_BASE_PATH}/list`, ListRouter)

    this.app.use(`${API_BASE_PATH}/device`, DeviceRouter)

    this.app.use(`${API_BASE_PATH}/user`, userRouter)
  }

  public routes(): void {
    this.app.get('/', (req: Request, res: Response) => {

      res.send('Welcome to Backend');
    });

  }

  private startServer() {
    console.log('Initializing App...');
    try {
      const PORT = process.env.PORT
      this.app.listen(PORT);
      console.log(`App is listening on ${PORT}`);
    } catch (error: any) {
      console.log('Error while initializing app', error.message);
    }
  }
}
const startApp = () => {
  new App();
};
startApp();
