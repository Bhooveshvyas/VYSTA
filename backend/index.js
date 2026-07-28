const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
// middleware
app.use(cors());
app.use(express.json());//changes the request body to json
app.use(express.urlencoded({ extended: true })); //changes the request body to x-www-form-urlencoded(mtlb form se aane wale data ko parse karega)

// routes
app.get('/', (req, res) => {
    res.send("VYSTA backend is runningg!!!!!...")
})
app.use('/api/auth', require('./Routes/auth.routes.js'))
app.use('/api/admin', require('./Routes/admin.routes.js'))
app.use('/api/order', require('./Routes/order.routes.js'))
app.use('/api/product', require('./Routes/product.routes.js'))
app.use('/api/payment', require('./Routes/payment.routes.js'))
app.use("/api/contact", require("./Routes/contact.routes.js"));

// Port
const PORT = process.env.PORT || 5000

// Testing
app.listen(PORT, () => {
    console.log(("Server is running on http://localhost:" + PORT));

})