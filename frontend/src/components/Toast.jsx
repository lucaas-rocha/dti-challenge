import { useEffect, useState } from 'react';

export default function Toast({ message, type, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // start exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);
    const closeTimer = setTimeout(() => {
      onClose();
    }, 1700);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-message ${type} ${isExiting ? 'fade-out' : ''}`}>
      {message}
    </div>
  );
}