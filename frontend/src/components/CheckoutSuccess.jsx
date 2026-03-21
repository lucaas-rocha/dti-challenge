export default function CheckoutSuccess({ onBackToStore }) {
  return (
    <div className="checkout-success-overlay">
      <div className="checkout-success-card">
        <h2 style={{ fontSize: '2.5em', marginBottom: '15px' }}>🎉</h2>
        <h2>Order Successful!</h2>
        <p>Thank you for your purchase. Your order has been placed and is being processed.</p>
        <button className="confirm-btn" onClick={onBackToStore} style={{ marginTop: '20px' }}>
          Back to Store
        </button>
      </div>
    </div>
  );
}