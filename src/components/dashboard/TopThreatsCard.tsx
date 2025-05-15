import { Shield, AlertTriangle } from 'lucide-react';
import { cn, getSeverityColor } from '../../lib/utils';

interface Threat {
  id: string;
  name: string;
  cveId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedSystems: number;
  description: string;
}

interface TopThreatsCardProps {
  isLoading?: boolean;
}

const TopThreatsCard = ({ isLoading = false }: TopThreatsCardProps) => {
  // Mock threats data
  const threats: Threat[] = [
    {
      id: '1',
      name: 'OpenSSL Vulnerability',
      cveId: 'CVE-2023-0286',
      severity: 'critical',
      affectedSystems: 12,
      description: 'X.509 certificate verification bypass via subject name.'
    },
    {
      id: '2',
      name: 'Apache Log4j RCE',
      cveId: 'CVE-2021-44228',
      severity: 'critical',
      affectedSystems: 8,
      description: 'Remote code execution vulnerability in Log4j logging library.'
    },
    {
      id: '3',
      name: 'Windows SMB Remote Code Execution',
      cveId: 'CVE-2022-24500',
      severity: 'high',
      affectedSystems: 5,
      description: 'Remote code execution vulnerability in Windows SMB.'
    },
    {
      id: '4',
      name: 'Linux Kernel Privilege Escalation',
      cveId: 'CVE-2022-2602',
      severity: 'high',
      affectedSystems: 3,
      description: 'Local privilege escalation vulnerability in the Linux kernel.'
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-border/40">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-4 w-32 bg-muted/20 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-muted/20 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-muted/20 rounded animate-pulse"></div>
            </div>
            <div className="mt-3 h-3 w-full bg-muted/20 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threats.map((threat) => (
        <div
          key={threat.id}
          className="p-4 rounded-lg border border-border/40 transition-all hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{threat.name}</h4>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Shield className="h-3 w-3 mr-1" />
                <span>{threat.cveId}</span>
              </div>
            </div>
            <div className={cn("flex items-center text-sm px-2 py-1 rounded-full", getSeverityColor(threat.severity))}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="capitalize">{threat.severity}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{threat.description}</p>
          <div className="mt-2 text-sm">
            <span className="font-medium">{threat.affectedSystems}</span>
            <span className="text-muted-foreground ml-1">affected systems</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopThreatsCard;