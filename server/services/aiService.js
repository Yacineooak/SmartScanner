import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Offline insights database
const offlineInsights = {
  'http': {
    summary: 'Web service vulnerabilities detected that could allow unauthorized access.',
    riskLevel: 'high',
    recommendations: [
      'Update web server software to latest version',
      'Implement WAF (Web Application Firewall)',
      'Enable HTTPS and configure secure headers',
      'Regular security patching and monitoring'
    ]
  },
  'ssh': {
    summary: 'SSH service detected with potential security concerns.',
    riskLevel: 'medium',
    recommendations: [
      'Use SSH key authentication instead of passwords',
      'Restrict SSH access to specific IP ranges',
      'Update OpenSSH to latest version',
      'Implement fail2ban for brute force protection'
    ]
  }
  // Add more offline patterns
};

export const generateAiInsights = async (scanResults, cveDetails) => {
  try {
    // Try online AI first
    if (navigator.onLine && process.env.OPENAI_API_KEY) {
      return await generateOnlineInsights(scanResults, cveDetails);
    }
  } catch (error) {
    console.warn('Failed to generate online insights, falling back to offline mode');
  }

  // Fallback to offline insights
  return generateOfflineInsights(scanResults, cveDetails);
};

const generateOnlineInsights = async (scanResults, cveDetails) => {
  const prompt = `Analyze these security scan results and vulnerabilities:
    Scan Results: ${JSON.stringify(scanResults)}
    CVE Details: ${JSON.stringify(cveDetails)}
    
    Provide a security assessment with:
    1. Brief summary of findings
    2. Risk level (low/medium/high)
    3. 3-5 specific remediation recommendations`;

  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  const analysis = response.data.choices[0].message.content;
  
  // Parse AI response into structured format
  const lines = analysis.split('\n');
  return {
    summary: lines[0],
    riskLevel: determineRiskLevel(analysis),
    recommendations: extractRecommendations(analysis)
  };
};

const generateOfflineInsights = (scanResults, cveDetails) => {
  let highestRisk = 'low';
  let relevantInsights = [];

  // Analyze services and their vulnerabilities
  for (const result of scanResults) {
    if (result.service && result.service.toLowerCase() in offlineInsights) {
      relevantInsights.push(offlineInsights[result.service.toLowerCase()]);
      
      // Update risk level
      if (result.service in cveDetails) {
        const vulns = cveDetails[result.service];
        if (vulns.some(v => v.severity === 'critical')) {
          highestRisk = 'high';
        } else if (vulns.some(v => v.severity === 'high') && highestRisk !== 'high') {
          highestRisk = 'high';
        } else if (vulns.some(v => v.severity === 'medium') && highestRisk === 'low') {
          highestRisk = 'medium';
        }
      }
    }
  }

  // Combine insights
  return {
    summary: `Scan detected ${scanResults.length} services with ${Object.keys(cveDetails).length} potential vulnerabilities.`,
    riskLevel: highestRisk,
    recommendations: Array.from(new Set(
      relevantInsights.flatMap(insight => insight.recommendations)
    )).slice(0, 5)
  };
};

const determineRiskLevel = (analysis) => {
  const text = analysis.toLowerCase();
  if (text.includes('critical') || text.includes('severe')) return 'high';
  if (text.includes('moderate') || text.includes('medium')) return 'medium';
  return 'low';
};

const extractRecommendations = (analysis) => {
  const recommendations = [];
  const lines = analysis.split('\n');
  
  for (const line of lines) {
    if (line.match(/^\d+\.\s/) || line.includes('recommend')) {
      recommendations.push(line.replace(/^\d+\.\s/, '').trim());
    }
  }
  
  return recommendations.slice(0, 5);
};