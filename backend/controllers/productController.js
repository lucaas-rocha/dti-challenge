const db = require('../database/database');

// Product Listing (GET)
exports.getProducts = (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving products from the database' });
        }
        res.json(rows);
    });
};