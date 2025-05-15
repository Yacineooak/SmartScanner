import { getCveDetailsById, fetchCveData } from '../services/cveService.js';

// Get CVE by ID
export const getCve = async (req, res) => {
  try {
    const { cveId } = req.params;
    
    if (!cveId) {
      return res.status(400).json({ error: 'CVE ID is required' });
    }
    
    const cveDetails = await getCveDetailsById(cveId);
    
    if (!cveDetails) {
      return res.status(404).json({ error: 'CVE not found' });
    }
    
    res.status(200).json(cveDetails);
  } catch (error) {
    console.error('Error fetching CVE details:', error);
    res.status(500).json({ error: 'Failed to fetch CVE details' });
  }
};

// Search CVEs by service or keyword
export const searchCves = async (req, res) => {
  try {
    const { service, keyword } = req.query;
    
    if (!service && !keyword) {
      return res.status(400).json({ 
        error: 'Either service or keyword is required for search' 
      });
    }
    
    let results = [];
    
    if (service) {
      results = await fetchCveData(service);
    } else {
      // Not implemented in this demo
      res.status(501).json({ 
        error: 'Keyword search not implemented in demo' 
      });
      return;
    }
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching CVEs:', error);
    res.status(500).json({ error: 'Failed to search CVEs' });
  }
};