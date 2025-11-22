import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateProduct, useUpdateProduct } from '../hooks/useApi';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export function ProductForm({ product, onSuccess }) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: product || {
      name: '',
      sku: '',
      category: '',
      uom: '',
      reorderLevel: '',
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        uom: product.uom || '',
        reorderLevel: product.reorderLevel || '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      reorderLevel: data.reorderLevel ? Number(data.reorderLevel) : undefined,
    };

    if (product) {
      updateMutation.mutate(
        { id: product._id, data: payload },
        { onSuccess }
      );
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name *"
        {...register('name', { required: 'Product name is required' })}
        error={errors.name?.message}
      />

      <Input
        label="SKU *"
        {...register('sku', { required: 'SKU is required' })}
        error={errors.sku?.message}
        placeholder="e.g., PROD-001"
      />

      <Input
        label="Category"
        {...register('category')}
        error={errors.category?.message}
        placeholder="e.g., Raw Material"
      />

      <Input
        label="Unit of Measure (UOM) *"
        {...register('uom', { required: 'UOM is required' })}
        error={errors.uom?.message}
        placeholder="e.g., kg, pcs, liters"
      />

      <Input
        label="Reorder Level"
        type="number"
        {...register('reorderLevel', {
          min: { value: 0, message: 'Reorder level must be 0 or greater' },
        })}
        error={errors.reorderLevel?.message}
        placeholder="Minimum stock level"
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

