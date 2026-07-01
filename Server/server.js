const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { setServers } = require('node:dns/promises');
setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        methods: ['GET','POST','PUT','DELETE'],
        credentials: true
    }
});

app.set('io', io);

const socketHandler = require('./socket/socketHandler');
socketHandler(io);

app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to Mongodb Atlas!'))
    .catch((error) => console.log('Database connection is failed:', error));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req,res) => {
    res.send('TaskManager is working!');
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});