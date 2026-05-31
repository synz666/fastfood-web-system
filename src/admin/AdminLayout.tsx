import { Outlet } from 'react-router-dom';
import { ToastViewport } from '../components/ToastViewport';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import './styles/admin.css';

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
      <ToastViewport />
    </div>
  );
}
