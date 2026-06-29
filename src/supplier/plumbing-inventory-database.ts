import type { EmissionsFactor } from '../inventory-database.ts'
import { inventoryEmissionsSources } from '../inventory-database.ts'

type SourceId = keyof typeof inventoryEmissionsSources

export type InventoryUsage = {
  annualUsage: number
  usageUnit: 'km/year' | 'hours/year' | 'uses/year' | 'm/year' | 'each/year' | 'litres/year' | 'bags/year' | 'boxes/year' | 'reams/year' | 'rolls/year'
  emissionsActivityAmount: number
  emissionsActivityUnit: string
  calculatedEmissionsKgCo2e: number
}

export type InventoryRecordWithUsage<T> = T & InventoryUsage

function roundActivity(value: number) {
  return Number(value.toFixed(1))
}

function roundEmissions(value: number) {
  return Number(value.toFixed(2))
}

function factor(value: number, unit: string, sourceId: SourceId, notes: string): EmissionsFactor {
  return {
    value,
    unit,
    sourceId,
    sourceUrl: inventoryEmissionsSources[sourceId].url,
    notes,
  }
}

export type PlumbingVehicleRecord = {
  id: string
  assetTag: string
  name: string
  category: string
  vehicleType: 'Service Van' | 'Utility' | 'Small Truck' | 'Supervisor Car'
  make: string
  model: string
  year: number
  fuelType: 'Diesel' | 'Petrol' | 'Hybrid'
  location: string
  odometerKm: number
  quantity: number
  fuelUsePer100Km: number
  reduction_factors: string[]
  compliance: string[]
  emissionsFactor: EmissionsFactor
}

export type PlumbingEquipmentRecord = {
  id: string
  assetTag: string
  name: string
  category: string
  equipmentType: 'Pipe Tool' | 'Drainage' | 'Testing' | 'Pump' | 'Power Tool' | 'Safety'
  make: string
  model: string
  energySource: 'Battery' | 'Electricity' | 'Petrol' | 'Manual'
  location: string
  quantity: number
  serviceIntervalMonths: number
  electricityUseKwhPerHour?: number
  fuelUsePerHour?: number
  emissionsFactor: EmissionsFactor
}

export type PlumbingMaterialRecord = {
  id: string
  sku: string
  name: string
  category: string
  materialType: 'Copper' | 'PVC' | 'PEX' | 'Brass' | 'Steel' | 'Sealant' | 'Concrete' | 'Rubber'
  gradeOrSpec: string
  supplier: string
  storageLocation: string
  quantityOnHand: number
  quantityUnit: 'm' | 'kg' | 'each' | 'litre' | 'bag'
  emissionsFactor: EmissionsFactor
}

export type PlumbingGoodsRecord = {
  id: string
  sku: string
  name: string
  category: string
  goodsType: 'Office' | 'Cleaning' | 'Packaging' | 'PPE' | 'Consumable'
  supplier: string
  storageLocation: string
  quantityOnHand: number
  quantityUnit: 'each' | 'box' | 'ream' | 'litre' | 'roll'
  emissionsFactor: EmissionsFactor
}

export const plumbingVehicleInventory: PlumbingVehicleRecord[] = [
  {
    id: 'PLV-001',
    assetTag: 'VAN-01',
    name: 'Primary Plumbing Van',
    category: 'Light Commercial Van',
    vehicleType: 'Service Van',
    make: 'TradeMove',
    model: 'LWB 2.0D',
    year: 2022,
    fuelType: 'Diesel',
    location: 'Main Workshop',
    odometerKm: 68420,
    quantity: 1,
    fuelUsePer100Km: 8.9,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Diesel oxidation catalyst',
      'Cooled EGR system',
      'High-pressure common-rail diesel injection',
    ],
    compliance: [
      'Light commercial diesel emissions after-treatment retained',
      'Euro 5/Euro 6-aligned emissions compliance basis',
      'DPF regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor for service vehicle fuel use.'),
  },
  {
    id: 'PLV-002',
    assetTag: 'VAN-02',
    name: 'Maintenance Plumbing Van',
    category: 'Light Commercial Van',
    vehicleType: 'Service Van',
    make: 'TradeMove',
    model: 'MWB 2.0D',
    year: 2021,
    fuelType: 'Diesel',
    location: 'North Yard',
    odometerKm: 81210,
    quantity: 1,
    fuelUsePer100Km: 8.6,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Diesel oxidation catalyst',
      'Cooled EGR system',
      'High-pressure common-rail diesel injection',
    ],
    compliance: [
      'Light commercial diesel emissions after-treatment retained',
      'Euro 5/Euro 6-aligned emissions compliance basis',
      'DPF regeneration system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor for service vehicle fuel use.'),
  },
  {
    id: 'PLV-003',
    assetTag: 'UTE-01',
    name: 'Supervisor Utility',
    category: 'Light Vehicle Utility',
    vehicleType: 'Utility',
    make: 'FieldLine',
    model: 'Dual Cab D4',
    year: 2023,
    fuelType: 'Diesel',
    location: 'Main Workshop',
    odometerKm: 42180,
    quantity: 1,
    fuelUsePer100Km: 9.7,
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
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor for utility fuel use.'),
  },
  {
    id: 'PLV-004',
    assetTag: 'TRK-01',
    name: 'Pipe Delivery Truck',
    category: 'Heavy Vehicle Truck',
    vehicleType: 'Small Truck',
    make: 'DepotHaul',
    model: 'Tray 4500D',
    year: 2020,
    fuelType: 'Diesel',
    location: 'Main Workshop',
    odometerKm: 96340,
    quantity: 1,
    fuelUsePer100Km: 14.8,
    reduction_factors: [
      'Diesel particulate filter after-treatment',
      'Urea SCR / AdBlue NOx reduction catalyst',
      'Cooled EGR system',
      'High-pressure common-rail diesel injection',
    ],
    compliance: [
      'Heavy vehicle diesel emissions after-treatment retained',
      'ADR 80/03 or later heavy vehicle emissions compliance basis',
      'DPF/SCR system retained',
    ],
    emissionsFactor: factor(2.68, 'kg CO2e/litre diesel combusted', 'EPA_FUEL_REFERENCES', 'Diesel combustion screening factor for light truck fuel use.'),
  },
  {
    id: 'PLV-005',
    assetTag: 'CAR-01',
    name: 'Estimator Hybrid Car',
    category: 'Light Vehicle Passenger',
    vehicleType: 'Supervisor Car',
    make: 'CivicFleet',
    model: 'Hybrid Sedan',
    year: 2024,
    fuelType: 'Hybrid',
    location: 'Office',
    odometerKm: 18875,
    quantity: 1,
    fuelUsePer100Km: 4.4,
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
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor for hybrid vehicle fuel use.'),
  },
]

export const plumbingEquipmentInventory: PlumbingEquipmentRecord[] = [
  {
    id: 'PLE-001',
    assetTag: 'DRN-JET-01',
    name: 'Drain Jetting Unit',
    category: 'Plumbing Machinery Drainage',
    equipmentType: 'Drainage',
    make: 'FlowForce',
    model: 'JX300',
    energySource: 'Petrol',
    location: 'VAN-01',
    quantity: 1,
    serviceIntervalMonths: 6,
    fuelUsePerHour: 2.4,
    emissionsFactor: factor(2.31, 'kg CO2e/litre petrol combusted', 'EPA_FUEL_REFERENCES', 'Petrol combustion screening factor for small engine equipment.'),
  },
  {
    id: 'PLE-002',
    assetTag: 'DRN-CAM-01',
    name: 'CCTV Drain Camera',
    category: 'Inspection Equipment',
    equipmentType: 'Drainage',
    make: 'PipeScope',
    model: 'Cam60',
    energySource: 'Battery',
    location: 'VAN-01',
    quantity: 1,
    serviceIntervalMonths: 12,
    electricityUseKwhPerHour: 0.18,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for battery charging.'),
  },
  {
    id: 'PLE-003',
    assetTag: 'PIP-PRE-01',
    name: 'Copper Press Tool',
    category: 'Power Tool Battery',
    equipmentType: 'Pipe Tool',
    make: 'PressPro',
    model: 'P32',
    energySource: 'Battery',
    location: 'VAN-02',
    quantity: 2,
    serviceIntervalMonths: 12,
    electricityUseKwhPerHour: 0.22,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for battery charging.'),
  },
  {
    id: 'PLE-004',
    assetTag: 'PIP-THR-01',
    name: 'Pipe Threader',
    category: 'Workshop Equipment Electric',
    equipmentType: 'Pipe Tool',
    make: 'ThreadLine',
    model: 'T50',
    energySource: 'Electricity',
    location: 'Workshop Tool Bay',
    quantity: 1,
    serviceIntervalMonths: 12,
    electricityUseKwhPerHour: 1.1,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh electricity consumed', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for electric workshop equipment.'),
  },
  {
    id: 'PLE-005',
    assetTag: 'PMP-SUB-01',
    name: 'Submersible Pump',
    category: 'Site Equipment Pump',
    equipmentType: 'Pump',
    make: 'ClearLift',
    model: 'S75',
    energySource: 'Electricity',
    location: 'Workshop Tool Bay',
    quantity: 3,
    serviceIntervalMonths: 6,
    electricityUseKwhPerHour: 0.75,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh electricity consumed', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for electric pump operation.'),
  },
  {
    id: 'PLE-006',
    assetTag: 'TST-BFP-01',
    name: 'Backflow Test Kit',
    category: 'Testing Equipment',
    equipmentType: 'Testing',
    make: 'ValveCheck',
    model: 'BF200',
    energySource: 'Manual',
    location: 'VAN-02',
    quantity: 2,
    serviceIntervalMonths: 12,
    emissionsFactor: factor(0.06, 'kg CO2e/use screening allowance', 'EPA_USEEIO', 'Purchased equipment service-life screening allowance where no direct energy use applies.'),
  },
  {
    id: 'PLE-007',
    assetTag: 'TST-PRE-01',
    name: 'Digital Pressure Tester',
    category: 'Testing Equipment',
    equipmentType: 'Testing',
    make: 'GaugeWorks',
    model: 'DP100',
    energySource: 'Battery',
    location: 'VAN-01',
    quantity: 3,
    serviceIntervalMonths: 12,
    electricityUseKwhPerHour: 0.05,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for battery charging.'),
  },
  {
    id: 'PLE-008',
    assetTag: 'PWT-DRL-01',
    name: 'Cordless Hammer Drill',
    category: 'Power Tool Battery',
    equipmentType: 'Power Tool',
    make: 'TorqueMate',
    model: 'HD18',
    energySource: 'Battery',
    location: 'VAN-01',
    quantity: 4,
    serviceIntervalMonths: 12,
    electricityUseKwhPerHour: 0.35,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for battery charging.'),
  },
  {
    id: 'PLE-009',
    assetTag: 'SAF-GAS-01',
    name: 'Gas Leak Detector',
    category: 'Safety Equipment',
    equipmentType: 'Safety',
    make: 'SafeSense',
    model: 'G4',
    energySource: 'Battery',
    location: 'VAN-02',
    quantity: 3,
    serviceIntervalMonths: 6,
    electricityUseKwhPerHour: 0.03,
    emissionsFactor: factor(0.52, 'kg CO2e/kWh charged', 'UK_GHG_CONVERSION_FACTORS_2026', 'Grid electricity screening factor for battery charging.'),
  },
]

export const plumbingMaterialInventory: PlumbingMaterialRecord[] = [
  {
    id: 'PLM-001',
    sku: 'CU-15-HARD',
    name: 'Copper Tube 15 mm',
    category: 'Plumbing Material Copper',
    materialType: 'Copper',
    gradeOrSpec: 'Hard drawn Type B',
    supplier: 'Harbour Pipe Supply',
    storageLocation: 'Rack A1',
    quantityOnHand: 420,
    quantityUnit: 'm',
    emissionsFactor: factor(4.1, 'kg CO2e/kg copper tube', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for copper products.'),
  },
  {
    id: 'PLM-002',
    sku: 'CU-20-HARD',
    name: 'Copper Tube 20 mm',
    category: 'Plumbing Material Copper',
    materialType: 'Copper',
    gradeOrSpec: 'Hard drawn Type B',
    supplier: 'Harbour Pipe Supply',
    storageLocation: 'Rack A2',
    quantityOnHand: 280,
    quantityUnit: 'm',
    emissionsFactor: factor(4.1, 'kg CO2e/kg copper tube', 'EPIC_OPEN_LCA', 'Open LCA construction-material screening factor for copper products.'),
  },
  {
    id: 'PLM-003',
    sku: 'PVC-DWV-100',
    name: 'PVC DWV Pipe 100 mm',
    category: 'Plumbing Material PVC',
    materialType: 'PVC',
    gradeOrSpec: 'SN6 sewer grade',
    supplier: 'Suburban Plumbing Stores',
    storageLocation: 'Rack B1',
    quantityOnHand: 180,
    quantityUnit: 'm',
    emissionsFactor: factor(2.41, 'kg CO2e/kg PVC product', 'UK_GHG_CONVERSION_FACTORS_2026', 'Plastic product screening factor.'),
  },
  {
    id: 'PLM-004',
    sku: 'PVC-DWV-50',
    name: 'PVC DWV Pipe 50 mm',
    category: 'Plumbing Material PVC',
    materialType: 'PVC',
    gradeOrSpec: 'Sanitary drainage grade',
    supplier: 'Suburban Plumbing Stores',
    storageLocation: 'Rack B2',
    quantityOnHand: 240,
    quantityUnit: 'm',
    emissionsFactor: factor(2.41, 'kg CO2e/kg PVC product', 'UK_GHG_CONVERSION_FACTORS_2026', 'Plastic product screening factor.'),
  },
  {
    id: 'PLM-005',
    sku: 'PEX-16-BLUE',
    name: 'PEX Water Pipe 16 mm',
    category: 'Plumbing Material PEX',
    materialType: 'PEX',
    gradeOrSpec: 'Blue potable water coil',
    supplier: 'Metro Trade Warehouse',
    storageLocation: 'Rack C1',
    quantityOnHand: 520,
    quantityUnit: 'm',
    emissionsFactor: factor(2.9, 'kg CO2e/kg PEX pipe', 'EPA_USEEIO', 'Open EEIO/LCA screening factor for plastic pipe products.'),
  },
  {
    id: 'PLM-006',
    sku: 'PEX-20-RED',
    name: 'PEX Water Pipe 20 mm',
    category: 'Plumbing Material PEX',
    materialType: 'PEX',
    gradeOrSpec: 'Red potable water coil',
    supplier: 'Metro Trade Warehouse',
    storageLocation: 'Rack C2',
    quantityOnHand: 360,
    quantityUnit: 'm',
    emissionsFactor: factor(2.9, 'kg CO2e/kg PEX pipe', 'EPA_USEEIO', 'Open EEIO/LCA screening factor for plastic pipe products.'),
  },
  {
    id: 'PLM-007',
    sku: 'BRS-BALL-20',
    name: 'Brass Ball Valve 20 mm',
    category: 'Plumbing Fitting Brass',
    materialType: 'Brass',
    gradeOrSpec: 'Full bore isolation valve',
    supplier: 'Harbour Pipe Supply',
    storageLocation: 'Bin D4',
    quantityOnHand: 74,
    quantityUnit: 'each',
    emissionsFactor: factor(4.8, 'kg CO2e/kg brass fitting', 'EPIC_OPEN_LCA', 'Open LCA screening factor based on brass/copper alloy material mass.'),
  },
  {
    id: 'PLM-008',
    sku: 'BRS-ELB-15',
    name: 'Brass Elbow 15 mm',
    category: 'Plumbing Fitting Brass',
    materialType: 'Brass',
    gradeOrSpec: 'Compression elbow',
    supplier: 'Harbour Pipe Supply',
    storageLocation: 'Bin D1',
    quantityOnHand: 190,
    quantityUnit: 'each',
    emissionsFactor: factor(4.8, 'kg CO2e/kg brass fitting', 'EPIC_OPEN_LCA', 'Open LCA screening factor based on brass/copper alloy material mass.'),
  },
  {
    id: 'PLM-009',
    sku: 'STL-ROD-M10',
    name: 'Galvanised Threaded Rod',
    category: 'Hardware Fastener',
    materialType: 'Steel',
    gradeOrSpec: 'M10 x 3 m',
    supplier: 'Industrial Fixing Depot',
    storageLocation: 'Rack E1',
    quantityOnHand: 92,
    quantityUnit: 'each',
    emissionsFactor: factor(2.05, 'kg CO2e/kg galvanised steel', 'EPIC_OPEN_LCA', 'Open LCA screening factor for galvanised steel products.'),
  },
  {
    id: 'PLM-010',
    sku: 'RUB-GSK-100',
    name: 'Rubber Pan Connector Seal',
    category: 'Plumbing Fitting Rubber',
    materialType: 'Rubber',
    gradeOrSpec: '100 mm EPDM seal',
    supplier: 'Suburban Plumbing Stores',
    storageLocation: 'Bin F2',
    quantityOnHand: 116,
    quantityUnit: 'each',
    emissionsFactor: factor(3.1, 'kg CO2e/kg rubber product', 'EPA_USEEIO', 'Open EEIO/LCA screening factor for rubber goods.'),
  },
  {
    id: 'PLM-011',
    sku: 'SLT-SIL-WHT',
    name: 'Sanitary Silicone',
    category: 'Plumbing Consumable Sealant',
    materialType: 'Sealant',
    gradeOrSpec: 'White 300 ml cartridge',
    supplier: 'Metro Trade Warehouse',
    storageLocation: 'Chemical Cabinet',
    quantityOnHand: 66,
    quantityUnit: 'each',
    emissionsFactor: factor(2.2, 'kg CO2e/kg sealant', 'EPA_USEEIO', 'Open EEIO/LCA screening factor for adhesives and sealants.'),
  },
  {
    id: 'PLM-012',
    sku: 'CON-RAP-20',
    name: 'Rapid Set Concrete',
    category: 'Construction Material Concrete',
    materialType: 'Concrete',
    gradeOrSpec: '20 kg repair bag',
    supplier: 'Industrial Fixing Depot',
    storageLocation: 'Bulk Shelf',
    quantityOnHand: 38,
    quantityUnit: 'bag',
    emissionsFactor: factor(0.12, 'kg CO2e/kg concrete mix', 'EPIC_OPEN_LCA', 'Open LCA screening factor for cementitious repair material.'),
  },
]

export const plumbingGoodsInventory: PlumbingGoodsRecord[] = [
  {
    id: 'PLG-001',
    sku: 'PPE-GLV-NIT',
    name: 'Nitrile Gloves',
    category: 'PPE Consumable',
    goodsType: 'PPE',
    supplier: 'Workshop Safety Co-op',
    storageLocation: 'PPE Cabinet',
    quantityOnHand: 44,
    quantityUnit: 'box',
    emissionsFactor: factor(3.1, 'kg CO2e/box gloves', 'EPA_USEEIO', 'Purchased-goods screening factor for rubber/PPE consumables.'),
  },
  {
    id: 'PLG-002',
    sku: 'PPE-MSK-P2',
    name: 'P2 Dust Masks',
    category: 'PPE Consumable',
    goodsType: 'PPE',
    supplier: 'Workshop Safety Co-op',
    storageLocation: 'PPE Cabinet',
    quantityOnHand: 18,
    quantityUnit: 'box',
    emissionsFactor: factor(2.4, 'kg CO2e/box masks', 'EPA_USEEIO', 'Purchased-goods screening factor for disposable PPE.'),
  },
  {
    id: 'PLG-003',
    sku: 'CLN-DEG-05',
    name: 'Workshop Degreaser',
    category: 'Facilities Consumable Cleaning',
    goodsType: 'Cleaning',
    supplier: 'Facilities Supply Room',
    storageLocation: 'Chemical Cabinet',
    quantityOnHand: 24,
    quantityUnit: 'litre',
    emissionsFactor: factor(1.8, 'kg CO2e/litre cleaning product', 'EPA_USEEIO', 'Purchased-goods screening factor for cleaning chemicals.'),
  },
  {
    id: 'PLG-004',
    sku: 'PKG-RAG-ROLL',
    name: 'Absorbent Rag Roll',
    category: 'Workshop Consumable',
    goodsType: 'Consumable',
    supplier: 'Facilities Supply Room',
    storageLocation: 'Workshop Bench',
    quantityOnHand: 17,
    quantityUnit: 'roll',
    emissionsFactor: factor(1.1, 'kg CO2e/roll', 'EPA_USEEIO', 'Purchased-goods screening factor for textile wiping products.'),
  },
  {
    id: 'PLG-005',
    sku: 'OFF-A4-REAM',
    name: 'A4 Job Sheet Paper',
    category: 'Office Consumable Paper',
    goodsType: 'Office',
    supplier: 'Back Office Stores',
    storageLocation: 'Office Cupboard',
    quantityOnHand: 22,
    quantityUnit: 'ream',
    emissionsFactor: factor(2.6, 'kg CO2e/ream A4 paper', 'UK_GHG_CONVERSION_FACTORS_2026', 'Paper goods screening factor for 80 gsm office paper.'),
  },
  {
    id: 'PLG-006',
    sku: 'PKG-BIN-LINER',
    name: 'Heavy Duty Bin Liners',
    category: 'Facilities Consumable Packaging',
    goodsType: 'Packaging',
    supplier: 'Facilities Supply Room',
    storageLocation: 'Cleaner Store',
    quantityOnHand: 12,
    quantityUnit: 'box',
    emissionsFactor: factor(4.6, 'kg CO2e/box liners', 'EPA_USEEIO', 'Purchased-goods screening factor for plastic packaging products.'),
  },
]


const vehicleUsageKmById: Record<string, number> = {
  'PLV-001': 18600,
  'PLV-002': 16400,
  'PLV-003': 13800,
  'PLV-004': 9200,
  'PLV-005': 11200,
}

const equipmentUsageById: Record<string, { annualUsage: number; usageUnit: InventoryUsage['usageUnit'] }> = {
  'PLE-001': { annualUsage: 210, usageUnit: 'hours/year' },
  'PLE-002': { annualUsage: 145, usageUnit: 'hours/year' },
  'PLE-003': { annualUsage: 380, usageUnit: 'hours/year' },
  'PLE-004': { annualUsage: 72, usageUnit: 'hours/year' },
  'PLE-005': { annualUsage: 165, usageUnit: 'hours/year' },
  'PLE-006': { annualUsage: 96, usageUnit: 'uses/year' },
  'PLE-007': { annualUsage: 260, usageUnit: 'hours/year' },
  'PLE-008': { annualUsage: 420, usageUnit: 'hours/year' },
  'PLE-009': { annualUsage: 120, usageUnit: 'hours/year' },
}

const materialUsageById: Record<string, { annualUsage: number; usageUnit: InventoryUsage['usageUnit']; emissionsActivityAmount: number; emissionsActivityUnit: string }> = {
  'PLM-001': { annualUsage: 520, usageUnit: 'm/year', emissionsActivityAmount: 142, emissionsActivityUnit: 'kg copper/year' },
  'PLM-002': { annualUsage: 340, usageUnit: 'm/year', emissionsActivityAmount: 134, emissionsActivityUnit: 'kg copper/year' },
  'PLM-003': { annualUsage: 260, usageUnit: 'm/year', emissionsActivityAmount: 312, emissionsActivityUnit: 'kg PVC/year' },
  'PLM-004': { annualUsage: 420, usageUnit: 'm/year', emissionsActivityAmount: 168, emissionsActivityUnit: 'kg PVC/year' },
  'PLM-005': { annualUsage: 740, usageUnit: 'm/year', emissionsActivityAmount: 118, emissionsActivityUnit: 'kg PEX/year' },
  'PLM-006': { annualUsage: 480, usageUnit: 'm/year', emissionsActivityAmount: 106, emissionsActivityUnit: 'kg PEX/year' },
  'PLM-007': { annualUsage: 116, usageUnit: 'each/year', emissionsActivityAmount: 58, emissionsActivityUnit: 'kg brass/year' },
  'PLM-008': { annualUsage: 280, usageUnit: 'each/year', emissionsActivityAmount: 42, emissionsActivityUnit: 'kg brass/year' },
  'PLM-009': { annualUsage: 120, usageUnit: 'each/year', emissionsActivityAmount: 96, emissionsActivityUnit: 'kg galvanised steel/year' },
  'PLM-010': { annualUsage: 210, usageUnit: 'each/year', emissionsActivityAmount: 31.5, emissionsActivityUnit: 'kg rubber/year' },
  'PLM-011': { annualUsage: 180, usageUnit: 'each/year', emissionsActivityAmount: 54, emissionsActivityUnit: 'kg sealant/year' },
  'PLM-012': { annualUsage: 95, usageUnit: 'bags/year', emissionsActivityAmount: 1900, emissionsActivityUnit: 'kg concrete mix/year' },
}

const goodsUsageById: Record<string, { annualUsage: number; usageUnit: InventoryUsage['usageUnit']; emissionsActivityAmount: number; emissionsActivityUnit: string }> = {
  'PLG-001': { annualUsage: 96, usageUnit: 'boxes/year', emissionsActivityAmount: 96, emissionsActivityUnit: 'boxes gloves/year' },
  'PLG-002': { annualUsage: 42, usageUnit: 'boxes/year', emissionsActivityAmount: 42, emissionsActivityUnit: 'boxes masks/year' },
  'PLG-003': { annualUsage: 140, usageUnit: 'litres/year', emissionsActivityAmount: 140, emissionsActivityUnit: 'litres cleaning product/year' },
  'PLG-004': { annualUsage: 38, usageUnit: 'rolls/year', emissionsActivityAmount: 38, emissionsActivityUnit: 'rag rolls/year' },
  'PLG-005': { annualUsage: 64, usageUnit: 'reams/year', emissionsActivityAmount: 64, emissionsActivityUnit: 'reams A4 paper/year' },
  'PLG-006': { annualUsage: 28, usageUnit: 'boxes/year', emissionsActivityAmount: 28, emissionsActivityUnit: 'boxes liners/year' },
}

export const plumbingVehicleInventoryWithUsage: Array<InventoryRecordWithUsage<PlumbingVehicleRecord>> = plumbingVehicleInventory.map((item) => {
  const annualUsage = vehicleUsageKmById[item.id] ?? 0
  const annualFuelLitres = annualUsage * (item.fuelUsePer100Km / 100)

  return {
    ...item,
    annualUsage,
    usageUnit: 'km/year',
    emissionsActivityAmount: roundActivity(annualFuelLitres),
    emissionsActivityUnit: item.fuelType.toLowerCase() + ' litres/year',
    calculatedEmissionsKgCo2e: roundEmissions(annualFuelLitres * item.emissionsFactor.value),
  }
})

export const plumbingEquipmentInventoryWithUsage: Array<InventoryRecordWithUsage<PlumbingEquipmentRecord>> = plumbingEquipmentInventory.map((item) => {
  const usage = equipmentUsageById[item.id] ?? { annualUsage: 0, usageUnit: 'hours/year' }
  const emissionsActivityAmount = item.fuelUsePerHour
    ? usage.annualUsage * item.fuelUsePerHour
    : item.electricityUseKwhPerHour
      ? usage.annualUsage * item.electricityUseKwhPerHour
      : usage.annualUsage
  const emissionsActivityUnit = item.fuelUsePerHour
    ? item.energySource.toLowerCase() + ' litres/year'
    : item.electricityUseKwhPerHour
      ? 'kWh/year'
      : 'uses/year'

  return {
    ...item,
    annualUsage: usage.annualUsage,
    usageUnit: usage.usageUnit,
    emissionsActivityAmount: roundActivity(emissionsActivityAmount),
    emissionsActivityUnit,
    calculatedEmissionsKgCo2e: roundEmissions(emissionsActivityAmount * item.emissionsFactor.value),
  }
})

export const plumbingMaterialInventoryWithUsage: Array<InventoryRecordWithUsage<PlumbingMaterialRecord>> = plumbingMaterialInventory.map((item) => {
  const usage = materialUsageById[item.id] ?? {
    annualUsage: 0,
    usageUnit: item.quantityUnit === 'litre' ? 'litres/year' : item.quantityUnit === 'bag' ? 'bags/year' : item.quantityUnit === 'each' ? 'each/year' : 'm/year',
    emissionsActivityAmount: 0,
    emissionsActivityUnit: item.quantityUnit + '/year',
  }

  return {
    ...item,
    annualUsage: usage.annualUsage,
    usageUnit: usage.usageUnit,
    emissionsActivityAmount: roundActivity(usage.emissionsActivityAmount),
    emissionsActivityUnit: usage.emissionsActivityUnit,
    calculatedEmissionsKgCo2e: roundEmissions(usage.emissionsActivityAmount * item.emissionsFactor.value),
  }
})

export const plumbingGoodsInventoryWithUsage: Array<InventoryRecordWithUsage<PlumbingGoodsRecord>> = plumbingGoodsInventory.map((item) => {
  const usage = goodsUsageById[item.id] ?? {
    annualUsage: 0,
    usageUnit: item.quantityUnit === 'litre' ? 'litres/year' : item.quantityUnit === 'ream' ? 'reams/year' : item.quantityUnit === 'roll' ? 'rolls/year' : item.quantityUnit === 'box' ? 'boxes/year' : 'each/year',
    emissionsActivityAmount: 0,
    emissionsActivityUnit: item.quantityUnit + '/year',
  }

  return {
    ...item,
    annualUsage: usage.annualUsage,
    usageUnit: usage.usageUnit,
    emissionsActivityAmount: roundActivity(usage.emissionsActivityAmount),
    emissionsActivityUnit: usage.emissionsActivityUnit,
    calculatedEmissionsKgCo2e: roundEmissions(usage.emissionsActivityAmount * item.emissionsFactor.value),
  }
})

export const plumbingInventoryDatabase = {
  vehicles: plumbingVehicleInventoryWithUsage,
  equipment: plumbingEquipmentInventoryWithUsage,
  materials: plumbingMaterialInventoryWithUsage,
  goods: plumbingGoodsInventoryWithUsage,
}
