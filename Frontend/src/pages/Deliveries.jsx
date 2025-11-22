import { useCreateDelivery } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MovementForm } from '../components/MovementForm';
import { Truck, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Deliveries() {
  const createMutation = useCreateDelivery();

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      lines: data.lines.map(line => ({
        productId: line.productId,
        qty: Number(line.qty),
        fromLocationId: line.fromLocationId,
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
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
            <p className="text-gray-600 mt-1">Record outgoing stock to customers</p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-red-600" />
            Create Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MovementForm
            type="delivery"
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

