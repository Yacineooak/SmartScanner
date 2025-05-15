// Simulated CVE database records
const cveSampleData = {
  "HTTP": [
    {
      id: "CVE-2021-44228",
      description: "Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints.",
      severity: "critical",
      cvssScore: 10.0,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2021-44228"],
      publishedDate: "2021-12-10",
      lastModifiedDate: "2022-01-05"
    },
    {
      id: "CVE-2022-22965",
      description: "A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution (RCE) via data binding.",
      severity: "critical",
      cvssScore: 9.8,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2022-22965"],
      publishedDate: "2022-04-01",
      lastModifiedDate: "2022-04-05"
    }
  ],
  "SSH": [
    {
      id: "CVE-2020-14145",
      description: "The client side in OpenSSH 5.7 through 8.4 has an Observable Discrepancy leading to an information leak in the algorithm negotiation.",
      severity: "medium",
      cvssScore: 5.9,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2020-14145"],
      publishedDate: "2020-05-27",
      lastModifiedDate: "2020-07-02"
    }
  ],
  "FTP": [
    {
      id: "CVE-2020-9470",
      description: "ProFTPD before 1.3.7rc3 allows privilege escalation via the mod_copy module.",
      severity: "high",
      cvssScore: 8.8,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2020-9470"],
      publishedDate: "2020-04-17",
      lastModifiedDate: "2020-04-28"
    }
  ],
  "SMB": [
    {
      id: "CVE-2020-1472",
      description: "The Netlogon Remote Protocol (MS-NRPC) reuses a known, static, and symmetric key. This vulnerability is also known as 'Zerologon'.",
      severity: "critical",
      cvssScore: 10.0,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2020-1472"],
      publishedDate: "2020-08-17",
      lastModifiedDate: "2021-02-09"
    }
  ],
  "RDP": [
    {
      id: "CVE-2019-0708",
      description: "A remote code execution vulnerability exists in Remote Desktop Services. This vulnerability is also known as 'BlueKeep'.",
      severity: "critical",
      cvssScore: 9.8,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2019-0708"],
      publishedDate: "2019-05-14",
      lastModifiedDate: "2020-03-11"
    }
  ],
  "DNS": [
    {
      id: "CVE-2023-28227",
      description: "A vulnerability in ISC BIND allows for DNS Cache Poisoning.",
      severity: "high",
      cvssScore: 8.1,
      references: ["https://nvd.nist.gov/vuln/detail/CVE-2023-28227"],
      publishedDate: "2023-01-23",
      lastModifiedDate: "2023-02-01"
    }
  ]
};

// Fetch CVE data for a service
export const fetchCveData = async (service) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Look for exact match
  if (cveSampleData[service]) {
    return cveSampleData[service];
  }
  
  // Look for partial match
  for (const key of Object.keys(cveSampleData)) {
    if (service.includes(key)) {
      return cveSampleData[key];
    }
  }
  
  // No matches found
  return [];
};

// Get CVE details by ID
export const getCveDetailsById = async (cveId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Search all services for the CVE ID
  for (const serviceVulns of Object.values(cveSampleData)) {
    const cve = serviceVulns.find(v => v.id === cveId);
    if (cve) {
      return cve;
    }
  }
  
  return null;
};