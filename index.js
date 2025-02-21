require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb'); 

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2a8vu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db('TaskFlow').collection('users');
    const tasksCollection = client.db('TaskFlow').collection('tasks');

    // Save user in DB
    app.post('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = req.body;

      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }

      const result = await usersCollection.insertOne({
        ...user,
        timestamp: new Date(),
      });
      res.send(result);
    });

    // Save task
    app.post('/tasks', async (req, res) => {
      try {
          const task = req.body;  
          const result = await tasksCollection.insertOne({
              ...task,
              createdAt: new Date(),
          });
  
          res.status(201).send(result);
      } catch (error) {
          console.error("Error saving task:", error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    app.post('/tasks/update', async (req, res) => {
      try {
        const { taskId, updatedTask } = req.body;
    
        // Ensure that taskId and updatedTask are provided in the request
        if (!taskId || !updatedTask) {
          return res.status(400).json({ message: 'Task ID and updated task data are required' });
        }
    
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(taskId) }, // Find task by ID
          {
            $set: {
              ...updatedTask,             // Update the task fields
              updatedAt: new Date(),      // Track the update time
            },
          }
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Task not found or no changes made' });
        }
    
        res.status(200).json({ message: 'Task updated successfully', result });
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
    

    // Get all tasks
    app.get('/tasks', async (req, res) => {
      try {
          const tasks = await tasksCollection.find().toArray();
          res.status(200).json(tasks);
      } catch (error) {
          console.error("Error fetching tasks:", error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Get tasks by email
    app.get('/tasks/:email', async (req, res) => {
      try {
          const userEmail = req.params.email;
          const tasks = await tasksCollection.find({ email: userEmail }).toArray();

          res.status(200).json(tasks);
      } catch (error) {
          console.error("Error fetching tasks:", error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Get only "To-Do" tasks by email
    app.get('/tasks/todo/:email', async (req, res) => {
      try {
          const userEmail = req.params.email;
          const tasks = await tasksCollection.find({ email: userEmail, category: "To-Do" }).toArray();

          res.status(200).json(tasks);
      } catch (error) {
          console.error("Error fetching To-Do tasks:", error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    });


    // Delete task by id
    app.delete('/tasks/:id', async (req, res) => {
      try {
        const taskId = req.params.id;
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
      } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('task management server is running..');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
