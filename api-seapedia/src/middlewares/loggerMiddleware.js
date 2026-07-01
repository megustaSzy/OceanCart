/**
 * Request Logger Middleware
 * 
 * Logs incoming HTTP requests and outgoing responses with timing,
 * status codes, and contextual details for easier debugging.
 */

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

/**
 * Returns a colored HTTP method string for readability
 */
const colorizeMethod = (method) => {
  const map = {
    GET: `${colors.green}${colors.bright}${method}${colors.reset}`,
    POST: `${colors.blue}${colors.bright}${method}${colors.reset}`,
    PUT: `${colors.yellow}${colors.bright}${method}${colors.reset}`,
    PATCH: `${colors.yellow}${colors.bright}${method}${colors.reset}`,
    DELETE: `${colors.red}${colors.bright}${method}${colors.reset}`,
  };
  return map[method] || `${colors.white}${method}${colors.reset}`;
};

/**
 * Returns a colored status code string based on HTTP response category
 */
const colorizeStatus = (status) => {
  if (status >= 500) return `${colors.bgRed}${colors.white}${colors.bright} ${status} ${colors.reset}`;
  if (status >= 400) return `${colors.red}${colors.bright}${status}${colors.reset}`;
  if (status >= 300) return `${colors.cyan}${status}${colors.reset}`;
  if (status >= 200) return `${colors.green}${colors.bright}${status}${colors.reset}`;
  return `${colors.white}${status}${colors.reset}`;
};

/**
 * Formats milliseconds into a human-readable duration
 */
const formatDuration = (ms) => {
  if (ms < 1) return `${colors.green}< 1ms${colors.reset}`;
  if (ms < 100) return `${colors.green}${ms}ms${colors.reset}`;
  if (ms < 500) return `${colors.yellow}${ms}ms${colors.reset}`;
  return `${colors.red}${ms}ms${colors.reset}`;
};

/**
 * Sanitizes sensitive fields from request body for safe logging.
 * Masks passwords, tokens, and secrets to prevent credential leaks in logs.
 */
const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) return null;

  const sensitiveKeys = ['password', 'token', 'secret', 'accessToken', 'refreshToken'];
  const sanitized = { ...body };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = '●●●●●●●●';
    }
  }
  return sanitized;
};

/**
 * Express middleware that logs every request/response cycle.
 */
export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString('id-ID', { hour12: false });

  // Capture the original res.json to log the response body
  const originalJson = res.json.bind(res);
  let responseBody = null;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Build the main log line
    const line = [
      `${colors.gray}[${timestamp}]${colors.reset}`,
      colorizeMethod(req.method.padEnd(6)),
      colorizeStatus(status),
      `${colors.white}${req.originalUrl}${colors.reset}`,
      `${colors.dim}→${colors.reset}`,
      formatDuration(duration),
    ].join(' ');

    console.log(line);

    // Log request details for non-GET requests (POST, PUT, DELETE, PATCH)
    if (req.method !== 'GET') {
      const body = sanitizeBody(req.body);
      if (body) {
        console.log(`  ${colors.gray}├─ Body:${colors.reset}`, JSON.stringify(body));
      }
    }

    // Log query params if present
    if (Object.keys(req.query).length > 0) {
      console.log(`  ${colors.gray}├─ Query:${colors.reset}`, JSON.stringify(req.query));
    }

    // Log authenticated user info if available
    if (req.user) {
      console.log(`  ${colors.gray}├─ User:${colors.reset} id=${req.user.id} role=${colors.magenta}${req.user.activeRole}${colors.reset}`);
    }

    // Log response message for error responses (4xx, 5xx)
    if (status >= 400 && responseBody) {
      const msg = responseBody.message || 'Unknown error';
      console.log(`  ${colors.gray}└─ Error:${colors.reset} ${colors.red}${msg}${colors.reset}`);
    }
  });

  next();
};
