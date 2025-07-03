if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGO_URI,
});
