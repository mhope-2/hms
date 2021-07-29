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


app.listen();
