// API error handling utilities

export class ApiError extends Error {
  constructor(message, statusCode = 500, originalError = null) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = 'ApiError';
  }
}

export const handleSupabaseError = (error) => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      statusCode: 500,
      isUserError: false
    };
  }

  const baseError = {
    statusCode: error.status || 500,
    originalError: error,
    isUserError: false
  };

  // Supabase specific errors
  if (error.message === 'Email not confirmed') {
    return {
      ...baseError,
      message: 'Please verify your email before logging in',
      statusCode: 403,
      isUserError: true
    };
  }

  if (error.message?.includes('Invalid login credentials')) {
    return {
      ...baseError,
      message: 'Invalid email or password',
      statusCode: 401,
      isUserError: true
    };
  }

  if (error.message?.includes('rate limit')) {
    return {
      ...baseError,
      message: 'Too many requests. Please wait a few moments before trying again',
      statusCode: 429,
      isUserError: true
    };
  }

  if (error.message?.includes('user already exists')) {
    return {
      ...baseError,
      message: 'This email is already registered',
      statusCode: 409,
      isUserError: true
    };
  }

  // Network errors
  if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
    return {
      ...baseError,
      message: 'Network error - please check your connection',
      statusCode: 0,
      isUserError: true
    };
  }

  // Generic fallback
  return {
    ...baseError,
    message: error.message || 'An error occurred. Please try again',
    isUserError: false
  };
};

export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent
  };

  console.error('Error logged:', errorLog);

  // Send to error tracking service (e.g., Sentry, LogRocket)
  // If you set up Sentry:
  // Sentry.captureException(error, { contexts: { custom: context } });

  // Or send to your own backend:
  // fetch('/api/logs', { method: 'POST', body: JSON.stringify(errorLog) });
};

export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
};
