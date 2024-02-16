const express = require('express');
const Airtable = require('airtable');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());

const airtabletoken = process.env.AIRTABLE_API_KEY;
const airtablebase = "appwIgAn22GKs3kuN";
const base = new Airtable({apiKey: airtabletoken}).base(airtablebase);


app.get('/', (req, res) => {
  res.send('Hola Mundo desde mi API con Express');
});

app.post('/registrar-transacciones', (req, res) => {
  const { transactions } = req.body;

  // Mapear transacciones al formato de Airtable
  const recordsToCreate = transactions.map(transaction => ({
      fields: {
          "Concepto": transaction.description,
          "Fecha de Transacción": transaction.date,
          "Cantidad": transaction.amount
      }
  }));

  base('Estado de cuenta').create(recordsToCreate, function(err, records) {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error al registrar transacciones en Airtable", error: err });
    }
    res.status(200).json({ message: "Transacciones registradas con éxito en Airtable", records });
});
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
