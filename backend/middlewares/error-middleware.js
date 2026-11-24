import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const logContext = { err, method: req.method, path: req.route?.path, userId: req.user?.id || null, ip: req.ip };
  
  if (err.isOperational) {
    logger.warn(logContext, err.message);
  } else {
    logger.error(logContext, err.message);
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body.' });
  }

  if (err.isOperational) {
    const response = { error: err.message };

    const hasDetails = Array.isArray(err.details)
      ? err.details.length > 0
      : err.details && Object.keys(err.details).length > 0;

    if (hasDetails) {
      response.details = err.details;
    }

    return res.status(status).json(response);
  }
  return res.status(500).json({ error: 'Internal server error'})
}
