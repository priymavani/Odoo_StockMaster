import { useDebugState } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Bug, Package, MapPin } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { motion } from 'framer-motion';

export function Debug() {
  const { data, isLoading, error } = useDebugState();

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
        <p className="text-red-600">Error loading debug state: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Bug className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debug State</h1>
          <p className="text-gray-600 mt-1">Admin-only: Complete stock state inspection</p>
        </div>
      </div>

      {/* Per Product View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Stock Per Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.perProduct && data.perProduct.length > 0 ? (
            <div className="space-y-4">
              {data.perProduct.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Quantity</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(product.totalQuantity)}
                      </p>
                    </div>
                  </div>
                  {product.locations && product.locations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">By Location:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {product.locations.map((loc, locIndex) => (
                          <div
                            key={locIndex}
                            className="p-2 bg-white rounded border border-gray-200"
                          >
                            <p className="text-xs font-medium text-gray-900">{loc.locationName}</p>
                            <p className="text-xs text-gray-500">({loc.locationCode})</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formatNumber(loc.qty)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per Location View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Stock Per Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.perLocation && data.perLocation.length > 0 ? (
            <div className="space-y-4">
              {data.perLocation.map((location, index) => (
                <motion.div
                  key={location.locationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.locationName}</h3>
                      <p className="text-sm text-gray-500">Code: {location.locationCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Quantity</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(location.totalQty)}
                      </p>
                    </div>
                  </div>
                  {location.products && location.products.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {location.products.map((prod, prodIndex) => (
                          <div
                            key={prodIndex}
                            className="p-2 bg-white rounded border border-gray-200"
                          >
                            <p className="text-xs font-medium text-gray-900">{prod.name}</p>
                            <p className="text-xs text-gray-500">({prod.sku})</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formatNumber(prod.qty)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No locations found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

