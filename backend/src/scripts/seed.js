import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CounselFlow...');

  await prisma.invoice.deleteMany();
  await prisma.case.deleteMany();
  await prisma.attorney.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const hash = (p) => bcrypt.hash(p, 12);

  const adminUser = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@counselflow.com', password: await hash('Admin1234!'), role: 'admin' } });
  const uAshworth = await prisma.user.create({ data: { name: 'M. Ashworth', email: 'm.ashworth@counselflow.com', password: await hash('Attorney1234!'), role: 'attorney' } });
  const uPemberton = await prisma.user.create({ data: { name: 'J. Pemberton', email: 'j.pemberton@counselflow.com', password: await hash('Attorney1234!'), role: 'attorney' } });
  const uSterling = await prisma.user.create({ data: { name: 'A. Sterling', email: 'a.sterling@counselflow.com', password: await hash('Attorney1234!'), role: 'attorney' } });

  const att1 = await prisma.attorney.create({ data: { userId: uAshworth.id, barNumber: 'BAR-2021-001', practiceAreas: ['Corporate', 'M&A', 'IP'], hourlyRate: 450 } });
  const att2 = await prisma.attorney.create({ data: { userId: uPemberton.id, barNumber: 'BAR-2019-034', practiceAreas: ['Employment', 'Litigation', 'Family'], hourlyRate: 380 } });
  const att3 = await prisma.attorney.create({ data: { userId: uSterling.id, barNumber: 'BAR-2022-078', practiceAreas: ['Real Estate', 'Immigration'], hourlyRate: 320 } });

  const clients = await Promise.all([
    prisma.client.create({ data: { firstName: 'Harrington', lastName: 'Sons', company: 'Harrington & Sons Ltd.', clientType: 'corporate', email: 'legal@harrington.com', phone: '+1-555-2001' } }),
    prisma.client.create({ data: { firstName: 'Elena', lastName: 'Vasquez', clientType: 'individual', email: 'elena.v@email.com', phone: '+1-555-2002' } }),
    prisma.client.create({ data: { firstName: 'Kofi', lastName: 'Mensah', clientType: 'individual', email: 'kofi.m@email.com', phone: '+1-555-2003' } }),
    prisma.client.create({ data: { firstName: 'TechNova', lastName: 'Inc', company: 'TechNova Inc.', clientType: 'corporate', email: 'legal@technova.io', phone: '+1-555-2004' } }),
    prisma.client.create({ data: { firstName: 'Diana', lastName: 'Okonkwo', clientType: 'individual', email: 'diana.o@email.com', phone: '+1-555-2005' } }),
  ]);

  const year = new Date().getFullYear();
  const cases = await Promise.all([
    prisma.case.create({ data: { caseNumber: `CF-${year}-0001`, title: 'Corporate Merger — Series B', clientId: clients[0].id, leadAttorneyId: att1.id, practiceArea: 'Corporate Law', caseType: 'corporate', status: 'active', priority: 'high' } }),
    prisma.case.create({ data: { caseNumber: `CF-${year}-0002`, title: 'Wrongful Termination', clientId: clients[1].id, leadAttorneyId: att2.id, practiceArea: 'Employment Law', caseType: 'litigation', status: 'pending', priority: 'medium' } }),
    prisma.case.create({ data: { caseNumber: `CF-${year}-0003`, title: 'Real Estate Closing', clientId: clients[2].id, leadAttorneyId: att3.id, practiceArea: 'Real Estate', caseType: 'real-estate', status: 'open', priority: 'low' } }),
    prisma.case.create({ data: { caseNumber: `CF-${year}-0004`, title: 'IP Licensing Agreement', clientId: clients[3].id, leadAttorneyId: att1.id, practiceArea: 'Intellectual Property', caseType: 'corporate', status: 'active', priority: 'high' } }),
    prisma.case.create({ data: { caseNumber: `CF-${year}-0005`, title: 'Custody Dispute', clientId: clients[4].id, leadAttorneyId: att2.id, practiceArea: 'Family Law', caseType: 'family', status: 'pending', priority: 'urgent' } }),
  ]);

  await Promise.all([
    prisma.invoice.create({ data: { clientId: clients[0].id, caseId: cases[0].id, attorneyId: att1.id, invoiceNumber: 'INV-CL-00001', billingType: 'hourly', lineItems: [{ description: 'M&A Advisory', hours: 12, rate: 450, amount: 5400 }], subtotal: 5400, total: 5400, status: 'paid', paidAt: new Date(), dueDate: new Date(Date.now() + 7*86400000) } }),
    prisma.invoice.create({ data: { clientId: clients[1].id, caseId: cases[1].id, attorneyId: att2.id, invoiceNumber: 'INV-CL-00002', billingType: 'hourly', lineItems: [{ description: 'Litigation Prep', hours: 8, rate: 380, amount: 3040 }], subtotal: 3040, total: 3040, status: 'sent', dueDate: new Date(Date.now() + 14*86400000) } }),
    prisma.invoice.create({ data: { clientId: clients[2].id, caseId: cases[2].id, attorneyId: att3.id, invoiceNumber: 'INV-CL-00003', billingType: 'flat-fee', lineItems: [{ description: 'Real Estate Closing', amount: 2500 }], subtotal: 2500, total: 2500, status: 'overdue', dueDate: new Date(Date.now() - 10*86400000) } }),
    prisma.invoice.create({ data: { clientId: clients[3].id, caseId: cases[3].id, attorneyId: att1.id, invoiceNumber: 'INV-CL-00004', billingType: 'hourly', lineItems: [{ description: 'IP Licensing Draft', hours: 6, rate: 450, amount: 2700 }], subtotal: 2700, total: 2700, status: 'draft', dueDate: new Date(Date.now() + 30*86400000) } }),
  ]);

  console.log('\nCounselFlow seeded! Login: admin@counselflow.com / Admin1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
