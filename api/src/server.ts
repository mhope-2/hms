import *  as dotenv from 'dotenv'
import validateEnv from './utils/validateEnv'
import PostController from './controllers/post.controller'
import AuthenticationController from './controllers/authentication.controller'
const multer = require("multer")
const path = require("path")
import * as express from 'express';
import App from './app'

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
    new PostController()
  ],
);

const storage = multer.diskStorage({
  destination: "./public/",
  filename: (req: express.Request, file, cb : any) => {
     cb(null + path.extname(file.originalname) + "_" + Date.now() );
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
}).single("uploads");


app.listen();
