/**
 * Logger utility for handling development and production logging
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  log(...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  }
}

export const logger = new Logger();
