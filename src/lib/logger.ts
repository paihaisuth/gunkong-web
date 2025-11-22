/**
 * Logger utility to replace console.log
 * Automatically disabled in production to prevent sensitive data leakage
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

const isDevelopment = process.env.NODE_ENV === 'development'

class Logger {
    private log(level: LogLevel, ...args: unknown[]) {
        if (!isDevelopment) {
            // In production, only log errors
            if (level === 'error') {
                console.error(...args)
            }
            return
        }

        // In development, log everything
        switch (level) {
            case 'log':
                console.log(...args)
                break
            case 'info':
                console.info(...args)
                break
            case 'warn':
                console.warn(...args)
                break
            case 'error':
                console.error(...args)
                break
            case 'debug':
                console.debug(...args)
                break
        }
    }

    /**
     * Log general information (development only)
     */
    info(...args: unknown[]) {
        this.log('log', ...args)
    }

    /**
     * Log warning messages (development only)
     */
    warn(...args: unknown[]) {
        this.log('warn', ...args)
    }

    /**
     * Log error messages (always logged)
     */
    error(...args: unknown[]) {
        this.log('error', ...args)
    }

    /**
     * Log debug information (development only)
     */
    debug(...args: unknown[]) {
        this.log('debug', ...args)
    }
}

export const logger = new Logger()
