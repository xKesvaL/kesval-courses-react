export function Modal({ children, isOpen, handleClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 relative">
        <span
          className="absolute top-0 right-0 size-6 text-lg translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer bg-white rounded-full"
          onClick={handleClose}
        >
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}
