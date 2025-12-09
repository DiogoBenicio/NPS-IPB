const isProd = import.meta.env.PROD;

function formatMeta(meta: unknown): string {
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

const logger = {
  error: (message: string, meta?: unknown) => {
    // Only log errors in a compact form
    // Avoid verbose logs in production
    const output = `[ERROR] ${message}` + (meta ? ` - ${formatMeta(meta)}` : '');
    console.error(output);
  },
  info: (message: string, meta?: unknown) => {
    if (!isProd) console.info(`[INFO] ${message}` + (meta ? ` - ${formatMeta(meta)}` : ''));
  },
  warn: (message: string, meta?: unknown) => {
    if (!isProd) console.warn(`[WARN] ${message}` + (meta ? ` - ${formatMeta(meta)}` : ''));
  },
};

export default logger;
