import net from 'net';
import { promisify } from 'util';
import { exec } from 'child_process';
import { searchVulnerabilities } from './nvdService.js';

const execAsync = promisify(exec);

export const scanPort = async (host, port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 1000;
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      let service = getCommonService(port);
      socket.write('HEAD / HTTP/1.0\r\n\r\n');
      
      socket.once('data', (data) => {
        const banner = data.toString().split('\n')[0];
        socket.destroy();
        resolve({
          port,
          status: 'open',
          service,
          banner
        });
      });
      
      setTimeout(() => {
        socket.destroy();
        resolve({
          port,
          status: 'open',
          service: getCommonService(port)
        });
      }, 200);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve({
        port,
        status: 'filtered'
      });
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve({
        port,
        status: 'closed'
      });
    });
    
    socket.connect(port, host);
  });
};

const getCommonService = (port) => {
  const services = {
    20: 'FTP-data',
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    3306: 'MySQL',
    5432: 'PostgreSQL',
    8080: 'HTTP-Proxy'
  };
  return services[port] || `port-${port}`;
};

export const scanTarget = async (target, portRange) => {
  const results = [];
  const [startPort, endPort] = portRange.split('-').map(Number);
  
  for (let port = startPort; port <= endPort; port++) {
    const result = await scanPort(target, port);
    if (result.status !== 'closed') {
      results.push(result);
    }
  }
  
  // Fetch vulnerabilities for detected services
  for (const result of results) {
    if (result.service) {
      try {
        const cpe = `cpe:2.3:a:*:${result.service.toLowerCase()}:*:*:*:*:*:*:*:*`;
        const vulns = await searchVulnerabilities(cpe);
        result.vulnerabilities = vulns;
      } catch (error) {
        console.error(`Failed to fetch vulnerabilities for ${result.service}:`, error);
      }
    }
  }
  
  return results;
};

export const detectOS = async (target) => {
  try {
    const { stdout } = await execAsync(`nmap -O ${target}`);
    const osMatch = stdout.match(/OS details: (.+)/);
    return osMatch ? osMatch[1] : 'Unknown';
  } catch (error) {
    console.error('OS detection failed:', error);
    return 'Detection failed';
  }
};