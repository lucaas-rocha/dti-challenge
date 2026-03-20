import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  const fetchProducts = () => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err))
  }

  const fetchCart = () => {
    fetch('http://localhost:3001/api/cart')
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.error("Error fetching cart:", err))
  }

  const addToCart = (productId) => {
    fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId })
    })
      .then(res => res.json())
      .then(data => {
        // Backend validation error (min 10,max 10)
        if (data.error) {
          alert(data.error)
        } else {
          alert("Product added to cart!")
          fetchCart()
        }
      })
  }

  const updateQuantity = (cartId, quantity) => {
    // Frontend validation for quantity (min 1, max 10)
    if (quantity < 1 || quantity > 10) {
      alert("Quantity must be between 1 and 10")
      return
    }
    fetch(`http://localhost:3001/api/cart/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
      .then(() => fetchCart())
  }

  const removeFromCart = (cartId) => {
    fetch(`http://localhost:3001/api/cart/${cartId}`, {
      method: 'DELETE'
    })
      .then(() => fetchCart())
  }

  const checkout = () => {
    fetch('http://localhost:3001/api/checkout', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        alert(data.message)
        fetchCart()
        setIsCartOpen(false) // Redirect user to the store view
      })
  }

  // Automatic calculations for the Cart view
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container">
      <header>
        <h1>My Shop - Technical Test</h1>
        <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? 'Back to Store' : `🛒 Cart (${totalItems})`}
        </button>
      </header>

      <main>
        {!isCartOpen ? (
          <div>
            <h2>Our Products</h2>
            <div className="products-grid">
              {products.length === 0 ? (
                <p>Loading Products...</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <p className="price">$ {product.price.toFixed(2)}</p>
                    <button className="add-button" onClick={() => addToCart(product.id)}>
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
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
                      <h4>{item.name}</h4>
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
        )}
      </main>
    </div>
  )
}

export default App