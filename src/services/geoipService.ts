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
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch IP location');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching IP location:', error);
    throw error;
  }
}