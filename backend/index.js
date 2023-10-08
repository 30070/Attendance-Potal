const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MONGODB_URL = 'mongodb://127.0.0.1:27017/SLH';
const cors = require('cors');
const Student = require('./models/mongoose');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database is Connected");
})
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send("Starting the server");
})

app.get('/api/students', async (req, res) => {
  try {
    const sortOptions = 'rollNumber';
    const students = await Student.find().sort(sortOptions);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
})

app.post('/api/students', async (req, res) => {
  try {
    const { name, rollNumber, attendance } = req.body;
    const student = new Student({ name, rollNumber, attendance });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/mark-absent', async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { attendance: -2 } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/present', async (req, res) => {
  try {
    const students = await Student.find();
    for (const student of students) {
      student.attendance += 1;
      await student.save();
    }

    return res.status(200).json({ message: 'Attendance increased for all students' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});



app.listen(8080, () => {
  console.log("Server ready at 8080")
})