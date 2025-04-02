/**
 * Logger utility for VocaLearn extension
 * Provides logging functionality with different log levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

interface LoggerOptions {
  minLevel: LogLevel;
  prefix?: string;
  colorize?: boolean;
}

/**
 * Logger class for consistent logging throughout the extension
 */
export class Logger {
  private options: LoggerOptions;
  
  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      minLevel: LogLevel.INFO,
      prefix: '[VocaLearn]',
      colorize: true,
      ...options
    };
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.options.minLevel = level;
  }

  /**
   * Debug level logging
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, args);
  }

  /**
   * Info level logging
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  /**
   * Warning level logging
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  /**
   * Error level logging
   */
  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, args: any[]): void {
    if (level < this.options.minLevel) {
      return;
    }

    const prefix = this.options.prefix ? `${this.options.prefix} ` : '';
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${prefix}${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        break;
    }
  }
}

// Create a default logger instance
export const logger = new Logger();