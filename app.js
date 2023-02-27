var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const mercadopago = require('mercadopago')
require('dotenv').config()
var port = process.env.PORT || 3000


var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
})

// configure app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});


// integracion con mercado pago
mercadopago.configure({ access_token: process.env.MERCADOPAGO_KEY });

app.post('/payment', function (req, res) {
    let prod = req.body;

    let preference = {
        items: [
            {
                title: prod.title,
                unit_price: prod.price,
                quantity: prod.quantity,
            }
        ],
        back_urls: {
            success: "http://localhost:3000",
            failure: "",
            pending: ""
        },
        auto_return: "approved",
        binary_mode: true
    };

    mercadopago.preferences.create(preference)
        .then((response) => {
            res.status(200).send({ response });
        }).catch((error) => {
            res.status(400).send({ error: error.message })
        });

})
app.listen(port);