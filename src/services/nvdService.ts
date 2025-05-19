import axios from 'axios';
import { delay } from '../lib/utils';

const NVD_API_KEY = '00b2d1ae-fe9e-4cf8-9b20-32e62f3bbc2a';
const NVD_API_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

// Create axios instance with default config
const nvdApi = axios.create({
  baseURL: NVD_API_URL,
  headers: {
    'apiKey': NVD_API_KEY
  }
});

// Cache for offline support
const vulnerabilityCache = new Map();

export const searchVulnerabilities = async (cpe: string) => {
  try {
    // Check offline status
    if (!navigator.onLine) {
      const cachedData = vulnerabilityCache.get(cpe);
      if (cachedData) {
        return cachedData;
      }
      throw new Error('Offline - No cached data available');
    }

    const response = await nvdApi.get('', {
      params: {
        cpeName: cpe,
        resultsPerPage: 20
      }
    });

    const results = response.data.vulnerabilities.map(vuln => ({
      id: vuln.cve.id,
      description: vuln.cve.descriptions.find(d => d.lang === 'en')?.value,
      severity: calculateSeverity(vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore),
      cvssScore: vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
      publishedDate: vuln.cve.published,
      lastModified: vuln.cve.lastModified,
      references: vuln.cve.references?.map(ref => ref.url) || []
    }));

    // Cache the results
    vulnerabilityCache.set(cpe, results);

    return results;
  } catch (error) {
    console.error('NVD API Error:', error);
    throw error;
  }
};

const calculateSeverity = (score: number): string => {
  if (!score) return 'unknown';
  if (score >= 9.0) return 'critical';
  if (score >= 7.0) return 'high';
  if (score >= 4.0) return 'medium';
  return 'low';
};

export const getVulnerabilityDetails = async (cveId: string) => {
  try {
    if (!navigator.onLine) {
      const cachedData = localStorage.getItem(`cve-${cveId}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      throw new Error('Offline - No cached data available');
    }

    const response = await nvdApi.get('', {
      params: {
        cveId: cveId
      }
    });

    const vuln = response.data.vulnerabilities[0].cve;
    const details = {
      id: vuln.id,
      description: vuln.descriptions.find(d => d.lang === 'en')?.value,
      severity: calculateSeverity(vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore),
      cvssScore: vuln.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
      publishedDate: vuln.published,
      lastModified: vuln.lastModified,
      references: vuln.references?.map(ref => ref.url) || [],
      configurations: vuln.configurations || []
    };

    // Cache the details
    localStorage.setItem(`cve-${cveId}`, JSON.stringify(details));

    return details;
  } catch (error) {
    console.error('NVD API Error:', error);
    throw error;
  }
};