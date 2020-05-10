const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const profileRouter = require('./routes/profileRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const stateRouter = require('./routes/stateRoutes');
const packageRouter = require('./routes/packageRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const solicitacaoRouter = require('./routes/solicitacaoRouter');
const favoriteServiceRoutes = require('./routes/favoriteServiceRoutes');
const planejamentoRoutes = require('./routes/planejamentoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const statisticRouter = require('./routes/statisticsRoutes');
const logsRouter = require('./routes/logRoutes');
const AppError = require('./utils/appError');
const globalHandlerError = require('./controllers/errorController');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENTE_SERVER,
    credentials: true
  })
);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    max: 100,
    windowMs: 3600 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);
}

app.use(express.json());

app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/perfils', profileRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subCategories', subCategoryRoutes);
app.use('/api/v1/estados', stateRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/solicitacoes', solicitacaoRouter);
app.use('/api/v1/favoriteServices', favoriteServiceRoutes);
app.use('/api/v1/planejamentos', planejamentoRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/statistics', statisticRouter);
app.use('/api/v1/logs', logsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalHandlerError);

module.exports = app;
