import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { CardSkeleton } from '@/components/ui/Skeleton'

// Lazy-loaded pages for code splitting
const HomePage       = lazy(() => import('@/pages/Home/HomePage'))
const SearchPage     = lazy(() => import('@/pages/Search/SearchPage'))
const ListingPage    = lazy(() => import('@/pages/Listing/ListingPage'))
const LoginPage      = lazy(() => import('@/pages/Auth/LoginPage'))
const RegisterPage   = lazy(() => import('@/pages/Auth/RegisterPage'))
const PublishPage    = lazy(() => import('@/pages/Publish/PublishPage'))
const MessagesPage   = lazy(() => import('@/pages/Messages/MessagesPage'))
const ProfilePage    = lazy(() => import('@/pages/Profile/ProfilePage'))
const FavoritesPage  = lazy(() => import('@/pages/Favorites/FavoritesPage'))
const AdminPage      = lazy(() => import('@/pages/Admin/AdminPage'))
const NotFoundPage   = lazy(() => import('@/pages/NotFound/NotFoundPage'))

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"            element={<HomePage />} />
            <Route path="/search"      element={<SearchPage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/publish" element={
              <ProtectedRoute><PublishPage /></ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute><MessagesPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute><FavoritesPage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><AdminPage /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
