const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const port = process.env.PORT || 3001;
var mongoServer;

function testcoverage(a) {
    console.log(a)
}

function abc() {
    console.log("abc test2")
}

const startServer = async () => {
  await connectToDatabase();
  
  dotenv.config();
  
  app.use(cors());
  app.use(express.json());
  
  
   const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Todo = mongoose.model('Todo', todoSchema);
  
   app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find().sort({ createdAt: -1 });
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });
  
  app.post('/todos', async (req, res) => {
    try {
      const todo = new Todo({ text: req.body.text });
      await todo.save();
      res.status(201).json(todo);
      testcoverage("testcoverage string")
    } catch (err) {
      res.status(400).json({ error: 'Failed to create todo' });
    }
  });
  
  app.put('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
      );
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      res.json(todo);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update todo' });
    }
  });
  
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ error: 'Todo not found' });
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: 'Failed to delete todo' });
    }
  });

  app.delete('/todos', async (req, res) => {
    try {
      const todo = await Todo.deleteMany();
      res.status(204).json(todo);
    } catch (err) {
      res.status(400).json({ error: 'Failed to delete all items', err });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

};

const connectToDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Connected to MongoDB at ${mongoUri}`);
};

startServer();