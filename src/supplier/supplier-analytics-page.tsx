import { useMemo } from 'react'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import {
  purchaseOrderDatabase,
  supplierDatabase,
  workOrderDatabase,
  type PurchaseOrder,
  type WorkOrder,
} from '../local-database.ts'

const demoSupplierId = 'SUP1026393'
const emissionsDisplayMultiplier = 1250

type SupplierOrderRow = {
  id: string
  type: 'Work Order' | 'Purchase Order'
  category: string
  description: string
  due: string
  emissions: number
}

type EmissionCategoryTotal = {
  label: string
  value: number
  color: string
}

const reductionMethods = [
  {
    method: 'Portable Solar',
    scope: 'Temporary worksite power for pumps, testing gear, and battery charging',
    annualOffsetKg: 320,
  },
  {
    method: 'Metals Recycling Scheme',
    scope: 'Copper, brass, and steel offcuts recovered from maintenance jobs',
    annualOffsetKg: 540,
  },
  {
    method: 'Battery Solar Power',
    scope: 'Workshop battery storage charged from rooftop solar',
    annualOffsetKg: 890,
  },
]

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function formatEmissions(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' kg CO2-e'
}

function getFinancialYearOrders(workOrders: WorkOrder[], purchaseOrders: PurchaseOrder[]) {
  const financialYearStart = '2025-07-01'
  const financialYearEnd = '2026-06-30'

  return {
    workOrders: workOrders.filter((order) => order.due >= financialYearStart && order.due <= financialYearEnd),
    purchaseOrders: purchaseOrders.filter((order) => order.due >= financialYearStart && order.due <= financialYearEnd),
  }
}

function createOrderRows(workOrders: WorkOrder[], purchaseOrders: PurchaseOrder[]): SupplierOrderRow[] {
  const workRows = workOrders.map((order) => ({
    id: order.jobNo,
    type: 'Work Order' as const,
    category: order.category,
    description: order.description,
    due: order.due,
    emissions: roundToTwo(order.emissions * emissionsDisplayMultiplier),
  }))
  const purchaseRows = purchaseOrders.map((order) => ({
    id: order.orderNo,
    type: 'Purchase Order' as const,
    category: order.category,
    description: order.description,
    due: order.due,
    emissions: roundToTwo(order.emissions * emissionsDisplayMultiplier),
  }))

  return [...workRows, ...purchaseRows].sort((firstOrder, secondOrder) => firstOrder.due.localeCompare(secondOrder.due))
}

function createCategoryTotals(workOrders: WorkOrder[], purchaseOrders: PurchaseOrder[]): EmissionCategoryTotal[] {
  const purchaseOrderTotal = purchaseOrders.reduce((total, order) => total + order.emissions, 0) * emissionsDisplayMultiplier

  return [
    {
      label: 'Transport',
      value: roundToTwo(workOrders.reduce((total, order) => total + order.transport_comp, 0) * emissionsDisplayMultiplier),
      color: '#1b5e20',
    },
    {
      label: 'Equipment',
      value: roundToTwo(workOrders.reduce((total, order) => total + order.equipment_comp, 0) * emissionsDisplayMultiplier),
      color: '#66bb6a',
    },
    {
      label: 'Waste',
      value: roundToTwo(workOrders.reduce((total, order) => total + order.waste_comp, 0) * emissionsDisplayMultiplier),
      color: '#00897b',
    },
    {
      label: 'Utilities',
      value: roundToTwo(workOrders.reduce((total, order) => total + order.utility_comp, 0) * emissionsDisplayMultiplier),
      color: '#a5d6a7',
    },
    {
      label: 'Purchase Orders',
      value: roundToTwo(purchaseOrderTotal),
      color: '#245c4e',
    },
  ]
}

function EmissionsBarChart({ categoryTotals }: { categoryTotals: EmissionCategoryTotal[] }) {
  const maxValue = Math.max(1, ...categoryTotals.map((category) => category.value))

  return (
    <article className="supplier-analytics-card supplier-emissions-bar-card" aria-label="Supplier categorical emissions">
      <div className="supplier-analytics-card-header">
        <h3>Categorical Emissions</h3>
        <span>FY25-26</span>
      </div>

      <div className="supplier-bar-chart" role="img" aria-label="Supplier categorical emissions bar chart">
        {categoryTotals.map((category) => (
          <div className="supplier-bar-row" key={category.label}>
            <span>{category.label}</span>
            <div className="supplier-bar-track">
              <span
                className="supplier-bar-fill"
                style={{
                  width: Math.max(6, (category.value / maxValue) * 100) + '%',
                  backgroundColor: category.color,
                }}
              />
            </div>
            <strong>{formatEmissions(category.value)}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function SupplierAnalyticsPage() {
  const supplier = supplierDatabase.find((record) => record.id === demoSupplierId) ?? supplierDatabase[0]

  const supplierWorkOrders = useMemo(
    () => workOrderDatabase.filter((order) => order.supplier_id === supplier.id),
    [supplier.id],
  )
  const supplierPurchaseOrders = useMemo(
    () => purchaseOrderDatabase.filter((order) => order.supplier_id === supplier.id),
    [supplier.id],
  )
  const financialYearOrders = useMemo(
    () => getFinancialYearOrders(supplierWorkOrders, supplierPurchaseOrders),
    [supplierWorkOrders, supplierPurchaseOrders],
  )
  const currentOrderRows = useMemo(
    () => createOrderRows(supplierWorkOrders, supplierPurchaseOrders),
    [supplierWorkOrders, supplierPurchaseOrders],
  )
  const categoryTotals = useMemo(
    () => createCategoryTotals(financialYearOrders.workOrders, financialYearOrders.purchaseOrders),
    [financialYearOrders],
  )
  const annualEmissions = categoryTotals.reduce((total, category) => total + category.value, 0)
  const annualOffsets = reductionMethods.reduce((total, method) => total + method.annualOffsetKg, 0)

  return (
    <main className="homepage supplier-analytics-page" aria-label="Supplier analytics">
      <SupplierHeader />

      <section className="supplier-analytics-hero" aria-labelledby="supplier-analytics-page-title">
        <div>
          <p>{supplier.id}</p>
          <h1 id="supplier-analytics-page-title">{supplier.name}</h1>
          <span>{supplier.category}</span>
        </div>

        <dl className="supplier-analytics-summary" aria-label="Supplier annual emissions summary">
          <div>
            <dt>FY Emissions</dt>
            <dd>{formatEmissions(annualEmissions)}</dd>
          </div>
          <div>
            <dt>Total Offsets</dt>
            <dd>{formatEmissions(annualOffsets)}</dd>
          </div>
          <div>
            <dt>Open Orders</dt>
            <dd>{currentOrderRows.length}</dd>
          </div>
        </dl>
      </section>

      <section className="supplier-analytics-layout" aria-label="Supplier emissions analytics">
        <div className="supplier-analytics-main-column">
          <EmissionsBarChart categoryTotals={categoryTotals} />

          <article className="supplier-analytics-card supplier-breakdown-card">
            <div className="supplier-analytics-card-header">
              <h3>Category Breakdown</h3>
              <span>kg CO2-e</span>
            </div>

            <table className="supplier-analytics-table supplier-breakdown-table">
              <caption>Supplier categorical emissions breakdown</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Emissions</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>
                {categoryTotals.map((category) => (
                  <tr key={category.label}>
                    <td>{category.label}</td>
                    <td>{formatEmissions(category.value)}</td>
                    <td>{annualEmissions > 0 ? ((category.value / annualEmissions) * 100).toFixed(1) : '0.0'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>

        <div className="supplier-analytics-side-column">
          <article className="supplier-analytics-card supplier-offset-card">
            <div className="supplier-analytics-card-header">
              <h3>Reduction Methods</h3>
              <span>Synthetic offsets</span>
            </div>

            <table className="supplier-analytics-table supplier-offset-table">
              <caption>Supplier emission reduction methods and offsets</caption>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Total Offset</th>
                </tr>
              </thead>
              <tbody>
                {reductionMethods.map((method) => (
                  <tr key={method.method}>
                    <td>
                      <strong>{method.method}</strong>
                      <span>{method.scope}</span>
                    </td>
                    <td>{formatEmissions(method.annualOffsetKg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </section>

      <section className="supplier-orders-panel" aria-labelledby="supplier-orders-title">
        <div className="supplier-analytics-card-header">
          <h2 id="supplier-orders-title">Current Work / Purchase Orders</h2>
          <span>Matched by supplier ID</span>
        </div>

        <div className="supplier-orders-table-wrap">
          <table className="supplier-analytics-table supplier-orders-table">
            <caption>Supplier current work and purchase orders</caption>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Type</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Due</th>
                <th scope="col">Emissions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrderRows.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.type}</td>
                  <td>{order.category}</td>
                  <td>{order.description}</td>
                  <td>{order.due}</td>
                  <td>{formatEmissions(order.emissions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AppFooter />
    </main>
  )
}

export default SupplierAnalyticsPage
