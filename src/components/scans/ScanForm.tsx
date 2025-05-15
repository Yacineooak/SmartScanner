import { useState } from 'react';
import { ScanFormData, ScanType } from '../../types/scan';
import { Button } from '../ui/button';
import { 
  UploadCloud, 
  Info, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Zap 
} from 'lucide-react';

interface ScanFormProps {
  scanType: ScanType;
  onSubmit: (formData: ScanFormData) => void;
}

const ScanForm = ({ scanType, onSubmit }: ScanFormProps) => {
  const [target, setTarget] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [fileList, setFileList] = useState<File[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [options, setOptions] = useState({
    timeout: 5000,
    concurrency: 10,
    detectVersion: true,
    skipDiscovery: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      target,
      portRange,
      scanType,
      options,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileList(Array.from(e.target.files));
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOptions({
      ...options,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="target" className="block text-sm font-medium mb-1">
            Target {scanType === 'multi-ip' ? 'or Upload IP List' : ''}
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                id="target"
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={
                  scanType === 'network' 
                    ? '192.168.0.0/24' 
                    : scanType === 'multi-ip'
                    ? 'Enter an IP or upload a list'
                    : 'example.com or 192.168.1.1'
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                required={scanType !== 'multi-ip' || fileList.length === 0}
              />
            </div>
            
            {scanType === 'multi-ip' && (
              <div className="flex">
                <label className="flex items-center justify-center px-4 py-2 border border-border rounded-md cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors">
                  <UploadCloud className="h-5 w-5 mr-2" />
                  <span>Upload IP List</span>
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          {fileList.length > 0 && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Check className="h-4 w-4 mr-1 text-success-500" />
              {fileList[0].name} ({Math.round(fileList[0].size / 1024)} KB)
            </div>
          )}
        </div>

        {['tcp', 'udp', 'syn', 'quick', 'banner'].includes(scanType) && (
          <div>
            <label htmlFor="portRange" className="block text-sm font-medium mb-1">
              Port Range
            </label>
            <input
              id="portRange"
              type="text"
              value={portRange}
              onChange={(e) => setPortRange(e.target.value)}
              placeholder="e.g., 1-1000, 22, 80, 443"
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
            <p className="mt-1 text-xs text-muted-foreground flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Specify ports as a range (e.g., 1-1000) or individual ports separated by commas (e.g., 22,80,443)
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            className="flex items-center text-sm text-primary hover:text-primary/90 transition-colors"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            {advancedOpen ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            Advanced Options
          </button>
          
          {advancedOpen && (
            <div className="mt-3 p-4 bg-muted/5 rounded-md border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeout" className="block text-sm font-medium mb-1">
                  Timeout (ms)
                </label>
                <input
                  id="timeout"
                  name="timeout"
                  type="number"
                  value={options.timeout}
                  onChange={handleOptionChange}
                  min="100"
                  max="30000"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label htmlFor="concurrency" className="block text-sm font-medium mb-1">
                  Concurrency
                </label>
                <input
                  id="concurrency"
                  name="concurrency"
                  type="number"
                  value={options.concurrency}
                  onChange={handleOptionChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="detectVersion"
                  name="detectVersion"
                  type="checkbox"
                  checked={options.detectVersion}
                  onChange={handleOptionChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="detectVersion" className="ml-2 block text-sm">
                  Detect service versions
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="skipDiscovery"
                  name="skipDiscovery"
                  type="checkbox"
                  checked={options.skipDiscovery}
                  onChange={handleOptionChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="skipDiscovery" className="ml-2 block text-sm">
                  Skip host discovery
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Zap className="h-4 w-4 mr-2" />
            Start Scan
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ScanForm;