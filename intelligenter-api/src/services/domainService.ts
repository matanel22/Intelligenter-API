import { db } from '../db/knex.js';

export interface Domain {
  id?: number;
  domain: string;
  status: 'onAnalysis' | 'ready';
  vt_data?: any;
  whois_data?: any;
  reputation_score?: number;
  is_malicious?: boolean;
  last_updated?: Date;
  created_at?: Date;
}

export interface ApiRequest {
  id?: number;
  method: string;
  endpoint: string;
  headers?: any;
  query_params?: any;
  body?: any;
  ip_address?: string;
  user_agent?: string;
  status_code?: number;
  response_data?: any;
  response_time_ms?: number;
  created_at?: Date;
}

export interface DomainAnalysis {
  domain_id: number;
  score: number;
  metrics: {
    performance: number;
    seo: number;
    security: number;
    accessibility: number;
  };
  suggestions: string[];
  analyzed_at: Date;
}


export const createDomain = async (domainData: Omit<Domain, 'id' | 'created_at'>): Promise<Domain> => {
  const [domain] = await db('domains')
    .insert({
      ...domainData,
      created_at: new Date()
    })
    .returning('*');
  
  return domain;
};


export const getAllDomains = async (): Promise<Domain[]> => {
  return await db('domains').select('*').orderBy('created_at', 'desc');
};

export const getDomainById = async (id: number): Promise<Domain | undefined> => {
  return await db('domains').where({ id }).first();
};


export const getDomainByName = async (domainName: string): Promise<Domain | undefined> => {
  return await db('domains').where({ domain: domainName }).first();
};


export const updateDomain = async (id: number, domainData: Partial<Domain>): Promise<Domain> => {
  const [domain] = await db('domains')
    .where({ id })
    .update({
      ...domainData,
      last_updated: new Date()
    })
    .returning('*');
  
  return domain;
};


export const deleteDomain = async (id: number): Promise<void> => {
  await db('domains').where({ id }).del();
};


/**
 * Simulates VirusTotal API call
 * In production, this would call: https://www.virustotal.com/api/v3/domains/{domain}
 */
const simulateVirusTotalQuery = async (domain: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const maliciousVotes = Math.floor(Math.random() * 5);
  const cleanVotes = Math.floor(Math.random() * 80) + 20;
  
  return {
    data: {
      id: domain,
      type: 'domain',
      attributes: {
        last_analysis_stats: {
          malicious: maliciousVotes,
          suspicious: Math.floor(Math.random() * 3),
          undetected: Math.floor(Math.random() * 10) + 70,
          harmless: cleanVotes,
          timeout: 0
        },
        reputation: cleanVotes - maliciousVotes,
        last_analysis_date: Math.floor(Date.now() / 1000),
        categories: {
          'Dr.Web': 'clean site',
          'Forcepoint ThreatSeeker': 'business',
          'Webroot': 'technology'
        },
        popularity_ranks: {
          'Alexa': {
            rank: Math.floor(Math.random() * 1000000) + 1000,
            timestamp: Math.floor(Date.now() / 1000)
          }
        }
      }
    }
  };
};

/**
 * Simulates Whois API call
 * In production, this would call a Whois service or use node-whois library
 */
const simulateWhoisQuery = async (domain: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const registrars = ['GoDaddy', 'Namecheap', 'Google Domains', 'Cloudflare', 'Network Solutions'];
  const statuses = ['clientTransferProhibited', 'clientUpdateProhibited', 'ok'];
  const selectedRegistrar = registrars[Math.floor(Math.random() * registrars.length)] || 'GoDaddy';
  
  const creationDate = new Date();
  creationDate.setFullYear(creationDate.getFullYear() - Math.floor(Math.random() * 10) - 1);
  
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + Math.floor(Math.random() * 3) + 1);
  
  return {
    domain_name: domain.toUpperCase(),
    registrar: selectedRegistrar,
    registrar_whois_server: `whois.${selectedRegistrar.toLowerCase().replace(' ', '')}.com`,
    creation_date: creationDate.toISOString(),
    expiration_date: expirationDate.toISOString(),
    updated_date: new Date().toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    name_servers: [
      'ns1.example.com',
      'ns2.example.com'
    ],
    dnssec: Math.random() > 0.5 ? 'unsigned' : 'signedDelegation',
    emails: [
      'abuse@registrar.com',
      'admin@' + domain
    ]
  };
};

/**
 * Analyzes a domain by simulating VirusTotal and Whois queries
 * Updates the database with the analysis results
 */
export const analyzeDomain = async (domainName: string): Promise<Domain> => {
  // Get domain from database
  const domain = await getDomainByName(domainName);
  if (!domain || !domain.id) {
    throw new Error('Domain not found');
  }

  // Update status to 'onAnalysis'
  await updateDomain(domain.id, { status: 'onAnalysis' });

  console.log(`🔍 Starting analysis for: ${domainName}`);

  // Simulate VirusTotal query
  console.log(`📡 Querying VirusTotal for ${domainName}...`);
  const vtData = await simulateVirusTotalQuery(domainName);
  
  // Simulate Whois query
  console.log(`📡 Querying Whois for ${domainName}...`);
  const whoisData = await simulateWhoisQuery(domainName);

  // Calculate reputation score based on VT data
  const vtStats = vtData.data.attributes.last_analysis_stats;
  const reputationScore = Math.max(0, Math.min(100, 
    Math.floor((vtStats.harmless / (vtStats.harmless + vtStats.malicious + vtStats.suspicious)) * 100)
  ));


  const isMalicious = vtStats.malicious > 5 || reputationScore < 50;

 
  const analysis: DomainAnalysis = {
    domain_id: domain.id,
    score: reputationScore,
    metrics: {
      performance: Math.floor(Math.random() * 30) + 70,
      seo: Math.floor(Math.random() * 30) + 70,
      security: reputationScore,
      accessibility: Math.floor(Math.random() * 30) + 70
    },
    suggestions: isMalicious ? [
      '⚠️ Domain flagged as potentially malicious',
      '🔒 Review security settings',
      '📧 Check email authentication (SPF, DKIM, DMARC)',
      '🛡️ Consider additional security monitoring'
    ] : [
      '✅ Domain appears safe',
      '🔐 Maintain HTTPS security',
      '📊 Monitor domain reputation regularly',
      '🔄 Keep domain registration up to date'
    ],
    analyzed_at: new Date()
  };

  console.log('📝 Analysis object:', JSON.stringify(analysis, null, 2));

  
  await db.raw(`
    INSERT INTO domain_analyses (domain_id, score, metrics, suggestions, analyzed_at)
    VALUES (?, ?, ?::jsonb, ?::jsonb, ?)
  `, [
    analysis.domain_id,
    analysis.score,
    JSON.stringify(analysis.metrics),
    JSON.stringify(analysis.suggestions),
    analysis.analyzed_at
  ]);


  await db.raw(`
    UPDATE domains
    SET status = ?, vt_data = ?::jsonb, whois_data = ?::jsonb,
        reputation_score = ?, is_malicious = ?, last_updated = ?
    WHERE id = ?
  `, [
    'ready',
    JSON.stringify(vtData),
    JSON.stringify(whoisData),
    reputationScore,
    isMalicious,
    new Date(),
    domain.id
  ]);
  
  // Fetch updated domain
  const updatedDomain = await getDomainById(domain.id);
  if (!updatedDomain) {
    throw new Error('Failed to retrieve updated domain');
  }

  console.log(`✅ Analysis complete for ${domainName} - Score: ${reputationScore}/100`);

  return updatedDomain;
};


export const getDomainStatus = async (id: number): Promise<{ status: string; last_updated?: Date | undefined }> => {
  const domain = await getDomainById(id);
  if (!domain) {
    throw new Error('Domain not found');
  }

  return {
    status: domain.status,
    last_updated: domain.last_updated
  };
};


export const getLatestAnalysis = async (domainId: number): Promise<DomainAnalysis | undefined> => {
  return await db('domain_analyses')
    .where({ domain_id: domainId })
    .orderBy('analyzed_at', 'desc')
    .first();
};


export const logRequest = async (requestData: Omit<ApiRequest, 'id' | 'created_at'>): Promise<ApiRequest> => {
  const [request] = await db('requests')
    .insert({
      ...requestData,
      created_at: new Date()
    })
    .returning('*');
  
  return request;
};


export const getAllRequests = async (limit: number = 100): Promise<ApiRequest[]> => {
  return await db('requests')
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit);
};

