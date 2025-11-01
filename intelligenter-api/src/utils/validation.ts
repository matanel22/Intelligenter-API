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


export function validateDomain(data: any): ValidationResult {
  const errors: string[] = [];

 console.log(data);
 
  if (!data.domain || typeof data.domain !== 'string') {
    errors.push('Domain is required and must be a string');
  }

  
  if (data.domain && !isValidDomain(data.domain)) {
    errors.push('Domain must be a valid domain name format');
  }


  if (data.status && !['onAnalysis', 'ready'].includes(data.status)) {
    errors.push('Status must be one of: onAnalysis, ready');
  }

 
  if (data.domain && data.domain.length > 255) {
    errors.push('Domain must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDomainUpdate(data: any): ValidationResult {
  const errors: string[] = [];


  if (data.domain && !isValidDomain(data.domain)) {
    errors.push('Domain must be a valid domain name format');
  }

  if (data.status && !['onAnalysis', 'ready'].includes(data.status)) {
    errors.push('Status must be one of: onAnalysis, ready');
  }


  if (data.reputation_score !== undefined) {
    if (typeof data.reputation_score !== 'number' || data.reputation_score < 0 || data.reputation_score > 100) {
      errors.push('Reputation score must be a number between 0 and 100');
    }
  }


  if (data.is_malicious !== undefined && typeof data.is_malicious !== 'boolean') {
    errors.push('is_malicious must be a boolean');
  }

  if (data.domain && data.domain.length > 255) {
    errors.push('Domain must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}


function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}


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


export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}


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