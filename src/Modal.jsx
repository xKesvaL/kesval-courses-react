export function Modal({ children, isOpen, handleClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 relative">
        <button
          type="button"
          className="absolute top-0 right-0 size-6 text-lg translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer bg-white rounded-full"
          onClick={handleClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
