import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Urban Farming API is running'
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
})