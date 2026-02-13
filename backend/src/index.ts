import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ensureProjectsDir } from './services/fileService.js';
import { uploadRoutes } from './routes/upload.js';
import { projectRoutes } from './routes/projects.js';
import { exportRoutes } from './routes/export.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true,
});

fastify.get('/api/health', async () => {
  return { ok: true };
});

await fastify.register(uploadRoutes);
await fastify.register(projectRoutes);
await fastify.register(exportRoutes);

await ensureProjectsDir();

const port = Number(process.env.PORT) || 3001;
try {
  await fastify.listen({ port, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
