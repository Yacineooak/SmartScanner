import nodemailer from 'nodemailer';
import { getVulnerabilityDetails } from './nvdService.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendCriticalAlert = async (user, scan) => {
  if (!scan.vulnerabilities) return;

  const criticalVulns = Object.values(scan.vulnerabilities)
    .flat()
    .filter(vuln => vuln.severity === 'critical');

  if (criticalVulns.length === 0) return;

  const vulnDetails = await Promise.all(
    criticalVulns.map(vuln => getVulnerabilityDetails(vuln.id))
  );

  const mailOptions = {
    from: process.env.SMTP_FROM || 'security@smartscanner.com',
    to: user.email,
    subject: `⚠️ Critical Vulnerabilities Found - ${scan.target}`,
    html: `
      <h2>Critical Security Alert</h2>
      <p>SmartScanner has detected ${criticalVulns.length} critical vulnerabilities in your recent scan.</p>
      
      <h3>Scan Details:</h3>
      <ul>
        <li>Target: ${scan.target}</li>
        <li>Scan Type: ${scan.scanType}</li>
        <li>Date: ${new Date(scan.timestamp).toLocaleString()}</li>
      </ul>

      <h3>Critical Vulnerabilities:</h3>
      ${vulnDetails.map(vuln => `
        <div style="margin-bottom: 20px;">
          <h4>${vuln.id}</h4>
          <p><strong>CVSS Score:</strong> ${vuln.cvssScore}</p>
          <p>${vuln.description}</p>
        </div>
      `).join('')}

      <p>Please review these findings immediately and take necessary action.</p>
      <p><a href="${process.env.APP_URL}/results/${scan.id}">View Full Report</a></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Critical alert sent to ${user.email}`);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};