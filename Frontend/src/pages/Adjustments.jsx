import { useCreateAdjustment } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MovementForm } from '../components/MovementForm';
import { Settings, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Adjustments() {
  const createMutation = useCreateAdjustment();

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      lines: data.lines.map(line => ({
        productId: line.productId,
        qty: Number(line.qty), // Can be negative for adjustments
        toLocationId: line.toLocationId,
      })),
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adjustments</h1>
            <p className="text-gray-600 mt-1">Correct stock discrepancies and damage</p>
          </div>
        </div>
      </motion.div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Adjustment Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use positive values to add stock (e.g., found items)</li>
                <li>Use negative values to remove stock (e.g., damaged/lost items)</li>
                <li>The system will prevent stock from going negative</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-600" />
            Create Adjustment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm
            type="adjustment"
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

