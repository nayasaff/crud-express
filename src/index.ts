import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/item';

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

app.use('/items', itemsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

  
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



//Project Idea

// Create two ec2 one to host database using docker one for server and connect server to database
// Use ebs for data backup
// Use owned vpc public subnet private subnet
// Add auto sclaing group and load balancer
// Migrate on premise database to rds
// Look into rds back up
// Look into Elastic beanstalk and reployment and backing server
// Use cloud watch alarm in case termination or high cpu to send sns email
// Terminate an ASG instance → confirm auto-replacement works (Use Ami)
// Use ssm to store env
// Use ci/cd