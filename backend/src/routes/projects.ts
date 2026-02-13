import { FastifyInstance } from 'fastify';
import {
  readProject,
  writeProject,
  listProjects,
  deleteProject,
} from '../services/fileService.js';

export async function projectRoutes(fastify: FastifyInstance) {
  fastify.get('/api/projects', async (_request, reply) => {
    const projects = await listProjects();
    return reply.send({ projects });
  });

  fastify.get<{ Params: { id: string } }>('/api/projects/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const project = await readProject(id);
      return reply.send(project);
    } catch (err) {
      return reply.code(404).send({ error: 'Project not found' });
    }
  });

  fastify.put<{
    Params: { id: string };
    Body: { name?: string; sheets: { name: string; data: (string | number | null)[][] }[] };
  }>('/api/projects/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, sheets } = request.body;
    if (!sheets || !Array.isArray(sheets)) {
      return reply.code(400).send({ error: 'sheets array required' });
    }
    try {
      const existing = await readProject(id);
      const updated = {
        ...existing,
        name: name ?? existing.name,
        sheets,
      };
      await writeProject(updated);
      return reply.send({ ok: true });
    } catch (err) {
      return reply.code(404).send({ error: 'Project not found' });
    }
  });

  fastify.patch<{
    Params: { id: string };
    Body: { name: string };
  }>('/api/projects/:id', async (request, reply) => {
    const { id } = request.params;
    const { name } = request.body;
    if (typeof name !== 'string' || !name.trim()) {
      return reply.code(400).send({ error: 'name string required' });
    }
    try {
      const existing = await readProject(id);
      await writeProject({ ...existing, name: name.trim() });
      return reply.send({ ok: true });
    } catch (err) {
      return reply.code(404).send({ error: 'Project not found' });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/api/projects/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      await deleteProject(id);
      return reply.send({ ok: true });
    } catch (err) {
      return reply.code(404).send({ error: 'Project not found' });
    }
  });
}
