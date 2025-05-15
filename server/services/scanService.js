import { v4 as uuidv4 } from 'uuid';

// Common services and port ranges
const commonPorts = {
  20: { service: 'FTP-data', protocol: 'tcp' },
  21: { service: 'FTP', protocol: 'tcp' },
  22: { service: 'SSH', protocol: 'tcp' },
  23: { service: 'Telnet', protocol: 'tcp' },
  25: { service: 'SMTP', protocol: 'tcp' },
  53: { service: 'DNS', protocol: 'tcp/udp' },
  80: { service: 'HTTP', protocol: 'tcp' },
  110: { service: 'POP3', protocol: 'tcp' },
  143: { service: 'IMAP', protocol: 'tcp' },
  443: { service: 'HTTPS', protocol: 'tcp' },
  465: { service: 'SMTPS', protocol: 'tcp' },
  993: { service: 'IMAPS', protocol: 'tcp' },
  995: { service: 'POP3S', protocol: 'tcp' },
  3306: { service: 'MySQL', protocol: 'tcp' },
  3389: { service: 'RDP', protocol: 'tcp' },
  5432: { service: 'PostgreSQL', protocol: 'tcp' },
  8080: { service: 'HTTP-Proxy', protocol: 'tcp' },
  8443: { service: 'HTTPS-Alt', protocol: 'tcp' },
};

// Function to simulate a TCP port scan
export const simulateTcpScan = async (target, portRangeStr = '1-1000', options = {}) => {
  // Parse port range
  const portRange = parsePortRange(portRangeStr);
  const results = [];
  
  // Generate random OS and hostname if needed
  const osInfo = simulateOsDetection();
  
  // Simulate scanning each port in the range
  for (const port of portRange) {
    // Randomly determine if port is open (20% chance)
    const isOpen = Math.random() < 0.2;
    
    if (isOpen) {
      const serviceInfo = commonPorts[port] || { 
        service: `unknown-${port}`, 
        protocol: 'tcp' 
      };
      
      // Add CVE count for interesting services
      let cveCount = 0;
      if (['HTTP', 'SSH', 'FTP', 'SMB', 'RDP', 'HTTPS'].includes(serviceInfo.service)) {
        cveCount = Math.floor(Math.random() * 5);
      }
      
      results.push({
        id: uuidv4(),
        ip: target,
        port,
        protocol: serviceInfo.protocol,
        service: serviceInfo.service,
        status: 'open',
        cveCount,
        osInfo: port === 445 ? osInfo : undefined, // Include OS info for SMB port
        timestamp: new Date().toISOString()
      });
    } else if (Math.random() < 0.3) {
      // Some ports show as filtered
      results.push({
        id: uuidv4(),
        ip: target,
        port,
        protocol: 'tcp',
        status: 'filtered',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Delay to simulate real scanning time
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));
  
  return results;
};

// Helper function to parse port range
function parsePortRange(rangeStr) {
  const ports = [];
  
  if (!rangeStr) {
    // Default to first 1000 ports
    for (let i = 1; i <= 1000; i++) {
      ports.push(i);
    }
    return ports;
  }
  
  // Handle multiple formats: "80,443", "1-1000", "80,443,8000-8010"
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Handle range like "1-1000"
      const [start, end] = part.split('-').map(p => parseInt(p.trim(), 10));
      for (let i = start; i <= end; i++) {
        ports.push(i);
      }
    } else {
      // Handle single port like "80"
      const port = parseInt(part.trim(), 10);
      if (!isNaN(port)) {
        ports.push(port);
      }
    }
  }
  
  return [...new Set(ports)]; // Remove duplicates
}

// Function to simulate OS detection
function simulateOsDetection() {
  const osList = [
    'Windows 10 Pro 21H2 (10.0 build 19044)',
    'Windows Server 2019 Standard',
    'Ubuntu 22.04.2 LTS (Jammy Jellyfish)',
    'Debian GNU/Linux 11 (bullseye)',
    'Red Hat Enterprise Linux 9.2',
    'macOS 13.4 (Ventura)',
    'FreeBSD 13.2-RELEASE',
    'Alpine Linux 3.17.3',
    'Cisco IOS 15.2(4)M7',
  ];
  
  return osList[Math.floor(Math.random() * osList.length)];
}