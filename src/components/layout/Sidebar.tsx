import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Search, 
  Zap, 
  Server, 
  Shield, 
  Network, 
  Files, 
  FileText, 
  History, 
  Settings,
  Users,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BarChart className="h-5 w-5" /> },
    { name: 'TCP Scan', path: '/scan/tcp', icon: <Search className="h-5 w-5" /> },
    { name: 'UDP Scan', path: '/scan/udp', icon: <Search className="h-5 w-5" /> },
    { name: 'Quick Scan', path: '/scan/quick', icon: <Zap className="h-5 w-5" /> },
    { name: 'SYN Scan', path: '/scan/syn', icon: <Server className="h-5 w-5" /> },
    { name: 'OS Detection', path: '/scan/os', icon: <Shield className="h-5 w-5" /> },
    { name: 'Firewall Detection', path: '/scan/firewall', icon: <Shield className="h-5 w-5" /> },
    { name: 'Network Scan', path: '/scan/network', icon: <Network className="h-5 w-5" /> },
    { name: 'Multi-IP Scan', path: '/scan/multi-ip', icon: <Files className="h-5 w-5" /> },
    { name: 'Banner Scanner', path: '/scan/banner', icon: <FileText className="h-5 w-5" /> },
    { name: 'CVE Check', path: '/scan/cve', icon: <Shield className="h-5 w-5" /> },
    { name: 'Scan History', path: '/history', icon: <History className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <Users className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background/95 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b border-border/40">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SmartScanner</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-border/40">
          <button 
            onClick={() => logout()} 
            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;