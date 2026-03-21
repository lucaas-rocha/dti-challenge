const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api'); 

const app = express();
const PORT = 3001; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Using API routes
app.use('/api', apiRoutes);

// Initializing server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}/api/products`);
});