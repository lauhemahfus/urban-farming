import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import specs from './docs/swagger.js';
import allRoutes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';
import logger from './utils/logger.js';

const app = express();
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "validator.swagger.io"],
    },
  },
}));
app.use(cors());

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

app.use(express.json());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Urban Farming API is running'
    })
});

app.use('/api/v1', allRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
})