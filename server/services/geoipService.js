import axios from 'axios';

const IP_API_URL = 'http://ip-api.com/json';

export const getIpLocation = async (ip) => {
  try {
    const response = await axios.get(`${IP_API_URL}/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,reverse,mobile,proxy,hosting`);
    
    if (response.data.status === 'fail') {
      throw new Error(response.data.message);
    }

    return {
      ip: response.data.query,
      country: response.data.country,
      countryCode: response.data.countryCode,
      region: response.data.region,
      regionName: response.data.regionName,
      city: response.data.city,
      zip: response.data.zip,
      lat: response.data.lat,
      lon: response.data.lon,
      timezone: response.data.timezone,
      isp: response.data.isp,
      org: response.data.org,
      as: response.data.as,
      reverse: response.data.reverse,
      mobile: response.data.mobile,
      proxy: response.data.proxy,
      hosting: response.data.hosting
    };
  } catch (error) {
    console.error('GeoIP lookup failed:', error);
    throw new Error('Failed to fetch location data');
  }
};

// Cache GeoIP data for offline use
const geoipCache = new Map();

export const getCachedLocation = (ip) => {
  return geoipCache.get(ip);
};

export const cacheLocation = (ip, data) => {
  geoipCache.set(ip, data);
};