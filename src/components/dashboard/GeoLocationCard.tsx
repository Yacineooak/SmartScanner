import { useState, useEffect } from 'react';
import { Globe2, MapPin } from 'lucide-react';
import { getIpLocation } from '../../services/geoipService';

interface GeoLocationCardProps {
  ip: string;
  isLoading?: boolean;
}

const GeoLocationCard = ({ ip, isLoading = false }: GeoLocationCardProps) => {
  const [locationData, setLocationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getIpLocation(ip);
        setLocationData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch location data');
        console.error(err);
      }
    };

    if (ip && !isLoading) {
      fetchLocation();
    }
  }, [ip, isLoading]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl animate-pulse">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 bg-primary/20 rounded-full"></div>
          <div className="h-4 w-24 bg-primary/20 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-3/4 bg-muted/20 rounded"></div>
          <div className="h-4 w-1/2 bg-muted/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Globe2 className="h-5 w-5 text-error-500" />
          <h3 className="font-medium">Location Data Unavailable</h3>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Globe2 className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Target Location</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {locationData.city}, {locationData.regionName}, {locationData.country}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <div>ISP: {locationData.isp}</div>
          <div>Timezone: {locationData.timezone}</div>
          <div className="mt-2">
            Coordinates: {locationData.lat}, {locationData.lon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoLocationCard;