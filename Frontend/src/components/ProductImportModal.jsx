import { useState } from 'react';
import { useImportProducts } from '../hooks/useApi';
import { Button } from './ui/Button';
import { Upload, FileText } from 'lucide-react';

export function ProductImportModal({ onClose }) {
  const [file, setFile] = useState(null);
  const importMutation = useImportProducts();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        alert('Please select a CSV file');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file');
      return;
    }
    importMutation.mutate(file, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h4>
        <p className="text-sm text-blue-800 mb-2">Required columns:</p>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>name (required)</li>
          <li>sku (required, unique)</li>
          <li>category (optional)</li>
          <li>uom (required)</li>
          <li>reorderLevel (optional)</li>
          <li>locationCode (optional)</li>
          <li>qty (optional, used with locationCode)</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors">
                {file ? (
                  <>
                    <FileText className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to select CSV file</span>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importing...' : 'Import Products'}
          </Button>
        </div>
      </form>
    </div>
  );
}

