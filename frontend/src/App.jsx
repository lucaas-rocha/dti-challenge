import { useState, useEffect } from 'react'
import './App.css'

import Toast from './components/Toast'
import CheckoutSuccess from './components/CheckoutSuccess'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import OptionsModal from './components/OptionsModal'

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
    if (cart.length === 0) {
      showToast("Your cart is empty!", 'error');
      return;
    }
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

      <Header isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} totalItems={totalItems} />

      <main>
        {!isCartOpen ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>Our Products</h2>
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
                  <div key={product.id}>
                    <ProductCard product={product} onAddToCart={handleAddButtonClick} />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <Cart 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            checkout={checkout} 
            grandTotal={grandTotal} 
          />
        )}
      </main>
      
      {optionModal.isOpen && optionModal.product && (
        <OptionsModal 
          optionModal={optionModal} 
          setOptionModal={setOptionModal} 
          handleConfirmOption={handleConfirmOption} 
        />
      )}
    </div>
  )
}

export default App