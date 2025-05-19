import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScanResult, CVEInfo } from '../types/scan';

export const exportToPDF = (scanResults: ScanResult[], cveDetails: Record<string, CVEInfo[]>) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Scan Results Report', 14, 20);

  // Add scan summary
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Add results table
  const resultsData = scanResults.map(result => [
    result.ip,
    result.port?.toString() || 'N/A',
    result.service || 'N/A',
    result.status,
    result.cveCount?.toString() || '0'
  ]);

  autoTable(doc, {
    head: [['IP', 'Port', 'Service', 'Status', 'CVEs Found']],
    body: resultsData,
    startY: 40
  });

  // Add CVE details
  let y = doc.lastAutoTable.finalY + 20;
  doc.text('Vulnerability Details', 14, y);
  y += 10;

  Object.entries(cveDetails).forEach(([resultId, cves]) => {
    const result = scanResults.find(r => r.id === resultId);
    if (result && cves.length > 0) {
      const cveData = cves.map(cve => [
        cve.id,
        cve.severity,
        cve.cvssScore?.toString() || 'N/A',
        cve.description
      ]);

      autoTable(doc, {
        head: [['CVE ID', 'Severity', 'CVSS Score', 'Description']],
        body: cveData,
        startY: y
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  });

  doc.save('scan-results.pdf');
};

export const exportToCSV = (scanResults: ScanResult[], cveDetails: Record<string, CVEInfo[]>) => {
  let csv = 'IP,Port,Service,Status,CVEs Found\n';

  // Add scan results
  scanResults.forEach(result => {
    csv += `${result.ip},${result.port || 'N/A'},${result.service || 'N/A'},${result.status},${result.cveCount || 0}\n`;
  });

  // Add CVE details
  csv += '\nVulnerability Details\n';
  csv += 'CVE ID,Severity,CVSS Score,Description\n';

  Object.values(cveDetails).flat().forEach(cve => {
    csv += `${cve.id},${cve.severity},${cve.cvssScore || 'N/A'},"${cve.description}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'scan-results.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const exportToJSON = (scanResults: ScanResult[], cveDetails: Record<string, CVEInfo[]>) => {
  const data = {
    scanResults,
    vulnerabilities: cveDetails,
    metadata: {
      exportDate: new Date().toISOString(),
      totalFindings: scanResults.length,
      totalVulnerabilities: Object.values(cveDetails).flat().length
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'scan-results.json');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};