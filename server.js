import express from 'express';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import './config/db.js';

dotenv.config();

// Routes
import authRouter from './routes/authRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import userRouter from './routes/userRoutes.js';
import swaggerSpec from './config/swagger.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

// middleware
app.use(bodyParser.json());

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api', authRouter);
app.use('/api', taskRouter);
app.use('/api', userRouter);

app.listen(port, () => {
    console.log(
        `Server listening on port ${port} and starting at http://localhost:${port}`
    );
});
