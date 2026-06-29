import { useState } from 'react'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import { workOrdersDatabase } from '../local-database.ts'

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="supplier-admin-button-icon">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="supplier-admin-action-icon">
      <path d="M21.26.26a.88.88 0 0 1 1.23 0l5.25 5.25c.35.34.35.89 0 1.23l-17.5 17.5a.88.88 0 0 1-.29.2L1.2 27.94a.88.88 0 0 1-.94-.2.88.88 0 0 1-.2-.94l3.5-8.75a.88.88 0 0 1 .2-.29L21.26.26Zm-1.65 4.12 4.02 4.01 2.26-2.26-4.01-4.02-2.27 2.27ZM22.39 9.62l-4.02-4.01L7 16.99v.51h.88c.48 0 .87.39.87.88v.87h.88c.48 0 .87.39.87.88V21h.51L22.39 9.62ZM5.31 18.68l-.19.19-2.67 6.68 6.68-2.67.19-.19a.88.88 0 0 1-.57-.82V21h-.87a.88.88 0 0 1-.88-.87v-.88h-.87a.88.88 0 0 1-.82-.57Z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="supplier-admin-action-icon supplier-admin-settings-icon">
      <circle cx="14" cy="14" r="3.5" />
      <path d="M22.63 17.5a2.1 2.1 0 0 0 .46 2.19 2.33 2.33 0 0 1 0 3.3 2.33 2.33 0 0 1-3.3 0 2.1 2.1 0 0 0-2.19-.45 2.12 2.12 0 0 0-1.17 1.96 2.33 2.33 0 1 1-4.66 0 2.1 2.1 0 0 0-1.27-1.87 2.1 2.1 0 0 0-2.12.39 2.33 2.33 0 0 1-3.37-3.22 2.1 2.1 0 0 0 .45-2.19 2.12 2.12 0 0 0-1.96-1.17 2.33 2.33 0 1 1 0-4.66 2.1 2.1 0 0 0 1.87-1.27 2.1 2.1 0 0 0-.39-2.12A2.33 2.33 0 0 1 8.2 5.01a2.1 2.1 0 0 0 2.19.45A2.12 2.12 0 0 0 11.67 3.5a2.33 2.33 0 1 1 4.66 0 2.1 2.1 0 0 0 1.17 1.87 2.1 2.1 0 0 0 2.19-.45 2.33 2.33 0 1 1 3.3 3.3 2.1 2.1 0 0 0-.45 2.19 2.12 2.12 0 0 0 1.96 1.17 2.33 2.33 0 1 1 0 4.66 2.1 2.1 0 0 0-1.87 1.26Z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="supplier-admin-action-icon supplier-admin-logout-icon">
      <path d="M15 18 9 12l6-6" />
      <path d="M9 12h12" />
      <path d="M3 4v16" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" className="supplier-admin-profile-icon">
      <circle cx="110" cy="76" r="25" />
      <path d="M58 168v-22c0-27 104-27 104 0v22H58Z" />
    </svg>
  )
}

function SupplierAdminPage() {
  const visibleOrders = workOrdersDatabase.slice(0, 11)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)

  return (
    <main className="homepage supplier-admin-page" aria-label="Supplier admin">
      <SupplierHeader />

      <section className="supplier-admin-work-order-controls" aria-label="Work order controls">
        <label htmlFor="supplier-admin-order-select">Work Order Number</label>
        <select
          id="supplier-admin-order-select"
          value={selectedOrder}
          onChange={(event) => setSelectedOrder(event.target.value)}
        >
          <option value=""></option>
          {visibleOrders.map((order) => (
            <option key={order.jobNo} value={order.jobNo}>
              {order.jobNo}
            </option>
          ))}
        </select>

        <div className="supplier-admin-top-actions">
          <button type="button" onClick={() => setIsInvoicePreviewOpen(true)}>
            Invoice
          </button>
          <button type="button">
            Contact
          </button>
        </div>
      </section>

      <section className="supplier-admin-guide-layout">
        <article className="supplier-admin-job-history" aria-labelledby="supplier-admin-job-history-title">
          <h1 id="supplier-admin-job-history-title">Job History</h1>

          <table className="supplier-admin-history-table">
            <caption>Supplier job history</caption>
            <thead>
              <tr>
                <th scope="col">Job No.</th>
                <th scope="col">Description</th>
                <th scope="col">Completion Date</th>
                <th scope="col"><span className="sr-only">Invoice action</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.jobNo}>
                  <td>{order.jobNo}</td>
                  <td>{order.description}</td>
                  <td>{order.due}</td>
                  <td>
                    <button type="button" onClick={() => setIsInvoicePreviewOpen(true)}>
                      <span>Invoice</span>
                      <ArrowRightIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <aside className="supplier-admin-guide-profile" aria-label="Supplier profile controls">
          <div className="supplier-admin-avatar">
            <ProfileIcon />
          </div>

          <div className="supplier-admin-profile-actions">
            <button className="supplier-admin-profile-button supplier-admin-edit-button" type="button">
              <PencilIcon />
              <span>Edit Profile</span>
            </button>
            <button className="supplier-admin-profile-button supplier-admin-settings-button" type="button">
              <SettingsIcon />
              <span>Settings</span>
            </button>
            <button className="supplier-admin-profile-button supplier-admin-logout-button" type="button">
              <LogoutIcon />
              <span>Log Out</span>
            </button>
          </div>
        </aside>
      </section>

      {isInvoicePreviewOpen ? (
        <div className="supplier-admin-invoice-popout-backdrop" role="presentation">
          <section className="supplier-admin-invoice-popout" role="dialog" aria-modal="true" aria-label="Invoice sample preview">
            <button
              className="supplier-admin-invoice-popout-close"
              type="button"
              aria-label="Close invoice preview"
              onClick={() => setIsInvoicePreviewOpen(false)}
            >
              ×
            </button>

            <img src="/invoice-sample.svg" alt="Invoice sample" />
          </section>
        </div>
      ) : null}

      <AppFooter />
    </main>
  )
}

export default SupplierAdminPage
