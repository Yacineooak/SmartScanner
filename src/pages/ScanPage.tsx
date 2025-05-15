import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ScanFormData, ScanType } from '../types/scan';
import ScanForm from '../components/scans/ScanForm';
import ScanInProgress from '../components/scans/ScanInProgress';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const scanTypeLabels: Record<ScanType, string> = {
  tcp: 'TCP Port Scan',
  udp: 'UDP Port Scan',
  quick: 'Quick Scan',
  syn: 'SYN Scan',
  os: 'OS Detection',
  firewall: 'Firewall Detection',
  network: 'Local Network Scan',
  'multi-ip': 'Multi-IP Scan',
  banner: 'HTTP Banner Scanner',
  cve: 'CVE Vulnerability Check',
};

const ScanPage = () => {
  const { scanType = 'tcp' } = useParams<{ scanType: ScanType }>();
  const [isScanning, setIsScanning] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartScan = (formData: ScanFormData) => {
    setIsScanning(true);
    // In a real app, this would send the scan request to the backend
    // and get back a scan ID that we'd use to track progress
    setScanId('scan-' + Date.now().toString());
  };

  const handleScanComplete = (scanId: string) => {
    navigate(`/results/${scanId}`);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setScanId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{scanTypeLabels[scanType as ScanType]}</h2>
          <p className="text-muted-foreground">
            Configure and run your {scanTypeLabels[scanType as ScanType].toLowerCase()}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl">
        {isScanning && scanId ? (
          <ScanInProgress 
            scanId={scanId} 
            scanType={scanType as ScanType} 
            onComplete={handleScanComplete} 
            onCancel={handleCancelScan}
          />
        ) : (
          <ScanForm 
            scanType={scanType as ScanType} 
            onSubmit={handleStartScan} 
          />
        )}
      </div>
    </div>
  );
};

export default ScanPage;