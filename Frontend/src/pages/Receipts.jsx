import { useCreateReceipt } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MovementForm } from '../components/MovementForm';
import { Receipt, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function Receipts() {
  const createMutation = useCreateReceipt();

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      lines: data.lines.map(line => ({
        productId: line.productId,
        qty: Number(line.qty),
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
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Receipt className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
            <p className="text-gray-600 mt-1">Record incoming stock from vendors</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-green-600" />
            Create Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm
            type="receipt"
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

