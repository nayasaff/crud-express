import express from 'express';
import cors from 'cors';
import { loadEnvFromParameterStore } from './config'; 

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Hello</title></head>
      <body><h1>Hello World</h1></body>
    </html>
  `);
});   

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    // 1. Load parameters from AWS SSM into process.env before routes/db initialize

      await loadEnvFromParameterStore('/production/');
 

    // 2. Import routes/controllers AFTER process.env is populated
    const itemsRouter = (await import('./routes/item')).default;
    app.use('/items', itemsRouter);

    const PORT = Number(process.env.PORT) || 4000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();



//Project Idea

// Migrate on premise database to rds
// Look into rds back up
// Look into Elastic beanstalk and reployment and backing server
// Use cloud watch alarm in case termination or high cpu to send sns email
// Use ssm to store env and add database to launch template
// Use ci/cd