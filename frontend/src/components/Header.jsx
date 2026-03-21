export default function Header({ isCartOpen, setIsCartOpen, totalItems }) {
  return (
    <header>
      <h1>My Shop - Technical Test</h1>
      <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
        {isCartOpen ? 'Back to Store' : `🛒 Cart (${totalItems})`}
      </button>
    </header>
  );
}