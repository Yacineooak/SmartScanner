import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { Readable } from 'stream';

export const generatePDF = async (scan) => {
  const doc = new PDFDocument();
  
  // Add header
  doc.fontSize(20).text('SmartScanner Scan Report', { align: 'center' });
  doc.moveDown();
  
  // Add scan details
  doc.fontSize(12)
    .text(`Scan ID: ${scan.id}`)
    .text(`Target: ${scan.target}`)
    .text(`Type: ${scan.scanType}`)
    .text(`Date: ${new Date(scan.timestamp).toLocaleString()}`)
    .text(`Status: ${scan.status}`)
    .moveDown();

  // Add results table
  if (scan.results && scan.results.length > 0) {
    doc.text('Scan Results:', { underline: true }).moveDown();
    
    const tableData = scan.results.map(result => ({
      IP: result.ip,
      Port: result.port,
      Service: result.service,
      Status: result.status,
      Version: result.version || 'N/A'
    }));

    // Create table
    const startX = 50;
    let startY = doc.y;
    const rowHeight = 20;
    const colWidth = (doc.page.width - 100) / 5;

    // Headers
    Object.keys(tableData[0]).forEach((header, i) => {
      doc.text(header, startX + (i * colWidth), startY);
    });

    // Data
    tableData.forEach((row, i) => {
      Object.values(row).forEach((text, j) => {
        doc.text(text, startX + (j * colWidth), startY + ((i + 1) * rowHeight));
      });
    });
  }

  // Add vulnerabilities
  if (scan.vulnerabilities) {
    doc.addPage()
      .fontSize(16)
      .text('Vulnerabilities Found:', { underline: true })
      .moveDown();

    Object.entries(scan.vulnerabilities).forEach(([port, vulns]) => {
      doc.fontSize(14)
        .text(`Port ${port}:`)
        .moveDown();

      vulns.forEach(vuln => {
        doc.fontSize(12)
          .text(`CVE: ${vuln.id}`)
          .text(`Severity: ${vuln.severity}`)
          .text(`Description: ${vuln.description}`)
          .moveDown();
      });
    });
  }

  // Add AI insights
  if (scan.insights) {
    doc.addPage()
      .fontSize(16)
      .text('AI Analysis:', { underline: true })
      .moveDown()
      .fontSize(12)
      .text(`Risk Level: ${scan.insights.riskLevel}`)
      .text(`Summary: ${scan.insights.summary}`)
      .moveDown()
      .text('Recommendations:');

    scan.insights.recommendations.forEach(rec => {
      doc.text(`• ${rec}`);
    });
  }

  return doc;
};

export const generateCSV = async (scan) => {
  const fields = ['ip', 'port', 'service', 'status', 'version', 'risk_level'];
  const data = scan.results.map(result => ({
    ...result,
    risk_level: result.riskLevel || 'unknown'
  }));

  const parser = new Parser({ fields });
  return parser.parse(data);
};

export const generateJSON = async (scan) => {
  return JSON.stringify({
    scan_info: {
      id: scan.id,
      target: scan.target,
      type: scan.scanType,
      timestamp: scan.timestamp,
      status: scan.status
    },
    results: scan.results,
    vulnerabilities: scan.vulnerabilities,
    insights: scan.insights,
    geo_data: scan.geoData
  }, null, 2);
};

export const streamFile = (res, data, filename, contentType) => {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  if (data instanceof PDFDocument) {
    data.pipe(res);
    data.end();
  } else {
    const stream = new Readable();
    stream.push(data);
    stream.push(null);
    stream.pipe(res);
  }
};