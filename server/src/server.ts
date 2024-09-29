import 'reflect-metadata';
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { Sequelize } from 'sequelize-typescript';
import { pino } from "pino";
import dotenv from "dotenv";
dotenv.config(); 

import { openAPIRouter } from "./api-docs/openAPIRouter";
import models from "./api/project/models";
import projectRoutes from "./api/project/projectRoutes";
import {healthCheckRouter} from "./api/healthCheck/healthCheckRouter";


const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    // origin: process.env.CORS_ORIGIN, // just commented for test
    credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// MySQL connection using Sequelize
console.log('process.env :>> ', process.env);
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'kanban',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    host: "localhost",
    // host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    models: models
});

sequelize.authenticate()
    .then(() => console.log('MySQL Connected'))
    .catch(err => console.error('Connection error: ', err));

// Request logging
// app.use(requestLogger);

// Routes

// for versioning
app.use("/health-check", healthCheckRouter);
app.use('/api/v1/project', projectRoutes);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
export { app, logger, sequelize };

