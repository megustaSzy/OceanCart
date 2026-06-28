import { AlertCircle, CheckCircle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Ya',
  cancelText = 'Batal',
  type = 'info',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100', hover: 'hover:bg-red-600', shadow: 'shadow-red-500/30', icon: Trash2 },
    success: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-100', hover: 'hover:bg-blue-700', shadow: 'shadow-blue-600/30', icon: CheckCircle },
    info: { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-100', hover: 'hover:bg-indigo-600', shadow: 'shadow-indigo-500/30', icon: AlertCircle },
  };

  const theme = colors[type];
  const Icon = theme.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      ></div>
      
      {/* Modal Card */}
      <div 
        className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full relative z-10 transform scale-100 transition-transform duration-200"
      >
        <button 
          onClick={onCancel} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-2xl transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className={`mx-auto w-24 h-24 ${theme.light} ${theme.text} rounded-[28px] flex items-center justify-center mb-8 shadow-inner`}>
          <Icon size={48} />
        </div>
        
        <div className="text-center mb-10">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 text-base leading-relaxed">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors text-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            className={`flex-1 px-6 py-4 ${theme.bg} ${theme.hover} text-white font-bold rounded-2xl shadow-xl ${theme.shadow} transition-all text-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
