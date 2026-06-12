import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const hash = (p) => bcrypt.hash(p, 12);

const daysAgo     = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(0,0,0,0); return d; };
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0,0,0,0); return d; };
const monthsAgo   = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); d.setDate(10); d.setHours(0,0,0,0); return d; };

async function main() {
  console.log('⚖️   Seeding Lexa...');

  await prisma.auditLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.case.deleteMany();
  await prisma.attorney.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ── USERS ──────────────────────────────────────────────────────────────────
  await             prisma.user.create({ data: { name: 'Admin User',         email: 'admin@lexa.legal',         password: await hash('Admin1234!'),    role: 'admin' } });
  const uAshworth  = await prisma.user.create({ data: { name: 'Margaret Ashworth',  email: 'm.ashworth@lexa.legal',    password: await hash('Attorney1234!'), role: 'attorney' } });
  const uPemberton = await prisma.user.create({ data: { name: 'James Pemberton',    email: 'j.pemberton@lexa.legal',   password: await hash('Attorney1234!'), role: 'attorney' } });
  const uSterling  = await prisma.user.create({ data: { name: 'Alexandra Sterling', email: 'a.sterling@lexa.legal',    password: await hash('Attorney1234!'), role: 'attorney' } });
  const uChang     = await prisma.user.create({ data: { name: 'David Chang',        email: 'd.chang@lexa.legal',       password: await hash('Attorney1234!'), role: 'attorney' } });
  await             prisma.user.create({ data: { name: 'Rosalind Obi',       email: 'r.obi@lexa.legal',         password: await hash('Paralegal123!'), role: 'paralegal' } });
  await             prisma.user.create({ data: { name: 'Theo Martens',       email: 't.martens@lexa.legal',     password: await hash('Paralegal123!'), role: 'paralegal' } });

  // ── ATTORNEYS ──────────────────────────────────────────────────────────────
  const att1 = await prisma.attorney.create({ data: { userId: uAshworth.id,  barNumber: 'BAR-2015-001', practiceAreas: ['Corporate','M&A','Intellectual Property'], hourlyRate: 480, bio: 'Senior partner in cross-border M&A and technology licensing.' } });
  const att2 = await prisma.attorney.create({ data: { userId: uPemberton.id, barNumber: 'BAR-2018-034', practiceAreas: ['Employment','Litigation','Labour'],         hourlyRate: 390, bio: 'Litigation specialist with a strong track record in employment disputes.' } });
  const att3 = await prisma.attorney.create({ data: { userId: uSterling.id,  barNumber: 'BAR-2020-078', practiceAreas: ['Real Estate','Construction','Zoning'],      hourlyRate: 340, bio: 'Real estate attorney handling commercial and residential transactions.' } });
  const att4 = await prisma.attorney.create({ data: { userId: uChang.id,     barNumber: 'BAR-2019-112', practiceAreas: ['Immigration','Administrative','Family'],    hourlyRate: 320, bio: 'Immigration and family law practitioner with 8 years of experience.' } });
  const atts = [att1, att2, att3, att4];

  // ── CLIENTS ────────────────────────────────────────────────────────────────
  const clientDefs = [
    { first:'Harrington',   last:'Sons',          company:'Harrington & Sons Ltd.',   type:'corporate',  email:'legal@harrington.com',     phone:'+1-555-2001', ref:'Bar Association' },
    { first:'Elena',        last:'Vasquez',        company:'',                          type:'individual', email:'elena.v@email.com',        phone:'+1-555-2002', ref:'Referral' },
    { first:'Kofi',         last:'Mensah',         company:'',                          type:'individual', email:'kofi.m@email.com',         phone:'+1-555-2003', ref:'' },
    { first:'TechNova',     last:'Inc',            company:'TechNova Inc.',             type:'corporate',  email:'legal@technova.io',        phone:'+1-555-2004', ref:'Online' },
    { first:'Diana',        last:'Okonkwo',        company:'',                          type:'individual', email:'diana.o@email.com',        phone:'+1-555-2005', ref:'Referral' },
    { first:'Apex',         last:'Ventures',       company:'Apex Ventures LLC',         type:'corporate',  email:'counsel@apexventures.co',  phone:'+1-555-2006', ref:'Chamber of Commerce' },
    { first:'Samir',        last:'Al-Khalidi',     company:'',                          type:'individual', email:'samir.ak@email.com',       phone:'+1-555-2007', ref:'' },
    { first:'Westfield',    last:'Developments',   company:'Westfield Developments',    type:'corporate',  email:'legal@westfielddev.com',   phone:'+1-555-2008', ref:'Bar Association' },
    { first:'Claudette',    last:'Moreau',         company:'',                          type:'individual', email:'c.moreau@email.com',       phone:'+1-555-2009', ref:'Referral' },
    { first:'Nguyen',       last:'Family',         company:'Nguyen Family Trust',       type:'corporate',  email:'trust@nguyen.com',         phone:'+1-555-2010', ref:'' },
    { first:'Benjamin',     last:'Frost',          company:'',                          type:'individual', email:'b.frost@email.com',        phone:'+1-555-2011', ref:'Online' },
    { first:'Meridian',     last:'Retail',         company:'Meridian Retail Group',     type:'corporate',  email:'legal@meridianretail.com', phone:'+1-555-2012', ref:'Bar Association' },
    { first:'Yolanda',      last:'Baptiste',       company:'',                          type:'individual', email:'y.baptiste@email.com',     phone:'+1-555-2013', ref:'Referral' },
    { first:'Orion',        last:'Capital',        company:'Orion Capital Partners',    type:'corporate',  email:'legal@orioncapital.com',   phone:'+1-555-2014', ref:'Bar Association' },
    { first:'Rashid',       last:'Karimov',        company:'',                          type:'individual', email:'r.karimov@email.com',      phone:'+1-555-2015', ref:'' },
  ];

  const clients = [];
  for (const c of clientDefs) {
    const created = await prisma.client.create({
      data: { firstName: c.first, lastName: c.last, company: c.company || null, clientType: c.type, email: c.email, phone: c.phone, referredBy: c.ref || null },
    });
    clients.push(created);
  }
  console.log(`  ✓ ${clients.length} clients`);

  // ── CASES ──────────────────────────────────────────────────────────────────
  const yr = new Date().getFullYear();
  const caseDefs = [
    { num:`LX-${yr}-0001`, title:'Corporate Merger — Series B',          cIdx:0,  aIdx:0, area:'Corporate Law',        type:'corporate',   status:'active',  priority:'high',   mAgo:5, courtDays:null },
    { num:`LX-${yr}-0002`, title:'Wrongful Termination — Reed v. Nexus', cIdx:1,  aIdx:1, area:'Employment Law',       type:'litigation',  status:'active',  priority:'medium', mAgo:5, courtDays:14 },
    { num:`LX-${yr}-0003`, title:'Commercial Real Estate Closing',       cIdx:2,  aIdx:2, area:'Real Estate',          type:'real-estate', status:'closed',  priority:'low',    mAgo:5, courtDays:null },
    { num:`LX-${yr}-0004`, title:'IP Licensing — SaaS Platform',         cIdx:3,  aIdx:0, area:'Intellectual Property',type:'corporate',   status:'active',  priority:'high',   mAgo:4, courtDays:null },
    { num:`LX-${yr}-0005`, title:'Child Custody — Okonkwo',              cIdx:4,  aIdx:3, area:'Family Law',           type:'family',      status:'pending', priority:'urgent', mAgo:4, courtDays:7 },
    { num:`LX-${yr}-0006`, title:'Series A Term Sheet Review',           cIdx:5,  aIdx:0, area:'Corporate Law',        type:'corporate',   status:'active',  priority:'high',   mAgo:4, courtDays:null },
    { num:`LX-${yr}-0007`, title:'Visa & Work Permit Application',       cIdx:6,  aIdx:3, area:'Immigration',          type:'immigration', status:'open',    priority:'medium', mAgo:3, courtDays:null },
    { num:`LX-${yr}-0008`, title:'Construction Dispute — Westfield',     cIdx:7,  aIdx:2, area:'Construction Law',     type:'litigation',  status:'active',  priority:'high',   mAgo:3, courtDays:21 },
    { num:`LX-${yr}-0009`, title:'Divorce Settlement — Moreau',          cIdx:8,  aIdx:3, area:'Family Law',           type:'family',      status:'pending', priority:'medium', mAgo:3, courtDays:null },
    { num:`LX-${yr}-0010`, title:'Trust & Estate Administration',        cIdx:9,  aIdx:0, area:'Estate Planning',      type:'other',       status:'active',  priority:'medium', mAgo:2, courtDays:null },
    { num:`LX-${yr}-0011`, title:'Unfair Dismissal — Frost v. Meridian', cIdx:10, aIdx:1, area:'Employment Law',       type:'litigation',  status:'active',  priority:'medium', mAgo:2, courtDays:30 },
    { num:`LX-${yr}-0012`, title:'Franchise Agreement Review',           cIdx:11, aIdx:0, area:'Corporate Law',        type:'corporate',   status:'open',    priority:'low',    mAgo:2, courtDays:null },
    { num:`LX-${yr}-0013`, title:'Non-compete Enforcement',              cIdx:12, aIdx:1, area:'Employment Law',       type:'litigation',  status:'pending', priority:'medium', mAgo:1, courtDays:10 },
    { num:`LX-${yr}-0014`, title:'Cross-border Acquisition',             cIdx:13, aIdx:0, area:'Corporate Law',        type:'corporate',   status:'active',  priority:'urgent', mAgo:1, courtDays:null },
    { num:`LX-${yr}-0015`, title:'Permanent Residency Application',      cIdx:14, aIdx:3, area:'Immigration',          type:'immigration', status:'open',    priority:'medium', mAgo:1, courtDays:null },
    { num:`LX-${yr}-0016`, title:'Commercial Lease Negotiation',         cIdx:7,  aIdx:2, area:'Real Estate',          type:'real-estate', status:'active',  priority:'low',    mAgo:1, courtDays:null },
    { num:`LX-${yr}-0017`, title:'Data Privacy Compliance Audit',        cIdx:3,  aIdx:0, area:'Technology Law',       type:'corporate',   status:'open',    priority:'medium', mAgo:0, courtDays:null },
    { num:`LX-${yr}-0018`, title:'Employment Contract Review',           cIdx:3,  aIdx:1, area:'Employment Law',       type:'other',       status:'open',    priority:'low',    mAgo:0, courtDays:null },
    { num:`LX-${yr}-0019`, title:'Injunction Application',               cIdx:5,  aIdx:1, area:'Civil Litigation',     type:'litigation',  status:'pending', priority:'urgent', mAgo:0, courtDays:3 },
    { num:`LX-${yr}-0020`, title:'Trademark Registration Filing',        cIdx:13, aIdx:0, area:'Intellectual Property',type:'corporate',   status:'open',    priority:'low',    mAgo:0, courtDays:null },
  ];

  const cases = [];
  for (const c of caseDefs) {
    const openedAt  = monthsAgo(c.mAgo);
    const courtDate = c.courtDays !== null ? daysFromNow(c.courtDays) : null;
    const created = await prisma.case.create({
      data: {
        caseNumber: c.num, title: c.title,
        clientId: clients[c.cIdx].id,
        leadAttorneyId: atts[c.aIdx].id,
        practiceArea: c.area, caseType: c.type,
        status: c.status, priority: c.priority,
        openedAt, courtDate,
        closedAt: c.status === 'closed' ? daysAgo(30) : null,
      },
    });
    cases.push(created);
  }
  console.log(`  ✓ ${cases.length} cases`);

  // ── INVOICES ───────────────────────────────────────────────────────────────
  const invDefs = [
    // 6 months paid — fuels revenue chart
    { cIdx:0,  csIdx:0,  aIdx:0, mAgo:5, billingType:'hourly',   hrs:18, rate:480, desc:'M&A Advisory Services',         status:'paid' },
    { cIdx:1,  csIdx:1,  aIdx:1, mAgo:5, billingType:'hourly',   hrs:10, rate:390, desc:'Litigation Consultation',        status:'paid' },
    { cIdx:2,  csIdx:2,  aIdx:2, mAgo:5, billingType:'flat-fee', fee:3800,          desc:'Real Estate Closing Fee',        status:'paid' },
    { cIdx:3,  csIdx:3,  aIdx:0, mAgo:4, billingType:'hourly',   hrs:14, rate:480, desc:'IP Licensing Drafting',          status:'paid' },
    { cIdx:4,  csIdx:4,  aIdx:3, mAgo:4, billingType:'retainer', fee:5000,          desc:'Family Law Retainer',            status:'paid' },
    { cIdx:5,  csIdx:5,  aIdx:0, mAgo:4, billingType:'hourly',   hrs:8,  rate:480, desc:'Term Sheet Review',              status:'paid' },
    { cIdx:6,  csIdx:6,  aIdx:3, mAgo:3, billingType:'hourly',   hrs:12, rate:320, desc:'Visa Application Preparation',   status:'paid' },
    { cIdx:7,  csIdx:7,  aIdx:2, mAgo:3, billingType:'hourly',   hrs:20, rate:340, desc:'Construction Dispute Analysis',  status:'paid' },
    { cIdx:8,  csIdx:8,  aIdx:3, mAgo:3, billingType:'flat-fee', fee:4200,          desc:'Divorce Mediation',              status:'paid' },
    { cIdx:9,  csIdx:9,  aIdx:0, mAgo:2, billingType:'hourly',   hrs:16, rate:480, desc:'Estate Documentation',           status:'paid' },
    { cIdx:10, csIdx:10, aIdx:1, mAgo:2, billingType:'hourly',   hrs:22, rate:390, desc:'Employment Dispute Hearing',     status:'paid' },
    { cIdx:11, csIdx:11, aIdx:0, mAgo:2, billingType:'flat-fee', fee:6500,          desc:'Franchise Agreement Drafting',   status:'paid' },
    { cIdx:12, csIdx:12, aIdx:1, mAgo:1, billingType:'hourly',   hrs:6,  rate:390, desc:'Non-compete Review',             status:'paid' },
    { cIdx:13, csIdx:13, aIdx:0, mAgo:1, billingType:'hourly',   hrs:28, rate:480, desc:'Acquisition Due Diligence',      status:'paid' },
    { cIdx:14, csIdx:14, aIdx:3, mAgo:1, billingType:'flat-fee', fee:2800,          desc:'PR Application Filing',          status:'paid' },
    { cIdx:0,  csIdx:0,  aIdx:0, mAgo:1, billingType:'hourly',   hrs:24, rate:480, desc:'M&A Negotiation Phase II',       status:'paid' },
    // Current month — various statuses
    { cIdx:3,  csIdx:16, aIdx:0, mAgo:0, billingType:'hourly',   hrs:10, rate:480, desc:'Data Privacy Audit',             status:'sent'    },
    { cIdx:5,  csIdx:18, aIdx:1, mAgo:0, billingType:'flat-fee', fee:8500,          desc:'Injunction Filing',              status:'sent'    },
    { cIdx:7,  csIdx:15, aIdx:2, mAgo:0, billingType:'hourly',   hrs:12, rate:340, desc:'Lease Review & Negotiation',     status:'draft'   },
    { cIdx:13, csIdx:19, aIdx:0, mAgo:0, billingType:'flat-fee', fee:1800,          desc:'Trademark Filing',               status:'draft'   },
    { cIdx:3,  csIdx:17, aIdx:1, mAgo:0, billingType:'hourly',   hrs:4,  rate:390, desc:'Employment Contract Review',     status:'draft'   },
    // Overdue — fires notification bell
    { cIdx:1,  csIdx:1,  aIdx:1, mAgo:0, billingType:'hourly',   hrs:18, rate:390, desc:'Litigation Prep Phase III',      status:'overdue', dOvr:15 },
    { cIdx:4,  csIdx:4,  aIdx:3, mAgo:0, billingType:'retainer', fee:5000,          desc:'Family Retainer Top-up',         status:'overdue', dOvr:8  },
    { cIdx:8,  csIdx:8,  aIdx:3, mAgo:0, billingType:'flat-fee', fee:2200,          desc:'Mediation Continuation',         status:'overdue', dOvr:5  },
    { cIdx:11, csIdx:11, aIdx:0, mAgo:0, billingType:'hourly',   hrs:6,  rate:480, desc:'Franchise Compliance Review',    status:'overdue', dOvr:20 },
  ];

  for (let i = 0; i < invDefs.length; i++) {
    const t = invDefs[i];
    const num    = String(i + 1).padStart(5, '0');
    const amount = t.fee ?? (t.hrs * t.rate);
    const lineItem = t.fee
      ? { description: t.desc, amount: t.fee }
      : { description: t.desc, hours: t.hrs, rate: t.rate, amount };
    const createdAt = t.status === 'overdue' ? daysAgo((t.dOvr || 0) + 30) : monthsAgo(t.mAgo);
    const dueDate   = t.status === 'overdue' ? daysAgo(t.dOvr || 0)        : daysFromNow(30);

    await prisma.invoice.create({
      data: {
        clientId: clients[t.cIdx].id,
        caseId: cases[t.csIdx].id,
        attorneyId: atts[t.aIdx].id,
        invoiceNumber: `INV-LX-${num}`,
        billingType: t.billingType,
        lineItems: [lineItem],
        subtotal: amount, total: amount,
        status: t.status,
        dueDate,
        paidAt: t.status === 'paid' ? createdAt : null,
        createdAt,
      },
    });
  }
  console.log(`  ✓ ${invDefs.length} invoices`);

  console.log('\n✅  Lexa seeded!');
  console.log('──────────────────────────────────────────────────────');
  console.log('  admin@lexa.legal       →  Admin1234!    (admin)');
  console.log('  m.ashworth@lexa.legal  →  Attorney1234! (attorney)');
  console.log('  j.pemberton@lexa.legal →  Attorney1234! (attorney)');
  console.log('  r.obi@lexa.legal       →  Paralegal123! (paralegal)');
  console.log('──────────────────────────────────────────────────────\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
