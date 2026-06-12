// Lexa brand tokens and UI copy.
export const brand = {
  name: 'Lexa',
  tagline: 'Practice intelligence for law firms',
  // Tailwind color tokens (must exist in tailwind.config.js)
  primary: 'violet',
  accent: 'purple',
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
