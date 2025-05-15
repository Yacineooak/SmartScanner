import { ScanHistoryItem } from '../../types/scan';
import { formatDate, getStatusColor } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface RecentScansTableProps {
  scans: ScanHistoryItem[];
  isLoading?: boolean;
}

const RecentScansTable = ({ scans, isLoading = false }: RecentScansTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (scanId: string) => {
    navigate(`/results/${scanId}`);
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Target</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Findings</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-3 px-4">
                  <div className="h-4 w-20 bg-muted/20 rounded animate-pulse"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-32 bg-muted/20 rounded animate-pulse"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-28 bg-muted/20 rounded animate-pulse"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-muted/20 rounded animate-pulse"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 w-24 bg-muted/20 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No scans found. Start a new scan to see results here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-3 px-4 font-medium">Type</th>
            <th className="text-left py-3 px-4 font-medium">Target</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Findings</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr 
              key={scan.id} 
              className="border-b border-border/40 cursor-pointer hover:bg-muted/5"
              onClick={() => handleRowClick(scan.id)}
            >
              <td className="py-3 px-4 font-medium capitalize">{scan.scanType}</td>
              <td className="py-3 px-4">{scan.target}</td>
              <td className="py-3 px-4 text-muted-foreground">{formatDate(scan.timestamp)}</td>
              <td className="py-3 px-4">
                {scan.vulnerabilityCount > 0 ? (
                  <span className="text-error-500 font-medium">{scan.vulnerabilityCount}</span>
                ) : (
                  <span>None</span>
                )}
              </td>
              <td className="py-3 px-4">
                <span className={`status-badge ${getStatusColor(scan.status)}`}>
                  {scan.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentScansTable;