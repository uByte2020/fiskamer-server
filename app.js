const express       = require('express');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit')
const helmet        = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');
const hpp           = require('hpp');

const userRouter            = require('./routes/userRoutes');
const profileRouter         = require('./routes/profileRoutes');
const categoryRouter        = require('./routes/categoryRoutes');
const stateRouter           = require('./routes/stateRoutes');
const packageRouter         = require('./routes/packageRoutes');
const AppError              = require('./utils/appError')
const globalHandlerError    = require('./controllers/errorController')

const app = express();

app.use(helmet())

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
    max: 100,
    windowMs: 3600 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json()); 

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); 

// Data sanitization against XSS
app.use(xss()); 

// Prevent parameter pollution
app.use(hpp()); 

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users'     , userRouter    );
app.use('/api/v1/profiles'  , profileRouter );
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/states'    , stateRouter   );
app.use('/api/v1/packages'  , packageRouter );

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalHandlerError)

module.exports = app;
