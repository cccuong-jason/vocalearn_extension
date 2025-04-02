/**
 * Performance Monitor utility for VocaLearn extension
 * Provides functionality to measure and log performance metrics
 */
import { logger } from './logger';
/**
 * Performance Monitor class for tracking operation execution times
 */
export class PerformanceMonitor {
    constructor(enabled = true) {
        this.entries = new Map();
        this.enabled = enabled;
    }
    /**
     * Enable or disable performance monitoring
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Start measuring performance for an operation
     * @param name Name of the operation being measured
     * @param metadata Additional data to associate with this measurement
     * @returns The name of the operation (for chaining with end)
     */
    start(name, metadata) {
        if (!this.enabled) {
            return name;
        }
        const entry = {
            name,
            startTime: performance.now(),
            metadata
        };
        this.entries.set(name, entry);
        return name;
    }
    /**
     * End measuring performance for an operation
     * @param name Name of the operation being measured
     * @param logResult Whether to log the result immediately
     * @returns Duration in milliseconds or undefined if operation wasn't found
     */
    end(name, logResult = false) {
        if (!this.enabled) {
            return undefined;
        }
        const entry = this.entries.get(name);
        if (!entry) {
            logger.warn(`Performance measurement '${name}' not found`);
            return undefined;
        }
        entry.endTime = performance.now();
        entry.duration = entry.endTime - entry.startTime;
        if (logResult) {
            this.logMeasurement(name);
        }
        return entry.duration;
    }
    /**
     * Log a specific measurement
     * @param name Name of the operation to log
     */
    logMeasurement(name) {
        if (!this.enabled) {
            return;
        }
        const entry = this.entries.get(name);
        if (!entry || entry.duration === undefined) {
            logger.warn(`Cannot log measurement '${name}': measurement not completed`);
            return;
        }
        const metadataStr = entry.metadata ? ` (metadata: ${JSON.stringify(entry.metadata)})` : '';
        logger.info(`Performance '${name}': ${entry.duration.toFixed(2)}ms${metadataStr}`);
    }
    /**
     * Log all completed measurements
     */
    logAllMeasurements() {
        if (!this.enabled || this.entries.size === 0) {
            return;
        }
        logger.info('==== Performance Measurements ====');
        const completedEntries = Array.from(this.entries.values())
            .filter(entry => entry.duration !== undefined)
            .sort((a, b) => (b.duration || 0) - (a.duration || 0));
        for (const entry of completedEntries) {
            const metadataStr = entry.metadata ? ` (metadata: ${JSON.stringify(entry.metadata)})` : '';
            logger.info(`'${entry.name}': ${entry.duration?.toFixed(2)}ms${metadataStr}`);
        }
        logger.info('================================');
    }
    /**
     * Clear all measurements
     */
    clear() {
        this.entries.clear();
    }
    /**
     * Measure the execution time of an async function
     * @param name Name of the operation
     * @param fn Function to measure
     * @param logResult Whether to log the result immediately
     * @returns The result of the function
     */
    async measure(name, fn, logResult = false) {
        this.start(name);
        try {
            const result = await fn();
            this.end(name, logResult);
            return result;
        }
        catch (error) {
            this.end(name, logResult);
            throw error;
        }
    }
    /**
     * Measure the execution time of a synchronous function
     * @param name Name of the operation
     * @param fn Function to measure
     * @param logResult Whether to log the result immediately
     * @returns The result of the function
     */
    measureSync(name, fn, logResult = false) {
        this.start(name);
        try {
            const result = fn();
            this.end(name, logResult);
            return result;
        }
        catch (error) {
            this.end(name, logResult);
            throw error;
        }
    }
}
// Create a default performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
