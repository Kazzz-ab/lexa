import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export function withId(data) {
  if (Array.isArray(data)) return data.map(withId);
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      out[k] = withId(v);
    }
    if ('id' in out) out._id = out.id;
    return out;
  }
  return data;
}
