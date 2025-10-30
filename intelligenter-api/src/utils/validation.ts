export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface DomainInput {
  domain: string;
  status?: 'onAnalysis' | 'ready';
  vt_data?: any;
  whois_data?: any;
}

// Validate domain input
export function validateDomain(data: any): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!data.domain || typeof data.domain !== 'string') {
    errors.push('Domain is required and must be a string');
  }

  // Validate domain format (basic domain name format)
  if (data.domain && !isValidDomain(data.domain)) {
    errors.push('Domain must be a valid domain name format');
  }

  // Validate status if provided
  if (data.status && !['onAnalysis', 'ready'].includes(data.status)) {
    errors.push('Status must be one of: onAnalysis, ready');
  }

  // Validate domain length
  if (data.domain && data.domain.length > 255) {
    errors.push('Domain must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Check if URL is valid
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Check if domain name is valid
function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

// Validate ID parameter
export function validateId(id: string): ValidationResult {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('ID is required');
  } else if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    errors.push('ID must be a positive integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sanitize input string
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Validate pagination parameters
export function validatePagination(page?: string, limit?: string): ValidationResult {
  const errors: string[] = [];
  
  if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
    errors.push('Page must be a positive integer');
  }
  
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}