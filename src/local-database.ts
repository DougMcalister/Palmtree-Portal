import { dashboardInventoryDatabase } from './inventory-database.ts'

export type EmissionCategory = {
  name: 'Transport' | 'Equipment' | 'Waste' | 'Utilities'
  contribution: number
  color: string
}

export type MonthlyEmission = {
  month: string
  kilograms: number
}

export type SupplierRecord = {
  id: string
  name: string
  category:
    | 'Trade Services'
    | 'Civil and Construction'
    | 'Consulting'
    | 'Waste'
    | 'F&B Service'
    | 'Trade Goods'
    | 'Stationary'
    | 'F&B Goods'
    | 'Other'
  description: string
  rating: number
}

export type WorkOrder = {
  jobNo: string
  supplier_id: string
  client: string
  category:
    | 'Trade Services'
    | 'Civil/Construction'
    | 'Consulting'
    | 'Waste'
    | 'F&B Service'
    | 'Other'
  description: string
  due: string
  emissions: number // kg CO2-e per AUD
  transport_comp: number
  equipment_comp: number
  waste_comp: number
  utility_comp: number
}

export type PurchaseOrder = {
  orderNo: string
  supplier_id: string
  category: 'Trade Goods' | 'Stationary' | 'F&B Goods' | 'Other'
  description: string
  due: string
  emissions: number // kg CO2-e per AUD
}

export type InventoryRecord = {
  name: string
  make: string
  model: string
  category: string
}

type SupplierCategory = SupplierRecord['category']
type WorkOrderCategory = WorkOrder['category']
type PurchaseOrderCategory = PurchaseOrder['category']

type SupplierProfile = {
  category: SupplierCategory
  count: number
  services: string[]
  suffixes: string[]
  descriptions: string[]
  ratingBase: number
}

const supplierDescriptors = [
  'Aster',
  'Banksia',
  'Cedar',
  'Dune',
  'Eucalypt',
  'Foreshore',
  'Gardenia',
  'Harbourline',
  'Ironbark',
  'Jarrah',
  'Karrak',
  'Lakeside',
  'Mallee',
  'Northgate',
  'Paperbark',
  'Quarryview',
  'Riverside',
  'Saltbush',
  'Tuart',
  'Urbanfield',
]

const supplierProfiles: SupplierProfile[] = [
  {
    category: 'Trade Services',
    count: 16,
    services: ['Facilities Maintenance', 'Electrical Response', 'Plumbing Works', 'Building Repairs', 'Irrigation Services'],
    suffixes: ['Crew', 'Workshop', 'Service Unit'],
    descriptions: ['Reactive building maintenance', 'Public facility repairs', 'Minor works and service calls'],
    ratingBase: 71,
  },
  {
    category: 'Civil and Construction',
    count: 14,
    services: ['Road Renewal', 'Kerb Works', 'Drainage Delivery', 'Footpath Upgrade', 'Depot Construction'],
    suffixes: ['Works Team', 'Project Group', 'Field Services'],
    descriptions: ['Roads and drainage delivery', 'Footpath and kerb renewal', 'Civil works and minor construction'],
    ratingBase: 68,
  },
  {
    category: 'Consulting',
    count: 12,
    services: ['Planning Advisory', 'Asset Review', 'Traffic Studies', 'Environment Reporting', 'Community Research'],
    suffixes: ['Advisory', 'Consulting Desk', 'Review Office'],
    descriptions: ['Technical advisory services', 'Planning and reporting support', 'Project scoping and assessment'],
    ratingBase: 75,
  },
  {
    category: 'Waste',
    count: 12,
    services: ['Resource Recovery', 'Hard Waste', 'Green Waste', 'Street Bin', 'Transfer Station'],
    suffixes: ['Services', 'Operations', 'Recovery Unit'],
    descriptions: ['Waste handling and recovery', 'Public place waste services', 'Collection and transfer support'],
    ratingBase: 66,
  },
  {
    category: 'F&B Service',
    count: 8,
    services: ['Civic Catering', 'Event Refreshment', 'Community Hall Catering', 'Depot Meal Service'],
    suffixes: ['Kitchen', 'Service Team', 'Catering Unit'],
    descriptions: ['Catering for civic events', 'Refreshment and event service', 'Community venue food service'],
    ratingBase: 70,
  },
  {
    category: 'Trade Goods',
    count: 14,
    services: ['Hardware Supply', 'Depot Materials', 'Safety Equipment', 'Parks Tools', 'Fleet Parts'],
    suffixes: ['Supply Co-op', 'Goods Store', 'Procurement Unit'],
    descriptions: ['Hardware and depot goods', 'Operational equipment supply', 'Tools, parts and safety goods'],
    ratingBase: 69,
  },
  {
    category: 'Stationary',
    count: 8,
    services: ['Office Paper', 'Records Supply', 'Civic Stationery', 'Print Consumables'],
    suffixes: ['Supply Desk', 'Office Goods', 'Stationery Unit'],
    descriptions: ['Office stationery supply', 'Records and print consumables', 'Civic administration goods'],
    ratingBase: 73,
  },
  {
    category: 'F&B Goods',
    count: 8,
    services: ['Pantry Supply', 'Event Produce', 'Refreshment Goods', 'Community Kitchen Goods'],
    suffixes: ['Supply Desk', 'Goods Unit', 'Provisioners'],
    descriptions: ['Food and beverage goods', 'Event and venue provisions', 'Pantry and refreshment supply'],
    ratingBase: 67,
  },
  {
    category: 'Other',
    count: 8,
    services: ['Civic Support', 'Records Handling', 'Venue Support', 'Public Program Support'],
    suffixes: ['Services', 'Support Office', 'Operations Desk'],
    descriptions: ['General municipal support', 'Civic program assistance', 'Venue and administration support'],
    ratingBase: 65,
  },
]

const municipalDepartments = [
  'Roads and Infrastructure',
  'Parks and Reserves',
  'Fleet Services',
  'Community Facilities',
  'Waste and Recovery',
  'Libraries and Learning',
  'Planning Services',
  'Civic Events',
  'Environmental Health',
  'Depot Operations',
  'Asset Management',
  'Community Safety',
]

const workOrderDescriptions: Record<WorkOrderCategory, string[]> = {
  'Trade Services': [
    'Repair public facility fixtures',
    'Complete scheduled building maintenance',
    'Replace damaged park lighting',
    'Service irrigation control cabinet',
  ],
  'Civil/Construction': [
    'Renew local access road surface',
    'Install drainage pit and pipework',
    'Upgrade footpath crossing',
    'Repair kerb and verge edge',
  ],
  Consulting: [
    'Prepare asset condition review',
    'Complete traffic management assessment',
    'Draft environmental compliance report',
    'Review project delivery scope',
  ],
  Waste: [
    'Collect dumped waste from reserve',
    'Service public place bin enclosures',
    'Transport green waste from depot',
    'Process transfer station materials',
  ],
  'F&B Service': [
    'Provide catering for council workshop',
    'Service community event refreshment station',
    'Prepare venue meal service',
    'Support civic function catering',
  ],
  Other: [
    'Support public program delivery',
    'Prepare records transfer service',
    'Coordinate venue setup works',
    'Complete general operational support',
  ],
}

const purchaseDescriptions: Record<PurchaseOrderCategory, string[]> = {
  'Trade Goods': [
    'Depot hardware and fittings',
    'Safety equipment replenishment',
    'Parks maintenance tool supplies',
    'Fleet workshop replacement parts',
  ],
  Stationary: [
    'Office stationery restock',
    'Records storage supplies',
    'Printer and counter consumables',
    'Meeting room paper goods',
  ],
  'F&B Goods': [
    'Community event refreshment goods',
    'Depot pantry replenishment',
    'Venue kitchen consumables',
    'Civic function provisions',
  ],
  Other: [
    'Program support materials',
    'Venue administration supplies',
    'Civic service consumables',
    'General operational goods',
  ],
}

const workOrderCategoryMap: Record<SupplierCategory, WorkOrderCategory> = {
  'Trade Services': 'Trade Services',
  'Civil and Construction': 'Civil/Construction',
  Consulting: 'Consulting',
  Waste: 'Waste',
  'F&B Service': 'F&B Service',
  'Trade Goods': 'Other',
  Stationary: 'Other',
  'F&B Goods': 'Other',
  Other: 'Other',
}

const purchaseCategoryMap: Record<SupplierCategory, PurchaseOrderCategory> = {
  'Trade Services': 'Other',
  'Civil and Construction': 'Other',
  Consulting: 'Other',
  Waste: 'Other',
  'F&B Service': 'F&B Goods',
  'Trade Goods': 'Trade Goods',
  Stationary: 'Stationary',
  'F&B Goods': 'F&B Goods',
  Other: 'Other',
}

// Synthetic local database for the prototype. Monthly values are inferred from the supplied line graph.
export const emissionsDatabase = {
  monthlyEmissions: [
    { month: 'Jan', kilograms: 38200 },
    { month: 'Feb', kilograms: 29500 },
    { month: 'Mar', kilograms: 31400 },
    { month: 'Apr', kilograms: 33200 },
    { month: 'May', kilograms: 26800 },
    { month: 'Jun', kilograms: 22400 },
    { month: 'Jul', kilograms: 18000 },
    { month: 'Aug', kilograms: 19300 },
    { month: 'Sep', kilograms: 18000 },
    { month: 'Oct', kilograms: 20100 },
    { month: 'Nov', kilograms: 17000 },
    { month: 'Dec', kilograms: 18100 },
  ] satisfies MonthlyEmission[],
  categoryContributions: [
    { name: 'Transport', contribution: 39.86, color: '#287e22' },
    { name: 'Equipment', contribution: 18.35, color: '#aaf194' },
    { name: 'Waste', contribution: 32.67, color: '#00bf05' },
    { name: 'Utilities', contribution: 9.12, color: '#48e800' },
  ] satisfies EmissionCategory[],
}

export const inventoryDatabase: InventoryRecord[] = dashboardInventoryDatabase

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function formatDateFromOffset(startYear: number, startMonthIndex: number, dayOffset: number) {
  return new Date(Date.UTC(startYear, startMonthIndex, 1 + dayOffset)).toISOString().slice(0, 10)
}

function formatDateSplitAroundCutoff(index: number, totalRecords: number) {
  const half = totalRecords / 2

  if (index < half) {
    return formatDateFromOffset(2026, 5, index % 28)
  }

  return formatDateFromOffset(2026, 5, 29 + ((index - half) % 214))
}

function createSuppliers() {
  let sequence = 0

  return supplierProfiles.flatMap((profile) =>
    Array.from({ length: profile.count }, (_, profileIndex) => {
      const descriptor = supplierDescriptors[sequence % supplierDescriptors.length]
      const service = profile.services[profileIndex % profile.services.length]
      const suffix = profile.suffixes[(profileIndex + sequence) % profile.suffixes.length]
      const ratingVariance = ((sequence * 7) % 23) / 2

      sequence += 1

      return {
        id: 'SUP' + String(1026300 + sequence).padStart(7, '0'),
        name: descriptor + ' ' + service + ' ' + suffix,
        category: profile.category,
        description: profile.descriptions[profileIndex % profile.descriptions.length],
        rating: roundToTwo(Math.min(98.5, profile.ratingBase + ratingVariance)),
      } satisfies SupplierRecord
    }),
  )
}

function createWorkOrders(suppliers: SupplierRecord[]) {
  const workOrderSuppliers = suppliers.filter((supplier) =>
    ['Trade Services', 'Civil and Construction', 'Consulting', 'Waste', 'F&B Service', 'Other'].includes(supplier.category),
  )

  return Array.from({ length: 400 }, (_, index) => {
    const supplier = workOrderSuppliers[index % workOrderSuppliers.length]
    const category = workOrderCategoryMap[supplier.category]
    const emissions = roundToTwo(0.72 + ((index * 19) % 330) / 100 + (category === 'Civil/Construction' ? 0.85 : 0))

    return {
      jobNo: 'MC' + String(262000 + index + 1),
      supplier_id: supplier.id,
      client: municipalDepartments[index % municipalDepartments.length],
      category,
      description: workOrderDescriptions[category][index % workOrderDescriptions[category].length],
      due: formatDateSplitAroundCutoff(index, 400),
      emissions,
      transport_comp: roundToTwo(emissions * 0.3986),
      equipment_comp: roundToTwo(emissions * 0.1835),
      waste_comp: roundToTwo(emissions * 0.3267),
      utility_comp: roundToTwo(emissions * 0.0912),
    } satisfies WorkOrder
  })
}

function createPurchaseOrders(suppliers: SupplierRecord[]) {
  const purchaseSuppliers = suppliers.filter((supplier) =>
    ['Trade Goods', 'Stationary', 'F&B Goods', 'Other', 'F&B Service'].includes(supplier.category),
  )

  return Array.from({ length: 200 }, (_, index) => {
    const supplier = purchaseSuppliers[(index * 3) % purchaseSuppliers.length]
    const category = purchaseCategoryMap[supplier.category]

    return {
      orderNo: 'PO' + String(2680000 + index + 1),
      supplier_id: supplier.id,
      category,
      description: purchaseDescriptions[category][index % purchaseDescriptions[category].length],
      due: formatDateSplitAroundCutoff(index, 200),
      emissions: roundToTwo(0.18 + ((index * 11) % 170) / 100 + (category === 'Trade Goods' ? 0.42 : 0)),
    } satisfies PurchaseOrder
  })
}

function validateSupplierReferences(
  suppliers: SupplierRecord[],
  workOrders: WorkOrder[],
  purchaseOrders: PurchaseOrder[],
) {
  const supplierIds = new Set(suppliers.map((supplier) => supplier.id))
  const missingWorkOrderReferences = workOrders.filter((order) => !supplierIds.has(order.supplier_id))
  const missingPurchaseOrderReferences = purchaseOrders.filter((order) => !supplierIds.has(order.supplier_id))

  if (missingWorkOrderReferences.length > 0 || missingPurchaseOrderReferences.length > 0) {
    throw new Error('Local database contains work or purchase orders with unknown supplier ids.')
  }
}

function hasEnteredEmissions(value: number) {
  return Number.isFinite(value) && value > 0
}

function validateEmissionsForOrdersBeforeCutoff(
  workOrders: WorkOrder[],
  purchaseOrders: PurchaseOrder[],
) {
  const cutoffDate = '2026-06-29'
  const workOrdersMissingEmissions = workOrders.filter(
    (order) => order.due < cutoffDate && !hasEnteredEmissions(order.emissions),
  )
  const purchaseOrdersMissingEmissions = purchaseOrders.filter(
    (order) => order.due < cutoffDate && !hasEnteredEmissions(order.emissions),
  )

  if (workOrdersMissingEmissions.length > 0 || purchaseOrdersMissingEmissions.length > 0) {
    throw new Error('Local database contains orders before 2026-06-29 without emissions data.')
  }
}

export const supplierDatabase: SupplierRecord[] = createSuppliers()
export const workOrderDatabase: WorkOrder[] = createWorkOrders(supplierDatabase)
export const workOrdersDatabase = workOrderDatabase
export const purchaseOrderDatabase: PurchaseOrder[] = createPurchaseOrders(supplierDatabase)

validateSupplierReferences(supplierDatabase, workOrderDatabase, purchaseOrderDatabase)
validateEmissionsForOrdersBeforeCutoff(workOrderDatabase, purchaseOrderDatabase)
