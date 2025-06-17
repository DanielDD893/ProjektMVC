const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://DanielDD893:123@projektmvc.whrminb.mongodb.net/fitness-app?retryWrites=true&w=majority&appName=ProjektMVC')
  .then(() => console.log('Połączenie z MongoDB nawiązane'))
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log(` [REQUEST] ${req.method} ${req.url}`);
    console.log(` [HEADERS] Content-Type: ${req.headers['content-type']}`);
    if (req.method === 'POST') {
        console.log(` [BODY] (raw):`, req.body);
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log(`📦 [BODY] (parsed):`, req.body);
    }
    next();
});

const trainingRoutes = require('./routes/trainings');
app.get('/', (req, res) => {
    res.redirect('/trainings');
});

app.use('/trainings', trainingRoutes);
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Strona nie znaleziona',
        message: 'Strona, której szukasz, nie istnieje.',
        error: { status: 404 }
    });
});

app.listen(PORT, () => {
    console.log(` Serwer uruchomiony na porcie ${PORT}`);
    console.log(` Otwórz http://localhost:${PORT} w przeglądarce`);
}); 