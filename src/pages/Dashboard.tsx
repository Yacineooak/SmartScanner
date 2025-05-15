import { BarChart3, Shield, Server, Network, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScanHistoryItem } from '../types/scan';
import { formatDate } from '../lib/utils';
import StatisticCard from '../components/dashboard/StatisticCard';
import RecentScansTable from '../components/dashboard/RecentScansTable';
import VulnerabilityChart from '../components/dashboard/VulnerabilityChart';
import TopThreatsCard from '../components/dashboard/TopThreatsCard';
import { fetchDashboardStats, fetchRecentScans } from '../services/dashboardService';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalScans: number;
  totalVulnerabilities: number;
  openPorts: number;
  scannedHosts: number;
  criticalVulnerabilities: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    totalVulnerabilities: 0,
    openPorts: 0,
    scannedHosts: 0,
    criticalVulnerabilities: 0,
  });
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [dashboardStats, scans] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentScans(5)
        ]);
        setStats(dashboardStats);
        setRecentScans(scans);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your security overview and recent scanning activity
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-primary hover:bg-primary/90" 
            onClick={() => navigate('/scan/quick')}
          >
            <Shield className="mr-2 h-4 w-4" /> New Quick Scan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Scans"
          value={stats.totalScans}
          icon={<BarChart3 className="h-5 w-5" />}
          isLoading={isLoading}
          change={{ value: 12, type: 'increase' }}
        />
        <StatisticCard
          title="Total Vulnerabilities"
          value={stats.totalVulnerabilities}
          icon={<AlertTriangle className="h-5 w-5" />}
          isLoading={isLoading}
          change={{ value: 8, type: 'increase' }}
        />
        <StatisticCard
          title="Open Ports"
          value={stats.openPorts}
          icon={<Server className="h-5 w-5" />}
          isLoading={isLoading}
          change={{ value: 3, type: 'increase' }}
        />
        <StatisticCard
          title="Scanned Hosts"
          value={stats.scannedHosts}
          icon={<Network className="h-5 w-5" />}
          isLoading={isLoading}
          change={{ value: 5, type: 'increase' }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Vulnerability Trends</h3>
          <div className="h-[300px]">
            <VulnerabilityChart isLoading={isLoading} />
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Top Security Threats</h3>
          <TopThreatsCard isLoading={isLoading} />
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Scans</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/history')}
          >
            View All
          </Button>
        </div>
        <RecentScansTable scans={recentScans} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;