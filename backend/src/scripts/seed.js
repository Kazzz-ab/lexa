import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Attorney from '../models/Attorney.js';
import Case from '../models/Case.js';
import Invoice from '../models/Invoice.js';

const CLIENTS_DATA = [
  { firstName: 'Harrington', lastName: 'Sons Ltd.', email: 'legal@harrington.com', phone: '+1-212-555-0201', company: 'Harrington & Sons Ltd.', clientType: 'corporate' },
  { firstName: 'Elena', lastName: 'Vasquez', email: 'elena.v@personal.com', phone: '+1-212-555-0202', clientType: 'individual' },
  { firstName: 'Kofi', lastName: 'Mensah', email: 'k.mensah@email.com', phone: '+1-212-555-0203', clientType: 'individual' },
  { firstName: 'TechNova', lastName: 'Inc.', email: 'legal@technova.io', phone: '+1-212-555-0204', company: 'TechNova Inc.', clientType: 'corporate' },
  { firstName: 'Diana', lastName: 'Okonkwo', email: 'd.okonkwo@email.com', phone: '+1-212-555-0205', clientType: 'individual' },
  { firstName: 'Sterling', lastName: 'Capital LLC', email: 'counsel@sterlingcap.com', phone: '+1-212-555-0206', company: 'Sterling Capital LLC', clientType: 'corporate' },
];

const ATTORNEYS_DATA = [
  { name: 'M. Ashworth', email: 'm.ashworth@counselflow.io', barNumber: 'BAR-NY-00441', practiceAreas: ['Corporate Law', 'M&A', 'IP Licensing'], hourlyRate: 450 },
  { name: 'J. Pemberton', email: 'j.pemberton@counselflow.io', barNumber: 'BAR-NY-00892', practiceAreas: ['Civil Litigation', 'Family Law', 'Employment'], hourlyRate: 380 },
  { name: 'A. Sterling', email: 'a.sterling@counselflow.io', barNumber: 'BAR-NY-01134', practiceAreas: ['Real Estate', 'Contract Law'], hourlyRate: 320 },
];

async function seed() {
  await connectDB();
  console.log('Clearing existing data…');
  await Promise.all([User.deleteMany({}), Client.deleteMany({}), Attorney.deleteMany({}), Case.deleteMany({}), Invoice.deleteMany({})]);

  // Admin
  const admin = await User.create({ name: 'Managing Partner', email: 'admin@counselflow.io', password: 'Admin123!', role: 'admin' });
  console.log('Admin: admin@counselflow.io / Admin123!');

  // Attorneys
  const attorneys = [];
  for (const a of ATTORNEYS_DATA) {
    const user = await User.create({ name: a.name, email: a.email, password: 'Attorney123!', role: 'attorney' });
    const att = await Attorney.create({ user: user._id, barNumber: a.barNumber, practiceAreas: a.practiceAreas, hourlyRate: a.hourlyRate });
    attorneys.push(att);
  }
  console.log(`Created ${attorneys.length} attorneys`);

  // Clients
  const clients = await Client.insertMany(CLIENTS_DATA);
  console.log(`Created ${clients.length} clients`);

  // Cases
  const casesData = [
    { title: 'Corporate Merger — Series B', client: clients[0]._id, leadAttorney: attorneys[0]._id, practiceArea: 'Corporate Law', caseType: 'corporate', status: 'active', priority: 'high' },
    { title: 'Wrongful Termination', client: clients[1]._id, leadAttorney: attorneys[1]._id, practiceArea: 'Employment Law', caseType: 'litigation', status: 'pending', priority: 'medium' },
    { title: 'Real Estate Closing — 5th Ave', client: clients[2]._id, leadAttorney: attorneys[2]._id, practiceArea: 'Real Estate', caseType: 'real-estate', status: 'open', priority: 'low' },
    { title: 'IP Licensing Agreement', client: clients[3]._id, leadAttorney: attorneys[0]._id, practiceArea: 'Intellectual Property', caseType: 'corporate', status: 'active', priority: 'high' },
    { title: 'Child Custody Proceedings', client: clients[4]._id, leadAttorney: attorneys[1]._id, practiceArea: 'Family Law', caseType: 'family', status: 'pending', priority: 'urgent' },
    { title: 'Investment Fund Compliance', client: clients[5]._id, leadAttorney: attorneys[0]._id, practiceArea: 'Securities Law', caseType: 'corporate', status: 'active', priority: 'medium' },
  ];
  for (let i = 0; i < casesData.length; i++) {
    casesData[i].caseNumber = `CF-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
  }
  const cases = await Case.insertMany(casesData);
  console.log(`Created ${cases.length} cases`);

  // Invoices
  const today = new Date();
  const invData = [];
  for (let i = 0; i < 5; i++) {
    const hours = (i + 2) * 8;
    const rate = attorneys[i % attorneys.length].hourlyRate;
    const subtotal = hours * rate;
    invData.push({
      client: clients[i]._id,
      case: cases[i]._id,
      attorney: attorneys[i % attorneys.length]._id,
      invoiceNumber: `INV-CL-${String(i + 1).padStart(5, '0')}`,
      billingType: 'hourly',
      lineItems: [{ description: 'Legal Services', hours, rate, amount: subtotal }],
      subtotal,
      tax: 0,
      total: subtotal,
      status: ['paid', 'sent', 'overdue', 'draft', 'sent'][i],
      dueDate: new Date(today.getTime() + (i - 1) * 14 * 86400000),
    });
  }
  await Invoice.insertMany(invData);
  console.log(`Created ${invData.length} invoices`);

  console.log('\n✓ CounselFlow seeded successfully');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
