import { useState, useEffect } from 'react'
import './App.css'

import Toast from './components/Toast'
import CheckoutSuccess from './components/CheckoutSuccess'

function App() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [optionModal, setOptionModal] = useState({
    isOpen: false,
    product: null,
    tempOption: '' 
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: '' })
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)

  // Toast function to show messages to the user
  const showToast = (message, type) => {
    setToast({ visible: true, message, type })
  }

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

  const handleAddButtonClick = (product) => {
    const optionsArray = JSON.parse(product.options || '[]');
    
    // if product has options, open modal. Otherwise, add directly to cart with "Default" option
    if (optionsArray.length > 0) {
      setOptionModal({
        isOpen: true,
        product: product,
        tempOption: optionsArray[0]
      });
    } else {
      performAddToCart(product.id, 'Default');
    }
  }
  const handleConfirmOption = () => {
    if (optionModal.product && optionModal.tempOption) {
      performAddToCart(optionModal.product.id, optionModal.tempOption);
      setOptionModal({ isOpen: false, product: null, tempOption: '' });
    }
  }

  const performAddToCart = (productId, chosenOption) => {
    fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, selected_option: chosenOption })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showToast(data.error, 'error')
        } else {
          showToast("Product added to cart!", 'success')
          fetchCart()
        }
      })
      .catch(err => console.error("Error adding to cart:", err));
  }

  const updateQuantity = (cartId, quantity) => {
    // Validate quantity before sending the request
    if (quantity < 1 || quantity > 10) {
      showToast("Quantity must be between 1 and 10", 'error')
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
      .then(() => {
        fetchCart();
        showToast("Product removed from cart", "error"); 
      })
  }

  const checkout = () => {
    fetch('http://localhost:3001/api/checkout', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        fetchCart()
        setIsCartOpen(false)
        setShowCheckoutSuccess(true)
      })
  }

  const handleBackToStore = () => {
    setShowCheckoutSuccess(false)
  }

  // filter products based on search term (case-insensitive)
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container">

      {showCheckoutSuccess && <CheckoutSuccess onBackToStore={handleBackToStore} />}

      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, visible: false })} 
        />
      )}

      <header>
        <h1>My Shop - Technical Test</h1>
        <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? 'Back to Store' : `🛒 Cart (${totalItems})`}
        </button>
      </header>

      <main>
        {!isCartOpen ? (
          <div>
            {/* 4. SEÇÃO DE PRODUTOS PREPARADA PARA MÚLTIPLOS ITENS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>Our Products</h2>
              {/* BARRA DE BUSCA (Search) */}
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <p>No Products found.</p>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <p className="price">$ {product.price.toFixed(2)}</p>
                    
                    {/* Botão agora chama a lógica de verificação de opções */}
                    <button className="add-button" onClick={() => handleAddButtonClick(product)}>
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
        )}
      </main>
      {optionModal.isOpen && optionModal.product && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Option</h3>
            <p>Please select an option for <strong>{optionModal.product.name}</strong>:</p>
            
            <select 
              className="options-select"
              value={optionModal.tempOption}
              onChange={(e) => setOptionModal({...optionModal, tempOption: e.target.value})}
            >
              {JSON.parse(optionModal.product.options).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setOptionModal({ isOpen: false, product: null, tempOption: '' })}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirmOption}>
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App