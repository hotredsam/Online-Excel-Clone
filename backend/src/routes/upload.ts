import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import {
  parseCsv,
  parseXlsxOrXls,
  isCsvFilename,
  isXlsxFilename,
  isXlsFilename,
} from '../services/importService.js';
import { writeProject } from '../services/fileService.js';

export async function uploadRoutes(fastify: FastifyInstance) {
  await fastify.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });

  fastify.post('/api/upload', async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    const buffer = await data.toBuffer();
    const filename = data.filename || 'file';
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, path.extname(filename));

    let sheetData: (string | number | null)[][];
    if (isCsvFilename(filename)) {
      sheetData = parseCsv(buffer);
    } else if (isXlsxFilename(filename) || isXlsFilename(filename)) {
      sheetData = parseXlsxOrXls(buffer);
    } else {
      return reply.code(400).send({
        error: 'Unsupported format. Use .csv, .xlsx, or .xls',
      });
    }

    const projectId = randomUUID();
    const project = {
      id: projectId,
      name: baseName,
      sheets: [{ name: 'Sheet1', data: sheetData }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await writeProject(project);

    return reply.code(201).send({
      project: { id: project.id, name: project.name },
      sheet: { name: 'Sheet1', data: sheetData },
    });
  });
}
