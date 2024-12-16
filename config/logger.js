const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',  // Logs at the 'info' level and above (info, warn, error)
  format: winston.format.combine(
    winston.format.colorize(),  // Colorizes logs for better readability
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Add timestamp
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/app.log' }) // Log to a file (optional)
  ]
});

module.exports = logger; // Export the logger
