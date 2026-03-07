import { closeWorkers } from './workers/register-workers.js';
import { prisma } from './config/prisma.js';

console.log('AuthorPilot worker started');

const shutdown = async () => {
  await closeWorkers();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
