const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hola Mundo desde mi API con Express');
});

// endpoint for PO data registering
app.post('/register-po', (req, res) => {
    // Extracting the data from the request body
    const data = req.body;
  
    // Logging the received data to the console
    console.log(data);
  
    // Responding with a status 200 without any additional processing
    res.status(200).json({ message: "Data received successfully" });
  });
  


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


