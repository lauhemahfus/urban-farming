import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import specs from './docs/swagger.js';
import allRoutes from './routes/index.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
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
    console.log(`Server is running on port ${PORT}`);
    
})