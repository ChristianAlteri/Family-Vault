// Import dependencies
const express = require('express');
const session = require('express-session');
const moment = require('moment');
const bodyParser = require('body-parser');

// ---------------------------------------------- Comment out route if testing require('./controllers/index');

const routes = require('./controllers/index');

// const routes = require('./controllers/index');

// ----------------------------------------------

const exphbs = require('express-handlebars');

// Import sequelize and Store which is session saving
const { sequelize } = require('./config/connection');
const { User, Relationship, Side } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Initialise handlebars instance and give nickname 'hbs' load helpers
const hbs = exphbs.create({
  extname: 'hbs',
  helpers: {
    age: function (dateOfBirth) {
      const now = moment();
      const age = now.diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
      return age;
    },
  },
});

// Initialise express instance and port
const app = express();
const PORT = process.env.Port || 3001;

//  here we're telling our app(express) to put hbs(handlebars) as the view engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// allows larger image files, middleware: body-parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//   telling express to use the middleware for session with the options provided in the variable 'sess'
app.use(session(sess));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on the boys port ${PORT}!`);
  });
});
