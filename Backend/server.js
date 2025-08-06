require('dotenv').config({path: '.env'});
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { error } = require('./middlewares/error');
const { refreshAccessToken } = require('./controllers/userControllers/refreshAccessToken');
const cron = require('node-cron');
const { notifiedUserForDueBooks } = require('./controllers/borrowBookController/notifiedUsersForDueBooks');


app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/books',require('./routes/bookRoutes'));
app.use('/api/refresh-token', refreshAccessToken);

// cron job that will notify users for books due soon
cron.schedule('0 9 * * * *', async () => {
    console.log('Running scheduled task...');
    await notifiedUserForDueBooks();
});

//cron job that will update the file of issued books if any
cron.schedule('0 9 * * * *', async () => {
    console.log('Running scheduled task...');
    // await calculateAndUpdateFine();
})

app.use(error);

async function connectToDatabase(){
    try {
        const client = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => console.log('Server running on port 3000'));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToDatabase();