import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Shield, AlertTriangle } from 'lucide-react';

interface ScanRecord {
  id: string;
  timestamp: string;
  type: string;
  status: string;
  threatLevel: 'low' | 'medium' | 'high';
  findings: number;
}

const ScanHistoryPage = () => {
  const navigate = useNavigate();
  const [scans] = useState<ScanRecord[]>([
    {
      id: 'scan-001',
      timestamp: '2025-01-15 14:30',
      type: 'Network Scan',
      status: 'Completed',
      threatLevel: 'low',
      findings: 3
    },
    {
      id: 'scan-002',
      timestamp: '2025-01-14 09:15',
      type: 'Vulnerability Assessment',
      status: 'Completed',
      threatLevel: 'medium',
      findings: 7
    }
  ]);

  const getThreatLevelBadge = (level: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case 'low':
        return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Low</span>;
      case 'medium':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>Medium</span>;
      case 'high':
        return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>High</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scan History</h1>
        <Button
          onClick={() => navigate('/scan/network')}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          New Scan
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Threat Level</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {scan.timestamp.split(' ')[0]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {scan.timestamp.split(' ')[1]}
                  </div>
                </TableCell>
                <TableCell>{scan.type}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {scan.status}
                  </span>
                </TableCell>
                <TableCell>{getThreatLevelBadge(scan.threatLevel)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    {scan.findings}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/results/${scan.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScanHistoryPage;