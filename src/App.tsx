import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AdminGuard } from './admin/AdminGuard';
import { AdminLayout } from './admin/AdminLayout';
import { CategoriesPage } from './admin/pages/CategoriesPage';
import { DashboardPage } from './admin/pages/DashboardPage';
import { OrdersAdminPage } from './admin/pages/OrdersAdminPage';
import { ProductFormPage } from './admin/pages/ProductFormPage';
import { ProductsPage } from './admin/pages/ProductsPage';
import { SettingsPage } from './admin/pages/SettingsPage';
import { UsersPage } from './admin/pages/UsersPage';
import { Layout } from './components/Layout';
import { AboutPage } from './pages/AboutPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactsPage } from './pages/ContactsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { RegisterPage } from './pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'access-denied', element: <AccessDeniedPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/new', element: <ProductFormPage /> },
          { path: 'products/:id/edit', element: <ProductFormPage /> },
          { path: 'orders', element: <OrdersAdminPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
