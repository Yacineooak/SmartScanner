import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download, Shield, AlertTriangle, Server, Network, FileJson } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ScanResult, CVEInfo, AIInsight } from '../types/scan';
import GeoLocationCard from '../components/dashboard/GeoLocationCard';
import { exportToPDF, exportToCSV, exportToJSON } from '../services/exportService';
import { useToast } from '../hooks/useToast';

interface ScanDetails {
  id: string;
  scanType: string;
  target: string;
  timestamp: string;
  status: string;
  results: ScanResult[];
  cveDetails: Record<string, CVEInfo[]>;
  insights?: AIInsight;
}

const ScanResultsPage = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [scanDetails, setScanDetails] = useState<ScanDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading scan details
    const loadScanDetails = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockDetails: ScanDetails = {
          id: scanId!,
          scanType: 'Network Scan',
          target: '192.168.1.0/24',
          timestamp: new Date().toISOString(),
          status: 'completed',
          results: [
            {
              id: 'result-1',
              ip: '192.168.1.1',
              port: 80,
              protocol: 'tcp',
              service: 'HTTP',
              status: 'open',
              cveCount: 2,
              timestamp: new Date().toISOString()
            },
            {
              id: 'result-2',
              ip: '192.168.1.1',
              port: 443,
              protocol: 'tcp',
              service: 'HTTPS',
              status: 'open',
              cveCount: 1,
              timestamp: new Date().toISOString()
            }
          ],
          cveDetails: {
            'result-1': [
              {
                id: 'CVE-2021-44228',
                description: 'Apache Log4j2 vulnerability allowing remote code execution',
                severity: 'critical',
                cvssScore: 10.0,
                references: ['https://nvd.nist.gov/vuln/detail/CVE-2021-44228']
              }
            ]
          },
          insights: {
            summary: 'The scan detected multiple high-risk vulnerabilities that require immediate attention.',
            riskLevel: 'high',
            recommendations: [
              'Update Apache Log4j2 to the latest version',
              'Implement network segmentation',
              'Review and update security policies'
            ]
          }
        };

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setScanDetails(mockDetails);
      } catch (error) {
        console.error('Error loading scan details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScanDetails();
  }, [scanId]);

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      if (!scanDetails) return;

      switch (format) {
        case 'pdf':
          exportToPDF(scanDetails.results, scanDetails.cveDetails);
          break;
        case 'csv':
          exportToCSV(scanDetails.results, scanDetails.cveDetails);
          break;
        case 'json':
          exportToJSON(scanDetails.results, scanDetails.cveDetails);
          break;
      }

      toast({
        title: 'Export Successful',
        description: `Results exported in ${format.toUpperCase()} format`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export results. Please try again.',
        variant: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <div className="text-xl font-bold text-primary">Loading Results</div>
          <div className="text-sm text-muted-foreground mt-2">Fetching scan details...</div>
        </div>
      </div>
    );
  }

  if (!scanDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Scan Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested scan results could not be found.
          </p>
          <Button onClick={() => navigate('/history')}>
            View Scan History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/history')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Scan Results</h1>
            <p className="text-muted-foreground">
              {scanDetails.scanType} - {scanDetails.target}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <FileJson className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Security Overview</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className="text-2xl font-bold text-error-500">High</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Findings</p>
              <p className="text-2xl font-bold">{scanDetails.results.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Scan Statistics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Open Ports</p>
              <p className="text-2xl font-bold">
                {scanDetails.results.filter(r => r.status === 'open').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Services Detected</p>
              <p className="text-2xl font-bold">
                {new Set(scanDetails.results.map(r => r.service)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Network Coverage</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Hosts Scanned</p>
              <p className="text-2xl font-bold">
                {new Set(scanDetails.results.map(r => r.ip)).size}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scan Duration</p>
              <p className="text-2xl font-bold">5m 32s</p>
            </div>
          </div>
        </div>

        <GeoLocationCard ip={scanDetails.target} isLoading={isLoading} />
      </div>

      {scanDetails.insights && (
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-4">AI Insights</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">{scanDetails.insights.summary}</p>
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-2">
                {scanDetails.insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-muted-foreground">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium">Detailed Findings</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CVEs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanDetails.results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.ip}</TableCell>
                <TableCell>{result.port}</TableCell>
                <TableCell>{result.service}</TableCell>
                <TableCell>{result.protocol}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'open'
                      ? 'bg-success-500/10 text-success-500'
                      : result.status === 'filtered'
                      ? 'bg-warning-500/10 text-warning-500'
                      : 'bg-error-500/10 text-error-500'
                  }`}>
                    {result.status}
                  </span>
                </TableCell>
                <TableCell>
                  {result.cveCount > 0 ? (
                    <span className="text-error-500 font-medium">
                      {result.cveCount} found
                    </span>
                  ) : (
                    <span className="text-success-500">None</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScanResultsPage;