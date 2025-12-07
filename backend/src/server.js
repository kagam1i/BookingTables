import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import {attachPersonFromCookie} from './middleware/auth.js';
import {errorHandler} from './middleware/errorHandler.js';

const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(attachPersonFromCookie);


app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/', routes);

app.use(errorHandler);

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
