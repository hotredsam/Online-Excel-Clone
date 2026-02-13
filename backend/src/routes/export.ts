import { FastifyInstance } from 'fastify';
import { exportToXlsx, exportToCsv } from '../services/exportService.js';
import { readProject } from '../services/fileService.js';

export async function exportRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      projectId?: string;
      format: 'xlsx' | 'csv';
      sheet?: { name: string; data: (string | number | null)[][] };
    };
  }>('/api/export', async (request, reply) => {
    const { projectId, format, sheet: sheetBody } = request.body;
    let sheetName: string;
    let data: (string | number | null)[][];

    if (projectId) {
      const project = await readProject(projectId);
      const first = project.sheets[0];
      if (!first) {
        return reply.code(400).send({ error: 'Project has no sheets' });
      }
      sheetName = first.name;
      data = first.data;
    } else if (sheetBody?.name != null && Array.isArray(sheetBody.data)) {
      sheetName = sheetBody.name;
      data = sheetBody.data;
    } else {
      return reply.code(400).send({
        error: 'Provide projectId or sheet: { name, data }',
      });
    }

    const safeName = (sheetName || 'Sheet1').replace(/[^\w\s-]/g, '').trim() || 'Sheet1';

    if (format === 'xlsx') {
      const buffer = exportToXlsx(sheetName, data);
      const filename = `${safeName}.xlsx`;
      return reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(buffer);
    }

    if (format === 'csv') {
      const csv = exportToCsv(data);
      const filename = `${safeName}.csv`;
      return reply
        .header('Content-Type', 'text/csv; charset=utf-8')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(csv);
    }

    return reply.code(400).send({ error: 'format must be xlsx or csv' });
  });
}
