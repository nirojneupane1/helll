const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Configure Express middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/crud_app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful database connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
});

const User = mongoose.model('User', userSchema);

// Authentication route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and return JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secret-key');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Course schema
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Course = mongoose.model('Course', courseSchema);

// Authorization middleware
function authorize(role) {
  return function(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, 'secret-key');
      if (decoded.role !== role) {
        return res.status(403).json({ error: 'Access denied' });
      }
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// Create a course
app.post('/courses', authorize('teacher'), async (req, res) => {
  const { name } = req.body;
  try {
    const course = await Course.create({ name, createdBy: req.userId });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update a course
app.put('/courses/:id', authorize('teacher'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(id, { name }, { new: true });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete a course
app.delete('/courses/:id', authorize('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});
