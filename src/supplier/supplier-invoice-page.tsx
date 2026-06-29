import { useMemo, useState } from 'react'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import { workOrderDatabase } from '../local-database.ts'
import { plumbingInventoryDatabase } from './plumbing-inventory-database.ts'

type InvoiceCategory = 'Transport' | 'Equipment' | 'Waste' | 'Utilities'
type InventoryKind = keyof typeof plumbingInventoryDatabase
type InventoryItem = (typeof plumbingInventoryDatabase)[InventoryKind][number]

type InvoiceLineItem = {
  id: string
  category: InvoiceCategory
  inventoryKind: InventoryKind
  inventoryId: string
  itemName: string
  activity: string
  notes: string
  emissionsKgCo2e: number
}

type LineFormState = {
  inventoryId: string
  primaryAmount: string
  secondaryAmount: string
  notes: string
}

const invoiceCategories: InvoiceCategory[] = ['Transport', 'Equipment', 'Waste', 'Utilities']

const invoiceInventoryMap: Record<InvoiceCategory, InventoryKind[]> = {
  Transport: ['vehicles'],
  Equipment: ['equipment'],
  Waste: ['materials', 'goods'],
  Utilities: ['goods'],
}

const categoryPrompts: Record<InvoiceCategory, { primary: string; secondary: string; unit: string }> = {
  Transport: {
    primary: 'Kilometres travelled',
    secondary: 'Kilograms hauled',
    unit: 'km',
  },
  Equipment: {
    primary: 'Hours used',
    secondary: 'Number of uses',
    unit: 'hrs',
  },
  Waste: {
    primary: 'Volume or amount wasted',
    secondary: 'Disposal trips',
    unit: 'units',
  },
  Utilities: {
    primary: 'Amount supplied',
    secondary: 'Service quantity',
    unit: 'units',
  },
}

const emptyLineForm: LineFormState = {
  inventoryId: '',
  primaryAmount: '',
  secondaryAmount: '',
  notes: '',
}

function OrdersDropdown() {
  const [selectedOrder, setSelectedOrder] = useState('')

  const firstFifteenOrders = workOrderDatabase.slice(0, 15)

  return (
    <div>
      <label htmlFor="order-select"><b>Work Order Number</b></label>

      <select
        id="order-select"
        value={selectedOrder}
        onChange={(event) => setSelectedOrder(event.target.value)}
      >
        <option value="">Choose an Order</option>

        {firstFifteenOrders.map((order) => (
          <option key={order.jobNo} value={order.jobNo}>
            {order.jobNo}
          </option>
        ))}
      </select>

      {selectedOrder && (
        <p>
          Selected Order:{' '}
          {workOrderDatabase.find(
            (order) => order.jobNo === selectedOrder
          )?.jobNo}
        </p>
      )}
    </div>
  )
}

function formatInventoryLabel(item: InventoryItem, kind: InventoryKind) {
  const record = item as Record<string, unknown>
  const identifier = typeof record.assetTag === 'string' ? record.assetTag : typeof record.sku === 'string' ? record.sku : item.id
  const make = typeof record.make === 'string' ? record.make : typeof record.supplier === 'string' ? record.supplier : ''
  const model = typeof record.model === 'string' ? record.model : typeof record.gradeOrSpec === 'string' ? record.gradeOrSpec : ''
  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1)

  return [kindLabel, identifier, item.name, make, model].filter(Boolean).join(' | ')
}

function formatFactor(item: InventoryItem) {
  return item.emissionsFactor.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + item.emissionsFactor.unit
}

function parseAmount(value: string) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0
}

function calculateLineEmissions(category: InvoiceCategory, item: InventoryItem, primaryAmount: number) {
  const record = item as Record<string, unknown>

  if (category === 'Transport' && typeof record.fuelUsePer100Km === 'number') {
    return primaryAmount * (record.fuelUsePer100Km / 100) * item.emissionsFactor.value
  }

  if (category === 'Equipment') {
    if (typeof record.fuelUsePerHour === 'number') {
      return primaryAmount * record.fuelUsePerHour * item.emissionsFactor.value
    }

    if (typeof record.electricityUseKwhPerHour === 'number') {
      return primaryAmount * record.electricityUseKwhPerHour * item.emissionsFactor.value
    }
  }

  return primaryAmount * item.emissionsFactor.value
}

function findInventoryItem(category: InvoiceCategory, inventoryId: string) {
  for (const kind of invoiceInventoryMap[category]) {
    const item = plumbingInventoryDatabase[kind].find((entry) => entry.id === inventoryId)

    if (item) {
      return { item, kind }
    }
  }

  return undefined
}

function getActivityText(category: InvoiceCategory, formState: LineFormState) {
  const prompt = categoryPrompts[category]
  const primaryAmount = parseAmount(formState.primaryAmount)
  const secondaryAmount = parseAmount(formState.secondaryAmount)
  const activityParts = [primaryAmount + ' ' + prompt.unit]

  if (secondaryAmount > 0) {
    activityParts.push(prompt.secondary + ': ' + secondaryAmount.toLocaleString())
  }

  return activityParts.join(' | ')
}

function InvoiceLineModal({
  activeCategory,
  formState,
  onChange,
  onClose,
  onSubmit,
}: {
  activeCategory: InvoiceCategory
  formState: LineFormState
  onChange: (nextState: LineFormState) => void
  onClose: () => void
  onSubmit: () => void
}) {
  const selectableItems = useMemo(
    () => invoiceInventoryMap[activeCategory].flatMap((kind) =>
      plumbingInventoryDatabase[kind].map((item) => ({
        kind,
        item,
      })),
    ),
    [activeCategory],
  )
  const selectedItem = selectableItems.find((entry) => entry.item.id === formState.inventoryId)
  const prompt = categoryPrompts[activeCategory]
  const canAddLine = Boolean(selectedItem && parseAmount(formState.primaryAmount) > 0)

  return (
    <div className="invoice-modal-backdrop" role="presentation">
      <section className="invoice-modal" role="dialog" aria-modal="true" aria-labelledby="invoice-modal-title">
        <div className="invoice-modal-header">
          <div>
            <p>{activeCategory}</p>
            <h2 id="invoice-modal-title">Add Invoice Line</h2>
          </div>

          <button className="invoice-modal-close" type="button" aria-label="Close add invoice line modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="invoice-modal-fields">
          <label>
            Inventory item
            <select
              value={formState.inventoryId}
              onChange={(event) => onChange({ ...formState, inventoryId: event.target.value })}
            >
              <option value="">Select inventory item</option>
              {selectableItems.map(({ item, kind }) => (
                <option key={item.id} value={item.id}>
                  {formatInventoryLabel(item, kind)}
                </option>
              ))}
            </select>
          </label>

          {selectedItem ? (
            <div className="invoice-selected-inventory">
              <span>{selectedItem.item.category}</span>
              <strong>{formatFactor(selectedItem.item)}</strong>
            </div>
          ) : null}

          <label>
            {prompt.primary}
            <input
              type="number"
              min="0"
              step="0.01"
              value={formState.primaryAmount}
              onChange={(event) => onChange({ ...formState, primaryAmount: event.target.value })}
            />
          </label>

          <label>
            {prompt.secondary}
            <input
              type="number"
              min="0"
              step="0.01"
              value={formState.secondaryAmount}
              onChange={(event) => onChange({ ...formState, secondaryAmount: event.target.value })}
            />
          </label>

          <label>
            Notes
            <textarea
              value={formState.notes}
              onChange={(event) => onChange({ ...formState, notes: event.target.value })}
              rows={3}
            />
          </label>
        </div>

        <div className="invoice-modal-actions">
          <button className="invoice-modal-add" type="button" disabled={!canAddLine} onClick={onSubmit}>
            Add Line
          </button>
          <button className="invoice-modal-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  )
}

function SupplierInvoicing () {
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])
  const [activeCategory, setActiveCategory] = useState<InvoiceCategory | null>(null)
  const [formState, setFormState] = useState<LineFormState>(emptyLineForm)

  function openLineModal(category: InvoiceCategory) {
    setActiveCategory(category)
    setFormState(emptyLineForm)
  }

  function closeLineModal() {
    setActiveCategory(null)
    setFormState(emptyLineForm)
  }

  function addLineItem() {
    if (!activeCategory) {
      return
    }

    const selectedInventory = findInventoryItem(activeCategory, formState.inventoryId)
    const primaryAmount = parseAmount(formState.primaryAmount)

    if (!selectedInventory || primaryAmount <= 0) {
      return
    }

    const emissionsKgCo2e = calculateLineEmissions(activeCategory, selectedInventory.item, primaryAmount)

    setLineItems((currentItems) => [
      ...currentItems,
      {
        id: activeCategory + '-' + selectedInventory.item.id + '-' + Date.now().toString(),
        category: activeCategory,
        inventoryKind: selectedInventory.kind,
        inventoryId: selectedInventory.item.id,
        itemName: selectedInventory.item.name,
        activity: getActivityText(activeCategory, formState),
        notes: formState.notes.trim(),
        emissionsKgCo2e: Number(emissionsKgCo2e.toFixed(2)),
      },
    ])
    closeLineModal()
  }

  return (
    <main className="supplier-invoice-page">
      <SupplierHeader />
      <div className='select-and-send'>
        <div className='select-dropdown'>
          <OrdersDropdown />
        </div>
        <div className='send-cancel-button'>
          <a className='send-button' href='' >Send</a>
          <a className='cancel-button' href=''>Cancel</a>
        </div>
      </div>
      <div className='invoice-items'>
        {invoiceCategories.map((category) => {
          const categoryLineItems = lineItems.filter((item) => item.category === category)

          return (
            <section className='invoice-category-section' key={category}>
              <h2>{category}</h2>
              <button
                className='invoice-new-button'
                type='button'
                onClick={() => openLineModal(category)}
              >
                + New
              </button>

              {categoryLineItems.length > 0 ? (
                <div className="invoice-line-table-wrap">
                  <table className="invoice-line-table">
                    <caption>{category + ' invoice line items'}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Inventory ID</th>
                        <th scope="col">Activity</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Emissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryLineItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.itemName}</td>
                          <td>{item.inventoryId}</td>
                          <td>{item.activity}</td>
                          <td>{item.notes || '—'}</td>
                          <td>{item.emissionsKgCo2e.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO2e</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          )
        })}
      </div>

      {activeCategory ? (
        <InvoiceLineModal
          activeCategory={activeCategory}
          formState={formState}
          onChange={setFormState}
          onClose={closeLineModal}
          onSubmit={addLineItem}
        />
      ) : null}

      <AppFooter />
    </main>
  )
}

export default SupplierInvoicing
