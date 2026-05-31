import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { ToastViewport } from './ToastViewport';

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container page-shell">
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}
