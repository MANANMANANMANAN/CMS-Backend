const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const preRegistrationRoutes = require('./routes/preRegistrationRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const courseRoutes = require("./routes/courseRoutes");
const profCourseReqRoutes = require("./routes/profCourseReqRoutes");



dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/preregistration', preRegistrationRoutes);
app.use('/api/registration', registrationRoutes);
app.use("/api", courseRoutes);
app.use("/api/prof-course-req", profCourseReqRoutes);


app.get('/', (req, res) => {
  res.send('Course Management System Backend Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));