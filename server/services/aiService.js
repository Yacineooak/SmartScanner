// Generate AI insights for scan results
export const generateAiInsights = async (scanResults, cveDetails) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  // Count open ports and vulnerabilities
  const openPorts = scanResults.filter(r => r.status === 'open').length;
  const vulnServices = Object.keys(cveDetails).length;
  const criticalVulns = countCriticalVulns(cveDetails);
  
  // Determine risk level
  let riskLevel = 'low';
  if (criticalVulns > 0) {
    riskLevel = 'critical';
  } else if (vulnServices > 2) {
    riskLevel = 'high';
  } else if (vulnServices > 0) {
    riskLevel = 'medium';
  }
  
  // Generate summary based on findings
  let summary = '';
  let recommendations = [];
  
  if (openPorts === 0) {
    summary = "No open ports were detected during the scan, suggesting the target has minimal network exposure.";
    recommendations = [
      "Continue monitoring for changes in network configuration",
      "Perform regular security assessments to ensure continued security posture"
    ];
  } else {
    summary = `The scan detected ${openPorts} open ${openPorts === 1 ? 'port' : 'ports'}`;
    
    if (vulnServices === 0) {
      summary += ". No known vulnerabilities were identified in the services running on these ports.";
      recommendations = [
        "Evaluate if all open ports are necessary for operations",
        "Consider implementing a firewall to restrict access to these ports",
        "Regularly update all services to patch newly discovered vulnerabilities"
      ];
    } else {
      summary += `, with ${vulnServices} ${vulnServices === 1 ? 'service' : 'services'} running vulnerable software. `;
      
      if (criticalVulns > 0) {
        summary += `${criticalVulns} critical ${criticalVulns === 1 ? 'vulnerability was' : 'vulnerabilities were'} identified, which could allow remote attackers to compromise the system completely.`;
        recommendations = [
          "Immediately patch or update the vulnerable services",
          "If patching is not possible, consider disabling the affected services",
          "Implement network segmentation to limit access to vulnerable systems",
          "Conduct a full security audit to identify any compromise indicators"
        ];
      } else {
        summary += "The vulnerabilities identified could potentially be exploited to gain unauthorized access or disrupt services.";
        recommendations = [
          "Update the affected services to their latest secure versions",
          "Review and harden service configurations",
          "Implement intrusion detection/prevention systems",
          "Consider adding firewall rules to restrict access to vulnerable services"
        ];
      }
    }
  }
  
  return {
    summary,
    riskLevel,
    recommendations,
    generatedAt: new Date().toISOString()
  };
};

// Helper function to count critical vulnerabilities
function countCriticalVulns(cveDetails) {
  let count = 0;
  
  for (const cveList of Object.values(cveDetails)) {
    for (const cve of cveList) {
      if (cve.severity === 'critical') {
        count++;
      }
    }
  }
  
  return count;
}