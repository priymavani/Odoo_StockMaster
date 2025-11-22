import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { toast } from 'react-hot-toast';

// ==================== Dashboard ====================
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard');
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
  });
}

// ==================== Products ====================
export function useProducts({ page = 1, size = 10, q = '' } = {}) {
  return useQuery({
    queryKey: ['products', page, size, q],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      if (q) params.append('q', q);
      const response = await apiClient.get(`/products?${params}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/products', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/products/${id}`, data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/products/${id}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
}

export function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Products imported successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to import products');
    },
  });
}

// ==================== Locations ====================
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await apiClient.get('/locations');
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
  });
}

export function useLocation(id) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: async () => {
      const response = await apiClient.get(`/locations/${id}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/locations', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create location');
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/locations/${id}`, data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      toast.success('Location updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update location');
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/locations/${id}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete location');
    },
  });
}

// ==================== Receipts ====================
export function useCreateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/receipts', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Receipt processed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process receipt');
    },
  });
}

// ==================== Deliveries ====================
export function useCreateDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/deliveries', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Delivery processed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process delivery');
    },
  });
}

// ==================== Transfers ====================
export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/transfers', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Transfer processed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process transfer');
    },
  });
}

// ==================== Adjustments ====================
export function useCreateAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/adjustments', data);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Adjustment processed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process adjustment');
    },
  });
}

// ==================== Movements ====================
export function useMovements({ limit = 20, type = '', productId = '', locationId = '', status = '' } = {}) {
  return useQuery({
    queryKey: ['movements', limit, type, productId, locationId, status],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type) params.append('type', type);
      if (productId) params.append('productId', productId);
      if (locationId) params.append('locationId', locationId);
      if (status) params.append('status', status);
      const response = await apiClient.get(`/movements?${params}`);
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
  });
}

// ==================== Debug ====================
export function useDebugState() {
  return useQuery({
    queryKey: ['debug'],
    queryFn: async () => {
      const response = await apiClient.get('/debug/state');
      if (response.data.error) throw new Error(response.data.message);
      return response.data.data;
    },
  });
}
