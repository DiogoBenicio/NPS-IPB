const { version } = require('./package.json');

const REDACT_FIELDS = ['password', 'token'];

function redactRec(o) {
  if (!o || typeof o !== 'object') return o;
  for (const k of Object.keys(o)) {
    if (REDACT_FIELDS.includes(k.toLowerCase())) {
      o[k] = '[REDACTED]';
    } else if (typeof o[k] === 'object') {
      redactRec(o[k]);
    }
  }
  return o;
}

function redact(obj) {
  try {
    const copy = JSON.parse(JSON.stringify(obj));
    return redactRec(copy);
  } catch (e) {
    return obj;
  }
}

function formatLog(level, message, meta) {
  const output = {};
  output.ts = new Date().toISOString();
  output.level = level;
  output.message = message;
  output.service = 'nps-ipb-backend';
  output.version = version;
  output.meta = REDACT_FIELDS ? redact(meta) : meta;
  return JSON.stringify(output);
}

const logger = {
  info: (msg, meta) => console.log(formatLog('info', msg, meta)),
  warn: (msg, meta) => console.warn(formatLog('warn', msg, meta)),
  error: (msg, meta) => console.error(formatLog('error', msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') console.debug(formatLog('debug', msg, meta));
  },
};

module.exports = logger;
