import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useProducts } from '../hooks/useApi';
import { useLocations } from '../hooks/useApi';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Plus, Trash2, Search } from 'lucide-react';

export function MovementForm({ 
  type, 
  onSubmit, 
  isLoading,
  defaultValues = {
    referenceId: '',
    note: '',
    lines: [{ productId: '', qty: '', toLocationId: '', fromLocationId: '' }],
  }
}) {
  const { data: productsData } = useProducts({ size: 1000 });
  const { data: locations = [] } = useLocations();
  const [productSearch, setProductSearch] = useState({});

  const products = productsData?.items || [];

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const getFieldsForType = () => {
    switch (type) {
      case 'receipt':
        return { showToLocation: true, showFromLocation: false };
      case 'delivery':
        return { showToLocation: false, showFromLocation: true };
      case 'transfer':
        return { showToLocation: true, showFromLocation: true };
      case 'adjustment':
        return { showToLocation: true, showFromLocation: false };
      default:
        return { showToLocation: false, showFromLocation: false };
    }
  };

  const { showToLocation, showFromLocation } = getFieldsForType();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Reference ID"
          {...register('referenceId')}
          error={errors.referenceId?.message}
          placeholder="e.g., PO-001, SO-001"
        />

        <Input
          label="Note"
          {...register('note')}
          error={errors.note?.message}
          placeholder="Optional note"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ productId: '', qty: '', toLocationId: '', fromLocationId: '' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  {...register(`lines.${index}.productId`, { required: 'Product is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
                {errors.lines?.[index]?.productId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lines[index].productId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity * {type === 'adjustment' && '(can be negative)'}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`lines.${index}.qty`, {
                    required: 'Quantity is required',
                    ...(type !== 'adjustment' && {
                      min: { value: 0.01, message: 'Quantity must be greater than 0' },
                    }),
                  })}
                  error={errors.lines?.[index]?.qty?.message}
                  placeholder={type === 'adjustment' ? 'e.g., -3 or +5' : '0.00'}
                />
              </div>

              {showFromLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Location *
                  </label>
                  <select
                    {...register(`lines.${index}.fromLocationId`, { required: 'From location is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name} ({location.code})
                      </option>
                    ))}
                  </select>
                  {errors.lines?.[index]?.fromLocationId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lines[index].fromLocationId.message}
                    </p>
                  )}
                </div>
              )}

              {showToLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {type === 'adjustment' ? 'Location *' : 'To Location *'}
                  </label>
                  <select
                    {...register(`lines.${index}.toLocationId`, { required: 'To location is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name} ({location.code})
                      </option>
                    ))}
                  </select>
                  {errors.lines?.[index]?.toLocationId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lines[index].toLocationId.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Process ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Button>
      </div>
    </form>
  );
}

