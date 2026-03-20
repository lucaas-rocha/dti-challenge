const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creating the SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Table creation
db.serialize(() => {

    //  Product
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT
        )
    `);

    // Cart 
    db.run(`
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL CHECK(quantity >= 1 AND quantity <= 10),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // Here I insert a test product (My computer specs in brazilian reais because it is my reference of monetary value)
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const insert = db.prepare(`INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`);
            insert.run('Notebook Lenovo LOQ-e', 'High End Notebook.', 5499.00, 'https://placehold.co/600x400');
            insert.run('Bluetooth Mouse', 'This mouse offers comfort and little to no sounds when clicking', 120.50, 'https://placehold.co/600x400');
            insert.run('Mechanical Keyboard', 'A Keyboard with RGB keys', 350.00, 'https://placehold.co/600x400');
            insert.finalize();
            console.log('Products Inserted');
        }
    });
});

module.exports = db;