/**
 * Logger utility for VocaLearn extension
 * Provides logging functionality with different log levels
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
/**
 * Logger class for consistent logging throughout the extension
 */
export class Logger {
    constructor(options = {}) {
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
    setLogLevel(level) {
        this.options.minLevel = level;
    }
    /**
     * Debug level logging
     */
    debug(message, ...args) {
        this.log(LogLevel.DEBUG, message, args);
    }
    /**
     * Info level logging
     */
    info(message, ...args) {
        this.log(LogLevel.INFO, message, args);
    }
    /**
     * Warning level logging
     */
    warn(message, ...args) {
        this.log(LogLevel.WARN, message, args);
    }
    /**
     * Error level logging
     */
    error(message, ...args) {
        this.log(LogLevel.ERROR, message, args);
    }
    /**
     * Internal log method
     */
    log(level, message, args) {
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
