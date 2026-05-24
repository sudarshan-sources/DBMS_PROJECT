import React, { useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios.js';
import { useToast } from '../hooks/useToast.js';
import { Mission } from '../types';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import EmptyState from '../components/EmptyState.js';
import DataTable from '../components/DataTable.js';
import EntityForm, { FormField } from '../components/EntityForm.js';

export default function Missions() {
  const [data, setData] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Mission | null>(null);

  const { showToast } = useToast();

  const columns = [
    { key: 'Mission_ID', label: 'MISSION ID' },
    { key: 'Name', label: 'TACTICAL MISSION' },
    { key: 'Location', label: 'LOCATION FIELD' },
    { key: 'Mission_Date', label: 'DEPLOYMENT DATE' },
    { key: 'Status', label: 'TACTICAL STATUS' }
  ];

  const formFields: FormField[] = [
    { name: 'Mission_ID', label: 'Mission ID Code', type: 'text', required: true, disabledOnEdit: true },
    { name: 'Name', label: 'Mission Operation Name', type: 'text', required: true },
    { name: 'Location', label: 'Geographic Area / Sector', type: 'text', required: true },
    { name: 'Mission_Date', label: 'Deployment Start Date', type: 'date', required: true },
    {
      name: 'Status',
      label: 'Operation State Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Completed', label: 'COMPLETED - SUCCESS' },
        { value: 'Ongoing', label: 'ONGOING - IN ACTION' },
        { value: 'Planned', label: 'PLANNED - PREPARATIONS' }
      ]
    }
  ];

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/api/missions');
      // Format dates nicely to YYYY-MM-DD for form editing
      const baseList = Array.isArray(resp.data) ? resp.data : [];
      const formatted = baseList.map((m: any) => {
        if (m.Mission_Date) {
          return {
            ...m,
            Mission_Date: m.Mission_Date.split('T')[0]
          };
        }
        return m;
      });
      setData(formatted);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failure loading database mission parameters.');
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

  const handleEditClick = (item: Mission) => {
    setActiveItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/missions/${id}`);
      showToast('Tactical operation scrubbed successfully.');
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete record.';
      showToast(errMsg, 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditMode && activeItem) {
        await api.put(`/api/missions/${activeItem.Mission_ID}`, formData);
        showToast(`Mission parameters M-${activeItem.Mission_ID} re-assigned.`);
      } else {
        await api.post('/api/missions', formData);
        showToast(`New military operation M-${formData.Mission_ID} deployed successfully.`);
      }
      setIsFormOpen(false);
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Operation parameter upload locked.';
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
      <div id="missions-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3D4A22] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#2C3318] border border-[#3D4A22]">
            <Target className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-tactical text-2xl font-black text-[#E8DFB8] tracking-widest uppercase">
              TACTICAL MISSION OPERATIONS
            </h1>
            <p className="font-sans text-xs text-[#8A9070]">
              Border security efforts, ongoing rescue operations, geographic combat sectors, and timeline statuses.
            </p>
          </div>
        </div>

        <button
          id="btn-add-mission"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/25 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Deploy Mission
        </button>
      </div>

      {/* Main Panel grid */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} retry={fetchRecords} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={handleAddClick} entityName="Mission" />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          entityName="Mission"
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
            title={isEditMode ? 'MODIFY MISSION STATEMENTS' : 'DEPLOY TACTICAL OPERATION'}
            isEditMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
