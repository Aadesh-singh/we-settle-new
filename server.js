const app = require('./app');
const connectMongo = require('./utils/connect-mongo');

connectMongo();

app.listen(process.env.PORT || 5000, () => {
  console.log('Server Started');
});
