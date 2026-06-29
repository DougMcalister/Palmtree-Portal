export type EmissionsFactor = {
  value: number
  unit: string
  sourceId: keyof typeof inventoryEmissionsSources
  sourceUrl: string
  notes: string
}

export type InventorySource = {
  name: string
  url: string
  useCase: string
}

export type VehicleInventoryRecord = {
  id: string
  assetTag: string
  name: string
  category: string
  vehicleType: 'Truck' | 'Ute' | 'Car' | 'Van' | 'Specialist'
  make: string
  model: string
  year: number
  fuelType: 'Diesel' | 'Petrol' | 'Hybrid' | 'Electric'
  location: string
  quantity: number
  fuelUsePer100Km?: number
  electricityUseKwhPer100Km?: number
  reduction_factors: string[]
  compliance: string[]
  emissionsFactor: EmissionsFactor
}

export type MaterialInventoryRecord = {
  id: string
  sku: string
  name: string
  category: string
  materialType: 'Metal' | 'Timber' | 'Aggregate' | 'Concrete' | 'Asphalt' | 'Fastener' | 'Plastic'
  gradeOrSpec: string
  supplier: string
  storageLocation: string
  quantityOnHand: number
  quantityUnit: 'kg' | 'm3' | 'tonne' | 'each'
  emissionsFactor: EmissionsFactor
}

export type EquipmentInventoryRecord = {
  id: string
  assetTag: string
  name: string
  category: string
  equipmentType: 'Power Tool' | 'Machinery' | 'Generator' | 'Pump' | 'Grounds Equipment'
  make: string
  model: string
  energySource: 'Electricity' | 'Diesel' | 'Petrol' | 'Battery'
  location: string
  quantity: number
  ratedPowerKw?: number
  fuelUsePerHour?: number
  electricityUseKwhPerHour?: number
  emissionsFactor: EmissionsFactor
}

export type GoodsInventoryRecord = {
  id: string
  sku: string
  name: string
  category: string
  goodsType: 'Stationery' | 'Paper' | 'Foodstuff' | 'Cleaning' | 'Packaging' | 'IT Consumable'
  supplier: string
  storageLocation: string
  quantityOnHand: number
  quantityUnit: 'each' | 'ream' | 'box' | 'kg' | 'litre'
  emissionsFactor: EmissionsFactor
}

export type DashboardInventoryRecord = {
  name: string
  make: string
  model: string
  category: string
}

export const inventoryEmissionsSources = {
  UK_GHG_CONVERSION_FACTORS_2026: {
    name: 'UK Government conversion factors for company greenhouse gas reporting',
    url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
    useCase: 'Activity-based factors for fuels, electricity, material use, waste, and purchased goods screening.',
  },
  EPA_FUEL_REFERENCES: {
    name: 'US EPA Greenhouse Gas Equivalencies Calculator calculations and references',
    url: 'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references',
    useCase: 'Fuel combustion reference factors for petrol and diesel screening estimates.',
  },
  EPIC_OPEN_LCA: {
    name: 'University of Melbourne EPiC Database and Resource Hub',
    url: 'https://msd.unimelb.edu.au/research/impact-agendas/climate-action/environmental-performance-in-construction',
    useCase: 'Open-access life-cycle inventory coefficients for construction materials.',
  },
  EPA_USEEIO: {
    name: 'US EPA USEEIO technical content',
    url: 'https://www.epa.gov/land-research/us-environmentally-extended-input-output-useeio-technical-content',
    useCase: 'Open EEIO/LCA screening data for purchased goods and services where item-specific factors are unavailable.',
  },
} satisfies Record<string, InventorySource>

function factor(
  value: number,
  unit: string,
  sourceId: keyof typeof inventoryEmissionsSources,
  notes: string,
): EmissionsFactor {
  return {
    value,
    unit,
    sourceId,
    sourceUrl: inventoryEmissionsSources[sourceId].url,
    notes,
  }
}

// Synthetic prototype data. Emissions factors are practical screening values from open/public LCA or reporting-factor sources;
// production data should prefer supplier EPDs, local grid/fuel factors, and council-specific procurement records.
export const vehicleInventoryDatabase: VehicleInventoryRecord[] = [
  {
    id: 'VEH-0001',
    assetTag: 'FLT-TRK-014',
    name: 'Tipper Truck',
    category: 'Heavy Vehicle Truck',
    vehicleType: 'Truck',
    make: 'Isuzu',
    model: 'FVR 165-300',
    year: 2022,
    fuelType: 'Diesel',
    location: 'Operations Depot',
    quantity: 1,
    fuelUsePer100Km: 28,
    reduction_factors: [
      'DPD diesel particulate diffuser / diesel particulate filter after-treatment',
      'Urea SCR / AdBlue NOx reduction catalyst',
      'Cooled EGR system',
      'High-pressure common-rail diesel injection',
    ],
    compliance: [
      'Heavy vehicle diesel emissions after-treatment retained',
      'ADR 80/03 or later heavy vehicle emissions compliance basis',
      'DPD/SCR warning and regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
  {
    id: 'VEH-0002',
    assetTag: 'FLT-UTE-037',
    name: 'Parks Utility',
    category: 'Light Vehicle Utility',
    vehicleType: 'Ute',
    make: 'Toyota',
    model: 'Hilux SR',
    year: 2023,
    fuelType: 'Diesel',
    location: 'Parks Yard',
    quantity: 1,
    fuelUsePer100Km: 9.5,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Cooled EGR system',
      'Common-rail direct diesel injection',
      'Variable-nozzle turbocharger with intercooler',
    ],
    compliance: [
      'Light vehicle diesel emissions after-treatment retained',
      'ADR 79/04 or later light vehicle emissions compliance basis',
      'DPF regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
  {
    id: 'VEH-0003',
    assetTag: 'FLT-CAR-022',
    name: 'Community Services Car',
    category: 'Light Vehicle Passenger',
    vehicleType: 'Car',
    make: 'Hyundai',
    model: 'i30 Hybrid',
    year: 2024,
    fuelType: 'Hybrid',
    location: 'Civic Centre',
    quantity: 1,
    fuelUsePer100Km: 4.2,
    reduction_factors: [
      'Hybrid drivetrain with regenerative braking',
      'Three-way catalytic converter',
      'Closed-loop electronic fuel injection',
      'Evaporative emissions control system',
    ],
    compliance: [
      'Light passenger vehicle emissions-control hardware retained',
      'ADR 79/04 or later light vehicle emissions compliance basis',
      'Hybrid high-voltage system compliance retained',
    ],
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor.'),
  },
  {
    id: 'VEH-0004',
    assetTag: 'FLT-VAN-009',
    name: 'Library Delivery Van',
    category: 'Light Commercial Van',
    vehicleType: 'Van',
    make: 'Ford',
    model: 'Transit Custom',
    year: 2021,
    fuelType: 'Diesel',
    location: 'Library Store',
    quantity: 1,
    fuelUsePer100Km: 8.7,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Diesel oxidation catalyst',
      'Cooled EGR system',
      'High-pressure common-rail diesel injection',
    ],
    compliance: [
      'Light commercial diesel emissions after-treatment retained',
      'Euro 5/Euro 6-aligned diesel emissions compliance basis',
      'DPF regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
  {
    id: 'VEH-0005',
    assetTag: 'FLT-EV-004',
    name: 'Parking Inspection EV',
    category: 'Light Vehicle Passenger',
    vehicleType: 'Car',
    make: 'Hyundai',
    model: 'Kona Electric',
    year: 2024,
    fuelType: 'Electric',
    location: 'Civic Centre',
    quantity: 1,
    electricityUseKwhPer100Km: 15.5,
    reduction_factors: [
      'Zero tailpipe emissions electric drivetrain',
      'Regenerative braking',
      'Battery-electric traction system',
      'No onboard combustion exhaust after-treatment required',
    ],
    compliance: [
      'Battery-electric light vehicle compliance basis',
      'High-voltage traction battery safety compliance retained',
      'EV charging inlet and onboard charger compliance retained',
    ],
    emissionsFactor: factor(0.52, 'kg CO2e/kWh electricity consumed', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor; replace with local grid factor where available.'),
  },
  {
    id: 'VEH-0006',
    assetTag: 'FLT-SPC-002',
    name: 'Street Sweeper',
    category: 'Heavy Vehicle Machinery',
    vehicleType: 'Specialist',
    make: 'Hako',
    model: 'Citymaster 1650',
    year: 2020,
    fuelType: 'Diesel',
    location: 'Operations Depot',
    quantity: 1,
    fuelUsePer100Km: 34,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Diesel oxidation catalyst',
      'Cooled EGR system',
      'Hydrostatic drive load-matching system',
    ],
    compliance: [
      'Non-road diesel plant emissions-control hardware retained',
      'EU Stage V / equivalent non-road emissions compliance basis',
      'DPF regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
]

export const materialInventoryDatabase: MaterialInventoryRecord[] = [
  {
    id: 'MAT-0001',
    sku: 'STL-RHS-050',
    name: 'Galvanised Steel RHS',
    category: 'Construction Material Metal',
    materialType: 'Metal',
    gradeOrSpec: '50 x 50 x 3 mm',
    supplier: 'Metro Depot Materials',
    storageLocation: 'Depot Rack A',
    quantityOnHand: 1280,
    quantityUnit: 'kg',
    emissionsFactor: factor(1.85, 'kg CO2e/kg steel', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for steel products.'),
  },
  {
    id: 'MAT-0002',
    sku: 'ALU-SHT-003',
    name: 'Aluminium Sign Sheet',
    category: 'Construction Material Metal',
    materialType: 'Metal',
    gradeOrSpec: '3 mm traffic-grade sheet',
    supplier: 'Civic Sign Supplies',
    storageLocation: 'Sign Shop',
    quantityOnHand: 310,
    quantityUnit: 'kg',
    emissionsFactor: factor(8.14, 'kg CO2e/kg aluminium', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for aluminium.'),
  },
  {
    id: 'MAT-0003',
    sku: 'TMB-HWD-090',
    name: 'Hardwood Bollard Timber',
    category: 'Construction Material Timber',
    materialType: 'Timber',
    gradeOrSpec: 'Class 1 durability dressed hardwood',
    supplier: 'Foreshore Timber Yard',
    storageLocation: 'Depot Timber Bay',
    quantityOnHand: 420,
    quantityUnit: 'kg',
    emissionsFactor: factor(0.18, 'kg CO2e/kg dressed timber', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for processed timber.'),
  },
  {
    id: 'MAT-0004',
    sku: 'PLY-EXT-018',
    name: 'Exterior Plywood',
    category: 'Construction Material Timber',
    materialType: 'Timber',
    gradeOrSpec: '18 mm structural plywood',
    supplier: 'Foreshore Timber Yard',
    storageLocation: 'Depot Timber Bay',
    quantityOnHand: 95,
    quantityUnit: 'each',
    emissionsFactor: factor(0.45, 'kg CO2e/kg plywood', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for engineered timber panel products.'),
  },
  {
    id: 'MAT-0005',
    sku: 'CON-25MPA',
    name: 'Ready Mix Concrete',
    category: 'Construction Material Concrete',
    materialType: 'Concrete',
    gradeOrSpec: '25 MPa general purpose',
    supplier: 'Local Batch Plant',
    storageLocation: 'Ordered as required',
    quantityOnHand: 0,
    quantityUnit: 'm3',
    emissionsFactor: factor(120, 'kg CO2e/m3 concrete', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for normal-strength concrete.'),
  },
  {
    id: 'MAT-0006',
    sku: 'ASP-HMA-010',
    name: 'Hot Mix Asphalt',
    category: 'Construction Material Asphalt',
    materialType: 'Asphalt',
    gradeOrSpec: '10 mm wearing course',
    supplier: 'Suburban Asphalt Plant',
    storageLocation: 'Ordered as required',
    quantityOnHand: 0,
    quantityUnit: 'tonne',
    emissionsFactor: factor(62, 'kg CO2e/tonne asphalt', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for asphalt.'),
  },
  {
    id: 'MAT-0007',
    sku: 'AGG-RCY-020',
    name: 'Recycled Road Base',
    category: 'Construction Material Aggregate',
    materialType: 'Aggregate',
    gradeOrSpec: '20 mm recycled aggregate',
    supplier: 'Resource Recovery Yard',
    storageLocation: 'Bulk Bay 2',
    quantityOnHand: 42,
    quantityUnit: 'tonne',
    emissionsFactor: factor(7, 'kg CO2e/tonne recycled aggregate', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for recycled aggregate.'),
  },
  {
    id: 'MAT-0008',
    sku: 'FST-GAL-M12',
    name: 'Galvanised M12 Fasteners',
    category: 'Hardware Fastener',
    materialType: 'Fastener',
    gradeOrSpec: 'M12 bolt, nut and washer kit',
    supplier: 'Depot Hardware Cooperative',
    storageLocation: 'Fastener Cabinet',
    quantityOnHand: 1800,
    quantityUnit: 'each',
    emissionsFactor: factor(2.05, 'kg CO2e/kg galvanised fasteners', 'EPIC_OPEN_LCA', 'Open LCA screening factor based on steel fastener mass.'),
  },
  {
    id: 'MAT-0009',
    sku: 'PVC-CON-050',
    name: 'PVC Electrical Conduit',
    category: 'Construction Material Plastic',
    materialType: 'Plastic',
    gradeOrSpec: '50 mm heavy duty conduit',
    supplier: 'Electrical Stores Unit',
    storageLocation: 'Electrical Bay',
    quantityOnHand: 220,
    quantityUnit: 'kg',
    emissionsFactor: factor(2.41, 'kg CO2e/kg PVC product', 'UK_GHG_CONVERSION_FACTORS_2026', 'Material-use screening factor for plastic products.'),
  },
]

export const equipmentInventoryDatabase: EquipmentInventoryRecord[] = [
  {
    id: 'EQP-0001',
    assetTag: 'PWT-DRL-044',
    name: 'Cordless Hammer Drill',
    category: 'Power Tool Battery',
    equipmentType: 'Power Tool',
    make: 'Makita',
    model: 'DHP486',
    energySource: 'Battery',
    location: 'Depot Tool Store',
    quantity: 6,
    electricityUseKwhPerHour: 0.42,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for charging battery tools.'),
  },
  {
    id: 'EQP-0002',
    assetTag: 'PWT-SAW-018',
    name: 'Circular Saw',
    category: 'Power Tool Electric',
    equipmentType: 'Power Tool',
    make: 'Makita',
    model: 'HS7600',
    energySource: 'Electricity',
    location: 'Carpentry Store',
    quantity: 3,
    ratedPowerKw: 1.2,
    electricityUseKwhPerHour: 0.72,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh electricity consumed', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for electric tools.'),
  },
  {
    id: 'EQP-0003',
    assetTag: 'GRD-BLW-032',
    name: 'Petrol Leaf Blower',
    category: 'Grounds Equipment Petrol',
    equipmentType: 'Grounds Equipment',
    make: 'Stihl',
    model: 'BG 86',
    energySource: 'Petrol',
    location: 'Parks Yard',
    quantity: 8,
    fuelUsePerHour: 0.55,
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor.'),
  },
  {
    id: 'EQP-0004',
    assetTag: 'GRD-CHN-015',
    name: 'Chainsaw',
    category: 'Grounds Equipment Petrol',
    equipmentType: 'Grounds Equipment',
    make: 'Stihl',
    model: 'MS 261',
    energySource: 'Petrol',
    location: 'Arborist Store',
    quantity: 4,
    fuelUsePerHour: 0.82,
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor.'),
  },
  {
    id: 'EQP-0005',
    assetTag: 'MAC-FRK-003',
    name: 'Diesel Forklift',
    category: 'Heavy Vehicle Machinery',
    equipmentType: 'Machinery',
    make: 'Crown',
    model: 'CDX Series',
    energySource: 'Diesel',
    location: 'Operations Depot',
    quantity: 1,
    fuelUsePerHour: 3.1,
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
  {
    id: 'EQP-0006',
    assetTag: 'GEN-032-006',
    name: 'Portable Generator',
    category: 'Site Equipment Generator',
    equipmentType: 'Generator',
    make: 'Honda',
    model: 'EU32i',
    energySource: 'Petrol',
    location: 'Event Store',
    quantity: 5,
    fuelUsePerHour: 1.6,
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor.'),
  },
  {
    id: 'EQP-0007',
    assetTag: 'PMP-DIE-002',
    name: 'Diesel Trash Pump',
    category: 'Site Equipment Pump',
    equipmentType: 'Pump',
    make: 'Aussie Pumps',
    model: 'QP301T',
    energySource: 'Diesel',
    location: 'Drainage Store',
    quantity: 2,
    fuelUsePerHour: 1.9,
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor.'),
  },
]

export const goodsInventoryDatabase: GoodsInventoryRecord[] = [
  {
    id: 'GDS-0001',
    sku: 'PPR-A4-080',
    name: 'A4 Copy Paper',
    category: 'Office Consumable Paper',
    goodsType: 'Paper',
    supplier: 'Civic Office Supplies',
    storageLocation: 'Stationery Room',
    quantityOnHand: 96,
    quantityUnit: 'ream',
    emissionsFactor: factor(2.6, 'kg CO2e/ream A4 paper', 'UK_GHG_CONVERSION_FACTORS_2026', 'Paper goods screening factor; assumes common 80 gsm office ream.'),
  },
  {
    id: 'GDS-0002',
    sku: 'PEN-BLK-050',
    name: 'Black Ballpoint Pens',
    category: 'Office Consumable Stationery',
    goodsType: 'Stationery',
    supplier: 'Civic Office Supplies',
    storageLocation: 'Stationery Room',
    quantityOnHand: 420,
    quantityUnit: 'each',
    emissionsFactor: factor(0.06, 'kg CO2e/pen', 'EPA_USEEIO', 'Purchased-goods screening factor for plastic stationery items.'),
  },
  {
    id: 'GDS-0003',
    sku: 'TON-MFP-004',
    name: 'MFP Toner Cartridge',
    category: 'IT Consumable Printing',
    goodsType: 'IT Consumable',
    supplier: 'Records Technology Store',
    storageLocation: 'IT Store',
    quantityOnHand: 18,
    quantityUnit: 'each',
    emissionsFactor: factor(5.5, 'kg CO2e/cartridge', 'EPA_USEEIO', 'Purchased-goods screening factor for toner and print consumables.'),
  },
  {
    id: 'GDS-0004',
    sku: 'CLN-GEN-005',
    name: 'General Purpose Cleaner',
    category: 'Facilities Consumable Cleaning',
    goodsType: 'Cleaning',
    supplier: 'Facilities Consumables Unit',
    storageLocation: 'Cleaner Store',
    quantityOnHand: 74,
    quantityUnit: 'litre',
    emissionsFactor: factor(1.8, 'kg CO2e/litre cleaning product', 'EPA_USEEIO', 'Purchased-goods screening factor for cleaning chemicals.'),
  },
  {
    id: 'GDS-0005',
    sku: 'BOX-ARC-010',
    name: 'Archive Boxes',
    category: 'Office Consumable Packaging',
    goodsType: 'Packaging',
    supplier: 'Records Supply Desk',
    storageLocation: 'Records Store',
    quantityOnHand: 240,
    quantityUnit: 'each',
    emissionsFactor: factor(0.42, 'kg CO2e/cardboard box', 'UK_GHG_CONVERSION_FACTORS_2026', 'Paper/cardboard product screening factor.'),
  },
  {
    id: 'GDS-0006',
    sku: 'FOD-COF-001',
    name: 'Ground Coffee',
    category: 'Foodstuff Pantry',
    goodsType: 'Foodstuff',
    supplier: 'Community Kitchen Goods',
    storageLocation: 'Civic Kitchen',
    quantityOnHand: 28,
    quantityUnit: 'kg',
    emissionsFactor: factor(6.2, 'kg CO2e/kg coffee', 'EPA_USEEIO', 'Foodstuff purchased-goods screening factor.'),
  },
  {
    id: 'GDS-0007',
    sku: 'FOD-MIL-002',
    name: 'Long Life Milk',
    category: 'Foodstuff Pantry',
    goodsType: 'Foodstuff',
    supplier: 'Community Kitchen Goods',
    storageLocation: 'Civic Kitchen',
    quantityOnHand: 90,
    quantityUnit: 'litre',
    emissionsFactor: factor(1.3, 'kg CO2e/litre milk', 'EPA_USEEIO', 'Foodstuff purchased-goods screening factor.'),
  },
  {
    id: 'GDS-0008',
    sku: 'FOD-CAT-009',
    name: 'Event Sandwich Platter',
    category: 'Foodstuff Catering',
    goodsType: 'Foodstuff',
    supplier: 'Civic Catering Unit',
    storageLocation: 'Ordered as required',
    quantityOnHand: 0,
    quantityUnit: 'box',
    emissionsFactor: factor(14.5, 'kg CO2e/catering box', 'EPA_USEEIO', 'Food service purchased-goods screening factor.'),
  },
]

export const dashboardInventoryDatabase: DashboardInventoryRecord[] = [
  ...vehicleInventoryDatabase.map((item) => ({
    name: item.name,
    make: item.make,
    model: item.model,
    category: item.category,
  })),
  ...equipmentInventoryDatabase.map((item) => ({
    name: item.name,
    make: item.make,
    model: item.model,
    category: item.category,
  })),
  ...materialInventoryDatabase.slice(0, 6).map((item) => ({
    name: item.name,
    make: item.supplier,
    model: item.gradeOrSpec,
    category: item.category,
  })),
  ...goodsInventoryDatabase.slice(0, 5).map((item) => ({
    name: item.name,
    make: item.supplier,
    model: item.sku,
    category: item.category,
  })),
]

export const completeInventoryDatabase = {
  vehicles: vehicleInventoryDatabase,
  materials: materialInventoryDatabase,
  equipment: equipmentInventoryDatabase,
  goods: goodsInventoryDatabase,
}
