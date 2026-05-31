// All UI copy and brand tokens live here.
// Swap this file to repurpose the codebase for any vertical.
export const brand = {
  name: 'CounselFlow',
  tagline: 'Modern law firm management',
  // Tailwind color tokens (must exist in tailwind.config.js)
  primary: 'indigo',
  accent: 'amber',
};

export const copy = {
  // Primary entity
  entity: { singular: 'Client', plural: 'Clients' },
  // Provider entity
  provider: { singular: 'Attorney', plural: 'Attorneys' },
  // Work unit
  workUnit: { singular: 'Case', plural: 'Cases' },
  // Billing
  billing: { singular: 'Invoice', plural: 'Invoices' },
  // Nav labels
  nav: {
    dashboard: 'Dashboard',
    entities: 'Clients',
    providers: 'Attorneys',
    workUnits: 'Cases',
    billing: 'Billing',
    settings: 'Settings',
  },
  // Status labels for work units
  statuses: ['open', 'active', 'pending', 'closed', 'on-hold'],
  // Provider specialization label
  specializationLabel: 'Practice Area',
  // Provider license label
  licenseLabel: 'Bar No.',
  // Provider rate label
  rateLabel: 'Hourly Rate',
};
