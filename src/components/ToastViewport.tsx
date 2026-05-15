import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function ToastViewport() {
  const { toastMessages, dismissToast } = useAppContext();

  return (
    <div className="toast-viewport">
      {toastMessages.map((toast) => (
        <div key={toast.id} className="toast-card">
          <div>
            <strong>{toast.title}</strong>
            {toast.description ? <p>{toast.description}</p> : null}
          </div>
          <button type="button" className="icon-button ghost" onClick={() => dismissToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
