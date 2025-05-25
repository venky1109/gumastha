require('dotenv').config();
require('./models/catalogModel'); // Ensure table is created
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/api/catalogs', require('./routes/catalogRoutes'));



require('./models/productModel');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
