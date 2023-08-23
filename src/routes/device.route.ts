import express from 'express';
import { DeviceController } from '../controllers/device.controller'
const deviceController = new DeviceController();
export const DeviceRouter = express.Router();

DeviceRouter.post('/', deviceController.getMobileDesktopPercentage)