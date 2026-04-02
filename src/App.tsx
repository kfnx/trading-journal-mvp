import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import LoginPage from '@/features/auth/LoginPage'

const DashboardPage   = lazy(() => import('@/features/dashboard/DashboardPage'))
const ImportPage      = lazy(() => import('@/features/import/ImportPage'))
const TradeListPage   = lazy(() => import('@/features/trades/TradeListPage'))
const TradeDetailPage = lazy(() => import('@/features/trade-detail/TradeDetailPage'))
const AnalyticsPage   = lazy(() => import('@/features/analytics/AnalyticsPage'))
const ChatPage        = lazy(() => import('@/features/chat/ChatPage'))

function PageLoader() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="/import"    element={<Suspense fallback={<PageLoader />}><ImportPage /></Suspense>} />
          <Route path="/trades"    element={<Suspense fallback={<PageLoader />}><TradeListPage /></Suspense>} />
          <Route path="/trades/:id" element={<Suspense fallback={<PageLoader />}><TradeDetailPage /></Suspense>} />
          <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
          <Route path="/chat"      element={<Suspense fallback={<PageLoader />}><ChatPage /></Suspense>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
