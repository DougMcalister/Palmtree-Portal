import { Routes, Route } from 'react-router'

import { AboutPage, KeyFeaturesPage, WhyChooseUsPage } from './template-pages.tsx'
import ClientLandingPage from './client/client-landing-page.tsx'
import ClientJobsPage from './client/client-jobs-page.tsx'
import ClientAnalyticsPage from './client/client-analytics-page.tsx'
import ClientSupplierDetails from './client/client-supplier-details.tsx'
import DemoPanel from './demo-panel.tsx'
import PublicHomepage from './homepage.tsx'
import InventoryPage from './supplier/inventory-page.tsx'
import LoginPage from './login-page.tsx'
import SupplierDashboard from './supplier/supplier-dashboard.tsx'
import SupplierAnalyticsPage from './supplier/supplier-analytics-page.tsx'
import SupplierAdminPage from "./supplier/supplier-admin.tsx"
import SupplierInvoicing from './supplier/supplier-invoice-page.tsx'
import ItemPage from './supplier/inventory-item.tsx'

export default function App() {
  return (
    <>
      <DemoPanel />
      <Routes>
      <Route path="/" element={<PublicHomepage />} />

      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
      <Route path="/key-features" element={<KeyFeaturesPage />} />

      <Route path="/client" element={<ClientLandingPage />} />
      <Route path="/client/jobs" element={<ClientJobsPage />} />
      <Route path="/client/analytics" element={<ClientAnalyticsPage />} />
      <Route
        path="/client/supplier-details/:supplierId"
        element={<ClientSupplierDetails />}
      />

      <Route path="/inventory" element={<InventoryPage />} />
      <Route
        path="/supplier/inventory-item/:activeInventoryKind/:id"
        element={<ItemPage />}
      />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/supplier" element={<SupplierDashboard />} />
      <Route path="/supplier/analytics" element={<SupplierAnalyticsPage />} />
      <Route path="/operations" element={<SupplierAnalyticsPage />} />
      <Route path="/dashboard" element={<SupplierDashboard />} />
      <Route path="/admin" element={<SupplierAdminPage />} />
      <Route path="/invoicing" element={<SupplierInvoicing />} />

      <Route path="*" element={<PublicHomepage />} />
      </Routes>
    </>
  )
}