import React, { useEffect, useState } from 'react';
import { Plus, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios.js';
import { useToast } from '../hooks/useToast.js';
import { Vehicle } from '../types';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import EmptyState from '../components/EmptyState.js';
import DataTable from '../components/DataTable.js';
import EntityForm, { FormField } from '../components/EntityForm.js';

export default function Vehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Vehicle | null>(null);

  const { showToast } = useToast();

  const columns = [
    { key: 'Vehicle_ID', label: 'VEHICLE ID' },
    { key: 'Name', label: 'VEHICLE NAME' },
    { key: 'Type', label: 'TYPE' },
    { key: 'Fuel_Status', label: 'FUEL LEVEL Status' },
    { key: 'Unit_Name', label: 'ASSIGNED UNIT' }
  ];

  const formFields: FormField[] = [
    { name: 'Vehicle_ID', label: 'Vehicle ID', type: 'text', required: true, disabledOnEdit: true },
    { name: 'Name', label: 'Vehicle Asset Name', type: 'text', required: true },
    { name: 'Type', label: 'Vehicle Type / Class', type: 'text', required: true },
    {
      name: 'Fuel_Status',
      label: 'Fuel Tank Reading',
      type: 'select',
      required: true,
      options: [
        { value: 'Full', label: 'FULL - DEPLOYMENT READY' },
        { value: 'Half', label: 'HALF TANK' },
        { value: 'Low', label: 'LOW WARNING' },
        { value: 'Empty', label: 'EMPTY - RESERVED / DRY' }
      ]
    },
    { name: 'Unit_Name', label: 'Assigned Regiment / Unit', type: 'text', required: true }
  ];

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/api/vehicles');
      setData(Array.isArray(resp.data) ? resp.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failure loading database vehicular intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddClick = () => {
    setActiveItem(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: Vehicle) => {
    setActiveItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/vehicles/${id}`);
      showToast('Vehicular asset decommissioned successfully.');
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete record.';
      showToast(errMsg, 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditMode && activeItem) {
        await api.put(`/api/vehicles/${activeItem.Vehicle_ID}`, formData);
        showToast(`Vehicular asset V-${activeItem.Vehicle_ID} updated.`);
      } else {
        await api.post('/api/vehicles', formData);
        showToast(`New military vehicle V-${formData.Vehicle_ID} commissioned successfully.`);
      }
      setIsFormOpen(false);
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Vehicular registry action blocked.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 pb-16"
    >
      {/* Page Header */}
      <div id="vehicles-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3D4A22] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#2C3318] border border-[#3D4A22]">
            <Compass className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-tactical text-2xl font-black text-[#E8DFB8] tracking-widest uppercase">
              VEHICLE CONTROLS & LOGISTICS
            </h1>
            <p className="font-sans text-xs text-[#8A9070]">
              Tanks, heavy trucks, combat transports, air support status monitors, and unit allocations.
            </p>
          </div>
        </div>

        <button
          id="btn-add-vehicle"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/20 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Grid Roster */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} retry={fetchRecords} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={handleAddClick} entityName="Vehicle" />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          entityName="Vehicle"
        />
      )}

      {/* Slideout Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <EntityForm
            fields={formFields}
            initialData={activeItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            title={isEditMode ? 'EDIT VEHICLE RECORD' : 'COMMISSION NEW VEHICLE'}
            isEditMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
