import { MongoClient } from 'mongodb';
import { TaskProps } from '../src/domain/models/task.props';

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('image_processing');
    const tasksCollection = db.collection<TaskProps>('tasks');

    await tasksCollection.deleteMany({});

    const now = new Date();

    const tasks: TaskProps[] = [
      {
        id: 'task1',
        originalPath: 'input/sample1.jpg',
        status: 'pending',
        price: 15.5,
        createdAt: now,
        updatedAt: now,
        images: [],
      },
      {
        id: 'task2',
        originalPath: 'input/sample2.jpg',
        status: 'completed',
        price: 20.0,
        createdAt: now,
        updatedAt: now,
        images: [
          { resolution: '1024', path: '/output/sample2/1024/abc123.jpg' },
          { resolution: '800', path: '/output/sample2/800/def456.jpg' },
        ],
      },
      {
        id: 'task3',
        originalPath: 'input/sample3.jpg',
        status: 'failed',
        price: 10.0,
        createdAt: now,
        updatedAt: now,
        images: [],
      },
    ];

    const result = await tasksCollection.insertMany(tasks);
    console.log(`Inserted ${result.insertedCount} tasks.`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error('Unhandled error in seed:', error);
});
