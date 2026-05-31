const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const DEFAULT_LEVEL = process.env.LOG_LEVEL || 'info';
type Level = keyof typeof LEVELS;

function shouldLog(level: Level) {
  return LEVELS[level] >= LEVELS[DEFAULT_LEVEL as Level];
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) console.debug('[debug]', ...args);
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.log('[info]', ...args);
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn('[warn]', ...args);
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error('[error]', ...args);
  },
};

export default logger;
