import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [products, setProducts] = useState([])
  
  useEffect(() => {
    // GET Requisition to the backend API
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        console.log("Products received:", data)
      })
      .catch(error => console.error("Error searching for products:", error))
  }, [])

  return (
    <div className="container">
      <header>
        <h1>My Shop - Technical Test</h1>
      </header>

      <main>
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
                <button className="add-button">Add to cart</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App