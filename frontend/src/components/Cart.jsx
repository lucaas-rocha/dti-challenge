export default function Cart({ cart, updateQuantity, removeFromCart, checkout, grandTotal }) {
  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.cart_id} className="cart-item">
              <img src={item.image} alt={item.name} width="50" style={{ borderRadius: '4px' }} />
              <div className="cart-item-info">
                <h4>
                  {item.name}
                  {item.selected_option && item.selected_option !== 'Default' && (
                    <span style={{color: '#666', fontSize: '0.9em', marginLeft: '5px'}}>
                      ({item.selected_option})
                    </span>
                  )}
                </h4>
                <p>Subtotal: $ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="cart-actions">
                <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}>-</button>
                <span style={{ fontWeight: 'bold', margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}>+</button>
                <button className="remove-btn" onClick={() => removeFromCart(item.cart_id)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h3>Grand Total: $ {grandTotal.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={checkout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}