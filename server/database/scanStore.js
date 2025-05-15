// In-memory storage (replace with real database in production)
const scanStore = new Map();

// Save scan data
export const saveScan = async (scanData) => {
  scanStore.set(scanData.id, scanData);
  return scanData;
};

// Get scan by ID
export const getScan = async (scanId) => {
  return scanStore.get(scanId) || null;
};

// Get all scans for a user
export const getUserScans = async (userId) => {
  return Array.from(scanStore.values())
    .filter(scan => scan.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get recent scans
export const getRecentScans = async (limit = 10) => {
  return Array.from(scanStore.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

// Delete scan
export const deleteScan = async (scanId) => {
  scanStore.delete(scanId);
};