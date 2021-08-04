import *  as dotenv from 'dotenv'
import validateEnv from './utils/validateEnv'
import AuthenticationController from './controllers/authentication.controller'
import App from './app'

import RoomsController from './controllers/rooms.controller'
import RoomResourcesController from './controllers/roomResources.controller'
import BookingsController from './controllers/bookings.controller'
import RolesController from './controllers/roles.controller'
import AdminController from './controllers/admin.controller'

// get env variables
dotenv.config({
  path:'./src/config/.env'
});

// validate env variables
validateEnv();

// instantiate app class
const app = new App(
  [
    new AuthenticationController(),
    new RoomsController(),
    new RoomResourcesController(),
    new BookingsController(),
    new RolesController(),
    new AdminController()
  ],
);


app.listen();
