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
  registerTransactions(transactions)
      .then(records => {
          res.status(200).json({ message: "Transacciones registradas con éxito en Airtable", records });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Error al registrar transacciones en Airtable", error: err.message });
      });
});

// Endpoint para obtener datos por rango de fechas
app.post('/datos-por-fecha', (req, res) => {
  const { fechaInicial, fechaFinal } = req.body;

  getAirtableTransactions(fechaInicial, fechaFinal)
      .then(data => {
          res.status(200).json(data);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Error al obtener datos de Airtable", error: err });
      });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

function registerTransactions(transactions) {
  return new Promise((resolve, reject) => {
      // Mapear transacciones al formato de Airtable
      const recordsToCreate = transactions.map(transaction => ({
          fields: {
              "Concepto": transaction.description,
              "Fecha de Transacción": transaction.date,
              "Cantidad": transaction.amount
          }
      }));

      base('Estado de cuenta').create(recordsToCreate, (err, records) => {
          if (err) {
              reject(err);
          } else {
              resolve(records);
          }
      });
  });
}


  function getAirtableTransactions(fechaInicial, fechaFinal) {
    return new Promise((resolve, reject) => {
        // Ajustar la fecha final para incluir el día completo
        let fechaFinalObj = new Date(fechaFinal);
        fechaFinalObj.setDate(fechaFinalObj.getDate() + 1);
        let fechaFinalAjustada = fechaFinalObj.toISOString().split('T')[0];

        const filterByFormula = `AND(IS_AFTER({Fecha de Transacción}, '${fechaInicial}'), IS_BEFORE({Fecha de Transacción}, '${fechaFinalAjustada}'))`;

        console.log(`Fórmula de Filtro: ${filterByFormula}`);

        base('Estado de cuenta').select({
            filterByFormula,
            view: "Transacciones"
        }).firstPage((err, records) => {
            if (err) {
                reject(err);
            } else {
                console.log(`Registros Recibidos: `, records);
                const data = records.map(record => ({
                    id: record.id,
                    fields: record.fields
                }));
                resolve(data);
            }
        });
    });
}
