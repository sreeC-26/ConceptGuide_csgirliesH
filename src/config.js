/**
 * Application Configuration
 * 
 * This file centralizes configuration values that may differ
 * between development and production environments.
 */

/**
 * Backend API URL
 * - In development: http://localhost:3001
 * - In production: Set VITE_API_URL environment variable in Vercel
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  GENERATE_QUESTIONS: `${API_URL}/api/generate-questions`,
  CLEAN_PDF_CONTENT: `${API_URL}/api/clean-pdf-content`,
  GENERATE_INSIGHTS: `${API_URL}/api/generate-insights`,
  ANALYZE_AND_GENERATE_PATH: `${API_URL}/api/analyze-and-generate-path`,
};

/**
 * Check if we're in production
 */
export const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Check if we're in development
 */
export const IS_DEVELOPMENT = import.meta.env.DEV;

