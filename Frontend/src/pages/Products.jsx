import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { ProductImportModal } from '../components/ProductImportModal';
import { Package, Plus, Search, Edit, Trash2, Upload, Eye } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function Products() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, isLoading, error } = useProducts({ page, size: 10, q: search });
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  const products = data?.items || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        {isAdmin() && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products found</p>
            {isAdmin() && (
              <Button
                className="mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        {product.category && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Stock:</span>
                        <span className="font-semibold text-gray-900">
                          {formatNumber(product.totalQuantity)} {product.uom}
                        </span>
                      </div>
                      {product.reorderLevel !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reorder Level:</span>
                          <span className="font-medium text-gray-700">
                            {formatNumber(product.reorderLevel)} {product.uom}
                          </span>
                        </div>
                      )}
                      {product.totalQuantity < (product.reorderLevel || 0) && (
                        <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded text-center">
                          Low Stock
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      {isAdmin() && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        onClose={() => {
          setShowCreateModal(false);
          setEditingProduct(null);
        }}
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        title="Import Products from CSV"
        onClose={() => setShowImportModal(false)}
        size="lg"
      >
        <ProductImportModal
          onClose={() => setShowImportModal(false)}
        />
      </Modal>
    </div>
  );
}

