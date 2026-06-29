import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import { plumbingInventoryDatabase } from './plumbing-inventory-database.ts'

type InventoryKind = keyof typeof plumbingInventoryDatabase

type InventoryColumn = {
  key: string
  label: string
}

type InventoryRow = Record<string, string>

const inventoryKinds: Array<{ key: InventoryKind; label: string }> = [
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'materials', label: 'Materials' },
  { key: 'goods', label: 'Goods' },
]

const inventoryColumns: Record<InventoryKind, InventoryColumn[]> = {
  vehicles: [
    { key: 'asset', label: 'Asset' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'emissionsFactor', label: 'Emissions Factor' },
  ],
  equipment: [
    { key: 'asset', label: 'Asset' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'emissionsFactor', label: 'Emissions Factor' },
  ],
  materials: [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'emissionsFactor', label: 'Emissions Factor' },
  ],
  goods: [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'emissionsFactor', label: 'Emissions Factor' },
  ],
}

function formatFactor(value: number, unit: string) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + unit
}

const inventoryRows: Record<InventoryKind, InventoryRow[]> = {
  vehicles: plumbingInventoryDatabase.vehicles.map((item) => ({
    id: item.id,
    asset: item.assetTag,
    name: item.name,
    category: item.category,
    location: item.location,
    emissionsFactor: formatFactor(item.emissionsFactor.value, item.emissionsFactor.unit),
  })),
  equipment: plumbingInventoryDatabase.equipment.map((item) => ({
    id: item.id,
    asset: item.assetTag,
    name: item.name,
    category: item.category,
    location: item.location,
    emissionsFactor: formatFactor(item.emissionsFactor.value, item.emissionsFactor.unit),
  })),
  materials: plumbingInventoryDatabase.materials.map((item) => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    category: item.category,
    stock: item.quantityOnHand.toLocaleString() + ' ' + item.quantityUnit,
    emissionsFactor: formatFactor(item.emissionsFactor.value, item.emissionsFactor.unit),
  })),
  goods: plumbingInventoryDatabase.goods.map((item) => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    category: item.category,
    stock: item.quantityOnHand.toLocaleString() + ' ' + item.quantityUnit,
    emissionsFactor: formatFactor(item.emissionsFactor.value, item.emissionsFactor.unit),
  })),
}

function InventoryPage() {
  const [activeInventoryKind, setActiveInventoryKind] = useState<InventoryKind>('equipment')
  const navigate = useNavigate()

  const activeColumns = inventoryColumns[activeInventoryKind]
  const activeItems = inventoryRows[activeInventoryKind]
  const activeLabel = inventoryKinds.find((kind) => kind.key === activeInventoryKind)?.label ?? 'Inventory'

  return (
    <main className="homepage inventory-page" aria-label="Inventory">
      <SupplierHeader />

      <section className="inventory-page-content" aria-label="Inventory list">
        <div className="inventory-toolbar">
          <div className="inventory-tabs" role="tablist" aria-label="Inventory type">
            {inventoryKinds.map((kind) => (
              <button
                key={kind.key}
                className={'inventory-tab ' + (activeInventoryKind === kind.key ? 'is-active' : '')}
                type="button"
                role="tab"
                aria-selected={activeInventoryKind === kind.key}
                onClick={() => setActiveInventoryKind(kind.key)}
              >
                {kind.label}
              </button>
            ))}
          </div>

          <button className="add-entry-button" type="button">
            <span aria-hidden="true">+</span>
            <span>New</span>
          </button>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-page-table">
            <caption>{activeLabel} inventory</caption>
            <thead>
              <tr>
                {activeColumns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeItems.map((item) => {
                const itemPath = '/supplier/inventory-item/' + activeInventoryKind + '/' + item.id

                return (
                  <tr
                    key={item.id}
                    data-entry-row
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(itemPath)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(itemPath)
                      }
                    }}
                  >
                    {activeColumns.map((column) => (
                      <td key={column.key}>{item[column.key]}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AppFooter />
    </main>
  )
}

export default InventoryPage
