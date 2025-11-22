import { useCreateTransfer } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MovementForm } from '../components/MovementForm';
import { ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Transfers() {
  const createMutation = useCreateTransfer();

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      lines: data.lines.map(line => ({
        productId: line.productId,
        qty: Number(line.qty),
        fromLocationId: line.fromLocationId,
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
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
            <p className="text-gray-600 mt-1">Move stock between locations</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            Create Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm
            type="transfer"
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

