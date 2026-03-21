const db = require('../database/database');

// Cart listing (GET)
exports.getCart = (req, res) => {
    const query = `
        SELECT cart.id as cart_id, cart.quantity, cart.selected_option, products.*
        FROM cart
        JOIN products ON cart.product_id = products.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error retrieving cart' });
        res.json(rows);
    });
};

// Adding Product in Cart (POST)
exports.addToCart = (req, res) => {
    const { product_id, selected_option } = req.body; 
    const optionToSave = selected_option || 'Default'; 

    if (!product_id) {
        return res.status(400).json({ error: 'Inform product ID' });
    }

    db.get("SELECT * FROM cart WHERE product_id = ? AND selected_option = ?", [product_id, optionToSave], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (row) {
            const newQuantity = row.quantity + 1;
            if (newQuantity > 10) {
                return res.status(400).json({ error: 'The maximum quantity per product is 10.' });
            }

            db.run("UPDATE cart SET quantity = ? WHERE id = ?", [newQuantity, row.id], function(err) {
                if (err) return res.status(500).json({ error: 'Error updating quantity' });
                res.json({ message: 'Quantity updated successfully', cart_id: row.id, quantity: newQuantity });
            });
        } else {
            db.run("INSERT INTO cart (product_id, selected_option, quantity) VALUES (?, ?, 1)", [product_id, optionToSave], function(err) {
                if (err) return res.status(500).json({ error: 'Error adding product to cart' });
                res.status(201).json({ message: 'Product added to cart', cart_id: this.lastID, quantity: 1 });
            });
        }
    });
};

// Changing the quantity of an product from the cart (PUT)
exports.updateCartQuantity = (req, res) => {
    const cart_id = req.params.id;
    const { quantity } = req.body;

    if (quantity < 1 || quantity > 10) {
        return res.status(400).json({ error: 'The quantity must be between 1 to 10' });
    }

    db.run("UPDATE cart SET quantity = ? WHERE id = ?", [quantity, cart_id], function(err) {
        if (err) return res.status(500).json({ error: 'Error updating cart' });
        if (this.changes === 0) return res.status(404).json({ error: 'Product not found in cart.' });
        
        res.json({ message: 'Quantity updated successfully' });
    });
};

// Removing an item from the cart (DELETE)
exports.removeFromCart = (req, res) => {
    const cart_id = req.params.id;

    db.run("DELETE FROM cart WHERE id = ?", [cart_id], function(err) {
        if (err) return res.status(500).json({ error: 'Error removing product' });
        if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
        
        res.json({ message: 'Product removed successfully' });
    });
};

// Simulating the chekout (POST)
exports.checkout = (req, res) => {
    db.run("DELETE FROM cart", [], function(err) {
        if (err) return res.status(500).json({ error: 'Checkout error' });
        res.json({ 
            message: 'Order successfully completed! Thank you for your purchase',
            status: 'sent'
        });
    });
};