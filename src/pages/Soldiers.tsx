import React, { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios.js';
import { useToast } from '../hooks/useToast.js';
import { Soldier } from '../types';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import EmptyState from '../components/EmptyState.js';
import DataTable from '../components/DataTable.js';
import EntityForm, { FormField } from '../components/EntityForm.js';

export default function Soldiers() {
  const [data, setData] = useState<Soldier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form overlay states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Soldier | null>(null);

  const { showToast } = useToast();

  const columns = [
    { key: 'Soldier_ID', label: 'SOLDIER ID' },
    { key: 'Soldier_Name', label: 'FULL NAME' },
    { key: 'Rank_Name', label: 'RANK' },
    { key: 'Department', label: 'DEPARTMENT' },
    { key: 'Age', label: 'AGE' },
    { key: 'Phone_Number', label: 'CONTACT' },
    { key: 'Posting_Location', label: 'POSTING LOCATION' }
  ];

  const formFields: FormField[] = [
    { name: 'Soldier_ID', label: 'Soldier ID', type: 'text', required: true, disabledOnEdit: true },
    { name: 'FName', label: 'First Name', type: 'text', required: true },
    { name: 'LName', label: 'Last Name', type: 'text', required: true },
    { name: 'Rank_Name', label: 'Rank Label', type: 'text', required: true },
    { name: 'Department', label: 'Department / Division', type: 'text', required: true },
    { name: 'Age', label: 'Age', type: 'number', required: false },
    { name: 'Phone_Number', label: 'Secure Contact Phone', type: 'text', required: false },
    { name: 'Posting_Location', label: 'Posting Sector / base', type: 'text', required: true }
  ];

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/api/soldiers');
      setData(Array.isArray(resp.data) ? resp.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failure loading database intelligence.');
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

  const handleEditClick = (item: Soldier) => {
    setActiveItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/soldiers/${id}`);
      showToast('Personnel file deleted successfully.');
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete record.';
      showToast(errMsg, 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditMode && activeItem) {
        await api.put(`/api/soldiers/${activeItem.Soldier_ID}`, formData);
        showToast(`Personnel profile S-${activeItem.Soldier_ID} updated successfully.`);
      } else {
        await api.post('/api/soldiers', formData);
        showToast(`New personnel profile S-${formData.Soldier_ID} deployed successfully.`);
      }
      setIsFormOpen(false);
      fetchRecords();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Form action blocked by strategic security check.';
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
      <div id="soldiers-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3D4A22] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#2C3318] border border-[#3D4A22]">
            <Users className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-tactical text-2xl font-black text-[#E8DFB8] tracking-widest uppercase">
              SOLDIER ROSTER
            </h1>
            <p className="font-sans text-xs text-[#8A9070]">
              Active service members, rank assignments, and strategic sector postings.
            </p>
          </div>
        </div>

        <button
          id="btn-add-soldier"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/20 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Soldier
        </button>
      </div>

      {/* Main Panel Area */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} retry={fetchRecords} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={handleAddClick} entityName="Soldier" />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          entityName="Soldier"
        />
      )}

      {/* Slide-in Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <EntityForm
            fields={formFields}
            initialData={activeItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            title={isEditMode ? 'EDIT SOLDIER PROFILE' : 'DEPLOY NEW SOLDIER PROFILE'}
            isEditMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
