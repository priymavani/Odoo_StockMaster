import { useState } from 'react';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

export function Locations() {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const { data: locations = [], isLoading, error } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    if (editingLocation) {
      updateMutation.mutate(
        { id: editingLocation._id, data },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingLocation(null);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    reset({
      name: location.name,
      code: location.code,
      description: location.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
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
        <p className="text-red-600">Error loading locations: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600 mt-1">Manage warehouses and storage locations</p>
        </div>
        {isAdmin() && (
          <Button onClick={() => {
            setEditingLocation(null);
            reset();
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        )}
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No locations found</p>
            {isAdmin() && (
              <Button
                className="mt-4"
                onClick={() => {
                  setEditingLocation(null);
                  reset();
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Location
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-500">Code: {location.code}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>

                  {location.description && (
                    <p className="text-sm text-gray-600 mb-4">{location.description}</p>
                  )}

                  {isAdmin() && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(location)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(location._id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        title={editingLocation ? 'Edit Location' : 'Create Location'}
        onClose={() => {
          setShowModal(false);
          setEditingLocation(null);
          reset();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Location Name *"
            {...register('name', { required: 'Location name is required' })}
            error={errors.name?.message}
          />

          <Input
            label="Location Code *"
            {...register('code', { required: 'Location code is required' })}
            error={errors.code?.message}
            placeholder="e.g., MAIN, PROD"
          />

          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Optional description"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingLocation(null);
                reset();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : editingLocation
                ? 'Update Location'
                : 'Create Location'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

