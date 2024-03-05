const express = require('express');
require('dotenv').config();
const Sync = require('@paybook/sync-js');
//import "@paybook/sync-widget/dist/widget.css";
//import SyncWidget from "@paybook/sync-widget";
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.SYNC_API_KEY;

app.use(cors());
app.use(express.json());

let syncToken = '';
let credencialSAT = '';

app.get('/', async (req, res) => {
    try {
        // Crear un usuario
        let user = await Sync.run(
            {api_key: API_KEY}, 
            '/users', 
            {
                id_external: 'MIST079001',
                name: 'Rey Misterio4'
            }, 
            'POST'
        );

        let {id_user} = user;
        console.log(`ID de usuario: ${id_user}`);
        
        // Crear una sesión para un usuario
        let token = await Sync.auth(
            {api_key: API_KEY}, // Tu API KEY
            {id_user: id_user} // ID de usuario
        );

        res.json({
            message: 'Datos del Usuario y Token',
            user: user,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

app.get('/obtener-sesion', async (req, res) => {
    try {
        let session = await Sync.auth(
            {api_key: API_KEY},
            {id_user: "65d2a62f5d205e7591371ec4"}
        );
        let token = session.token; 
        syncToken = token;
        console.log(`Token: ${token}`);
        res.json({
            message: 'Datos de la sesión y Token',
            token: token // Aquí devuelves el token obtenido
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

app.get('/crear-credencial', async (req, res) => {
    try {
        const payload = {
            id_site: "56cf5728784806f72b8b456f",
            credentials: {
                rfc: "ACM010101ABC",
                password: "test"
            },
            options: {
                search_from: "2024-01-01",
                search_to: "2024-01-31"
            }
        };

        let credential = await Sync.run(
            {token: syncToken}, 
            '/credentials', 
            payload, 
            'POST'
        );
        credencialSAT = credential.id_credential;
        console.log(credencialSAT);

        res.json({
            message: 'Credencial creada exitosamente',
            credential: credential // Devuelve la respuesta de la creación de la credencial
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

app.get('/crear-usuario', async (req, res) => {
    try {
        // Crear un usuario en Sync
        let user = await Sync.run(
            {api_key: API_KEY}, 
            '/users', 
            {
                id_external: 'MIST030781',
                name: 'Rey Misterio3'
            }, 
            'POST'
        );

        let {id_user} = user;
        
        // Crear una sesión para el usuario
        let session = await Sync.auth(
            {api_key: API_KEY},
            {id_user: id_user}
        );

        // Aquí, opcionalmente obtén los JWKs si estás utilizando el modo estricto en el widget
        // Supongamos que los JWKs se obtienen así (esto es solo un ejemplo, adapta según tu caso):
        // let jwks = obtenerJWKSDeAlgunaManera();

        res.json({
            message: 'Usuario y Token creados con éxito',
            token: session.token,
            // Si estás usando JWKs, también devuélvelos aquí
            // authorization: jwks.authorization,
            // body: jwks.body
        });
        console.log(session.token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

// Endpoint para refrescar el token de un usuario
app.get('/ruta-para-refrescar-token', async (req, res) => {
    try {
        // Asumiendo que recibimos el id_user de alguna manera (e.g., a través de un JWT)
        // Para este ejemplo, lo recibirás como una query param por simplicidad
        const id_user = req.query.id_user;

        if (!id_user) {
            return res.status(400).send('ID de usuario no proporcionado');
        }

        // Aquí usarías la API de Sync para obtener un nuevo token para el usuario
        let newToken = await Sync.auth(
            {api_key: API_KEY},
            {id_user: id_user} // ID de usuario para el cual refrescar el token
        );

        res.json({
            message: 'Token refrescado con éxito',
            newToken: newToken.token // Asegúrate de ajustar según la respuesta de tu API
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al procesar la solicitud de refrescar el token.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
