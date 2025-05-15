import { useEffect, useState } from 'react';
import { ScanType } from '../../types/scan';
import { Button } from '../ui/button';
import { Ban, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface ScanInProgressProps {
  scanId: string;
  scanType: ScanType;
  onComplete: (scanId: string) => void;
  onCancel: () => void;
}

interface ScanProgress {
  percent: number;
  status: 'scanning' | 'analyzing' | 'complete' | 'failed';
  currentActivity: string;
  hostScanned: number;
  portsScanned: number;
  servicesDetected: number;
  vulnerabilitiesFound: number;
}

const ScanInProgress = ({ 
  scanId, 
  scanType, 
  onComplete, 
  onCancel 
}: ScanInProgressProps) => {
  const [progress, setProgress] = useState<ScanProgress>({
    percent: 0,
    status: 'scanning',
    currentActivity: 'Initializing scan...',
    hostScanned: 0,
    portsScanned: 0,
    servicesDetected: 0,
    vulnerabilitiesFound: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate a scan with progress updates
    const simulateScan = () => {
      let elapsed = 0;
      const totalTime = 10000; // 10 seconds for simulation
      const interval = 250; // Update every 250ms
      
      const updateProgress = setInterval(() => {
        elapsed += interval;
        const percent = Math.min(100, Math.floor((elapsed / totalTime) * 100));
        
        let status: ScanProgress['status'] = 'scanning';
        let currentActivity = 'Scanning ports...';
        
        if (percent >= 60 && percent < 80) {
          status = 'scanning';
          currentActivity = 'Detecting services...';
        } else if (percent >= 80 && percent < 100) {
          status = 'analyzing';
          currentActivity = 'Analyzing vulnerabilities...';
        } else if (percent >= 100) {
          status = 'complete';
          currentActivity = 'Scan complete!';
          clearInterval(updateProgress);
          
          setTimeout(() => {
            toast({
              title: "Scan Complete",
              description: `Your ${scanType} scan has completed successfully.`,
            });
            onComplete(scanId);
          }, 1000);
        }
        
        setProgress({
          percent,
          status,
          currentActivity,
          hostScanned: Math.min(1, Math.floor(percent / 10)),
          portsScanned: Math.floor((percent / 100) * (scanType === 'quick' ? 100 : 1000)),
          servicesDetected: Math.floor((percent / 100) * (scanType === 'os' ? 1 : Math.min(20, percent / 5))),
          vulnerabilitiesFound: Math.floor((percent / 100) * (scanType === 'cve' ? 12 : 5)),
        });
      }, interval);
      
      return () => clearInterval(updateProgress);
    };
    
    const timer = simulateScan();
    return () => timer();
  }, [scanId, scanType, onComplete, toast]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            {progress.status === 'scanning' && 'Scanning in progress...'}
            {progress.status === 'analyzing' && 'Analyzing results...'}
            {progress.status === 'complete' && 'Scan completed!'}
            {progress.status === 'failed' && 'Scan failed!'}
          </div>
          <div className="text-sm font-medium">{progress.percent}%</div>
        </div>
        
        <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              progress.status === 'failed' 
                ? 'bg-error-500' 
                : progress.percent < 100 
                  ? 'bg-primary' 
                  : 'bg-success-500'
            }`}
            style={{ width: `${progress.percent}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">{progress.currentActivity}</div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Hosts Scanned</div>
          <div className="text-2xl font-bold mt-1">{progress.hostScanned}</div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Ports Scanned</div>
          <div className="text-2xl font-bold mt-1">{progress.portsScanned}</div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Services Detected</div>
          <div className="text-2xl font-bold mt-1">{progress.servicesDetected}</div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Vulnerabilities</div>
          <div className={`text-2xl font-bold mt-1 ${
            progress.vulnerabilitiesFound > 0 ? 'text-error-500' : ''
          }`}>
            {progress.vulnerabilitiesFound}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div>
          {progress.status !== 'complete' && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="border-error-500 text-error-500 hover:bg-error-500/10"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel Scan
            </Button>
          )}
        </div>
        
        {progress.status === 'complete' && (
          <Button onClick={() => onComplete(scanId)} className="bg-success-500 hover:bg-success-600">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            View Results
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScanInProgress;