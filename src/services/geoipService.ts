import { delay } from '../lib/utils';

interface GeoIPResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export async function getIpLocation(ip: string): Promise<GeoIPResponse> {
  try {
    // Handle offline mode
    if (!navigator.onLine) {
      const cachedData = localStorage.getItem(`geoip-${ip}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      throw new Error('Offline - No cached data available');
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP location');
    }
    
    const data = await response.json();
    
    // Cache the data for offline use
    localStorage.setItem(`geoip-${ip}`, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching IP location:', error);
    throw error;
  }
}