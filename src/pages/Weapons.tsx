import React, { useEffect, useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios.js';
import { useToast } from '../hooks/useToast.js';
import { Weapon } from '../types';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import EmptyState from '../components/EmptyState.js';
import DataTable from '../components/DataTable.js';
import EntityForm, { FormField } from '../components/EntityForm.js';

export default function Weapons() {
  const [data, setData] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Weapon | null>(null);

  const { showToast } = useToast();

  const columns = [
    { key: 'Weapon_ID', label: 'WEAPON ID' },
    { key: 'Name', label: 'WEAPON NAME' },
    { key: 'Type', label: 'WEAPON TYPE' },
    { key: 'Quantity', label: 'QUANTITY' },
    { key: 'Status', label: 'READY STATUS' }
  ];

  const formFields: FormField[] = [
    { name: 'Weapon_ID', label: 'Weapon ID', type: 'text', required: true, disabledOnEdit: true },
    { name: 'Name', label: 'Weapon Asset Name', type: 'text', required: true },
    { name: 'Type', label: 'Weapon Category / Type', type: 'text', required: true },
    { name: 'Quantity', label: 'Stock Quantity', type: 'number', required: true },
    {
      name: 'Status',
      label: 'Weapon Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'ACTIVE - FULL CAPACITY' },
        { value: 'Maintenance', label: 'MAINTENANCE / OVERHAUL' },
        { value: 'Critical', label: 'CRITICAL / DAMAGED' }
      ]
    }
  ];

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/api/weapons');
      setData(Array.isArray(resp.data) ? resp.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failure loading database armory logs.');
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

  const handleEditClick = (item: Weapon) => {
    setActiveItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/weapons/${id}`);
      showToast('Armory asset removed successfully.');
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete record.';
      showToast(errMsg, 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditMode && activeItem) {
        await api.put(`/api/weapons/${activeItem.Weapon_ID}`, formData);
        showToast(`Armory unit W-${activeItem.Weapon_ID} revamped successfully.`);
      } else {
        await api.post('/api/weapons', formData);
        showToast(`New ordnance W-${formData.Weapon_ID} deployed successfully.`);
      }
      setIsFormOpen(false);
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Ordnance deployment rejected by HQ.';
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
      <div id="weapons-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3D4A22] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#2C3318] border border-[#3D4A22]">
            <ShieldAlert className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-tactical text-2xl font-black text-[#E8DFB8] tracking-widest uppercase">
              WEAPON MANAGEMENT
            </h1>
            <p className="font-sans text-xs text-[#8A9070]">
              Military ordnance inventories, hardware types, maintenance protocols, and unit supplies.
            </p>
          </div>
        </div>

        <button
          id="btn-add-weapon"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/20 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Weapon
        </button>
      </div>

      {/* Roster Grid */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} retry={fetchRecords} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={handleAddClick} entityName="Weapon" />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          entityName="Weapon"
        />
      )}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <EntityForm
            fields={formFields}
            initialData={activeItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            title={isEditMode ? 'MODIFY ORDNANCE DETAILS' : 'REGISTER NEW ORDNANCE'}
            isEditMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
