const appModule = require('../server/dist/app.js');
const app = appModule.default || appModule;
const { connectDB } = require('../server/dist/config/db.js');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB in serverless function:', err);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0.'
    });
  }

  return app(req, res);
};
