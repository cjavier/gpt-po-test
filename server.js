const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola Mundo desde mi API con Express');
});

app.post('/registrar-transacciones', (req, res) => {
    const { transactions } = req.body;
  
    // Aquí podrías validar las transacciones recibidas si es necesario
  
    try {
      const result = registerTransactions(transactions);
      res.status(200).json({ message: "Transacciones registradas con éxito", result });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar transacciones", error: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

function registerTransactions(transactions) {
    // Aquí implementarías la lógica para procesar y almacenar las transacciones
    // Por ejemplo, podrías iterar sobre el arreglo de transacciones y guardarlas una por una
  
    transactions.forEach(transaction => {
      // Simulando el registro de cada transacción
      console.log("Registrando transacción:", transaction);
    });
  
    // Retorna algún resultado, como el número de transacciones procesadas
    return { processed: transactions.length };
  }
