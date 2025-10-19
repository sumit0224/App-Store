const express = require('express');
const cors = require('cors');
const helmet = require('helmet');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => res.json({ ok: true }));


// TODO: mount routes: auth, apps, uploads, admin


module.exports = app;