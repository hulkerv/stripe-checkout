// Requirements
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
const multer = require('multer');
const {
    v4: uuidv4
} = require('uuid');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const {
    STRIPE_SECRET_API_KEY,
    STRIPE_PUBLIC_API_KEY
} = process.env;
const stripe = require('stripe')(STRIPE_SECRET_API_KEY);

// Inicializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4242);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers'),
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', '.hbs');


// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
});
app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/img/uploads'),
    limits: {
        fileSize: 10000000
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: El Archivo debe ser una imagen valida')
    }
}).single('image'));
//-------------stripe
//----------------------redirect stripe server
//app.post('/create-checkout-session', async (req, res) => {
//  const session = await stripe.checkout.sessions.create({
//    payment_method_types: ['card'],
//    line_items: [
//      {
//        price_data: {
//          currency: 'usd',
//          product_data: {
//            name: 'T-shirt',
//          },
//          unit_amount: 2000,
//        },
//        quantity: 1,
//      },
//    ],
//    mode: 'payment',
//    success_url: 'https://example.com/success',
//    cancel_url: 'https://example.com/cancel',
//  });
//
//  res.json({ id: session.id });
//});
//-----------------------Custom payment flow
const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};
app.post("/create-payment-intent", async (req, res) => {
    const {
        items
    } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd"
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use(require('./routes/products.routes'));
app.use(require('./routes/users.routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("."));


module.exports = app;
