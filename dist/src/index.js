"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const item_1 = __importDefault(require("./routes/item"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/items', item_1.default);
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
