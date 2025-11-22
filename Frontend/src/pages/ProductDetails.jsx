import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Package, MapPin } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { motion } from 'framer-motion';

export function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading product: {error?.message || 'Product not found'}</p>
        <Link to="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-1">Product details and stock information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">SKU</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-lg text-gray-900 mt-1">{product.category || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Unit of Measure</label>
                  <p className="text-lg text-gray-900 mt-1">{product.uom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reorder Level</label>
                  <p className="text-lg text-gray-900 mt-1">
                    {product.reorderLevel !== undefined ? formatNumber(product.reorderLevel) : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Total Quantity</label>
                  <p className={`text-3xl font-bold mt-1 ${
                    product.reorderLevel && product.totalQuantity < product.reorderLevel
                      ? 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    {formatNumber(product.totalQuantity)} {product.uom}
                  </p>
                  {product.reorderLevel && product.totalQuantity < product.reorderLevel && (
                    <p className="text-sm text-red-600 mt-1">⚠ Below reorder level</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Stock by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.locations && product.locations.length > 0 ? (
                <div className="space-y-3">
                  {product.locations.map((loc, index) => (
                    <motion.div
                      key={loc.location?._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {loc.location?.name || 'Unknown Location'}
                        </p>
                        <p className="text-sm text-gray-500">Code: {loc.location?.code || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(loc.qty)} {product.uom}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No stock in any location</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/receipts" className="block">
                <Button variant="primary" className="w-full">
                  Add Stock (Receipt)
                </Button>
              </Link>
              <Link to="/deliveries" className="block">
                <Button variant="outline" className="w-full">
                  Remove Stock (Delivery)
                </Button>
              </Link>
              <Link to="/transfers" className="block">
                <Button variant="outline" className="w-full">
                  Transfer Stock
                </Button>
              </Link>
              <Link to="/adjustments" className="block">
                <Button variant="outline" className="w-full">
                  Adjust Stock
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

