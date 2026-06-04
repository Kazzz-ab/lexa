import prisma from '../lib/prisma.js';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const ACTION_MAP = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };

function extractResource(url) {
  const match = url.match(/^\/api\/([^/?]+)/);
  return match ? match[1] : 'unknown';
}

function extractResourceId(url) {
  const parts = url.split('?')[0].split('/').filter(Boolean);
  return parts.length >= 3 ? parts[2] : null;
}

export function auditLog(req, res, next) {
  if (!WRITE_METHODS.has(req.method)) return next();

  const originalJson = res.json.bind(res);
  res.json = function (body) {
    const status = res.statusCode;
    if (status < 400 && req.user) {
      const resource = extractResource(req.originalUrl || req.url);
      const resourceId = extractResourceId(req.originalUrl || req.url);
      const action = ACTION_MAP[req.method];
      const ip = req.ip || req.socket?.remoteAddress || null;

      let details = null;
      if (req.method !== 'DELETE' && req.body && typeof req.body === 'object') {
        const { password, description, notes, documents, resetToken, ...safeBody } = req.body;
        details = safeBody;
      }

      prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userEmail: req.user.email,
          action,
          resource,
          resourceId,
          details,
          ip,
        },
      }).catch(() => {});
    }
    return originalJson(body);
  };

  next();
}
