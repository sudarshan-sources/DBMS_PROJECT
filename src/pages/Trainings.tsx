import React, { useEffect, useState } from 'react';
import { Plus, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api/axios.js';
import { useToast } from '../hooks/useToast.js';
import { Training, Soldier } from '../types';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import EmptyState from '../components/EmptyState.js';
import DataTable from '../components/DataTable.js';
import EntityForm, { FormField } from '../components/EntityForm.js';

export default function Trainings() {
  const [data, setData] = useState<Training[]>([]);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<Training | null>(null);

  const { showToast } = useToast();

  const columns = [
    { key: 'Training_ID', label: 'TRAINING ID' },
    { key: 'Soldier_ID', label: 'SOLDIER ID' },
    { key: 'Soldier_Name', label: 'TRAINED SERVICE MEMBER' },
    { key: 'Type', label: 'TRAINING REGIMEN' },
    { key: 'Training_Name', label: 'EXERCISE TITLE' },
    { key: 'Training_Status', label: 'READINESS STATUS' }
  ];

  // Dynamic builder for formFields which maps active soldiers list as select choices
  const getFormFields = (): FormField[] => {
    const soldierOptions = soldiers.map((s) => ({
      value: s.Soldier_ID,
      label: `[${s.Soldier_ID}] ${s.FName} ${s.LName} (${s.Rank_Name})`
    }));

    return [
      { name: 'Training_ID', label: 'Training Exercise ID', type: 'text', required: true, disabledOnEdit: true },
      {
        name: 'Soldier_ID',
        label: 'Trained Service Soldier Option',
        type: 'select',
        required: true,
        options: soldierOptions
      },
      { name: 'Type', label: 'Training Category Class', type: 'text', required: true },
      { name: 'Training_Name', label: 'Course / Exercise Name', type: 'text', required: true },
      {
        name: 'Training_Status',
        label: 'Exercise Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Completed', label: 'COMPLETED - PASSED READY' },
          { value: 'Ongoing', label: 'ONGOING - UNDERGOING DRILLS' },
          { value: 'Planned', label: 'PLANNED - RE-QUALIFICATION' }
        ]
      }
    ];
  };

  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trainingsResp, soldiersResp] = await Promise.all([
        api.get('/api/trainings'),
        api.get('/api/soldiers')
      ]);
      setData(Array.isArray(trainingsResp.data) ? trainingsResp.data : []);
      setSoldiers(Array.isArray(soldiersResp.data) ? soldiersResp.data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failure loading combatant training schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleAddClick = () => {
    if (soldiers.length === 0) {
      showToast('Tactical Alert: Deploy at least one Soldier first before managing training profiles.', 'error');
      return;
    }
    setActiveItem(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: Training) => {
    setActiveItem(item);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/trainings/${id}`);
      showToast('Training deployment record archived successfully.');
      loadPageData();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete record.';
      showToast(errMsg, 'error');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (isEditMode && activeItem) {
        await api.put(`/api/trainings/${activeItem.Training_ID}`, formData);
        showToast(`Training file T-${activeItem.Training_ID} updated successfully.`);
      } else {
        await api.post('/api/trainings', formData);
        showToast(`Training exercise T-${formData.Training_ID} posted to soldier S-${formData.Soldier_ID}.`);
      }
      setIsFormOpen(false);
      loadPageData();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Training file rejected by training center.';
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
      <div id="trainings-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#3D4A22] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#2C3318] border border-[#3D4A22]">
            <Award className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-tactical text-2xl font-black text-[#E8DFB8] tracking-widest uppercase">
              TRAINING & COMBAT DRILLS
            </h1>
            <p className="font-sans text-xs text-[#8A9070]">
              Soldier qualification logs, physical readiness regimens, tactical courses, and execution progress.
            </p>
          </div>
        </div>

        <button
          id="btn-add-training"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-extrabold text-sm uppercase rounded cursor-pointer transition-all active:scale-97 border border-[#C9A84C]/20 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Post Training
        </button>
      </div>

      {/* Main Grid Data */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} retry={loadPageData} />
      ) : data.length === 0 ? (
        <EmptyState onAdd={handleAddClick} entityName="Training" />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          entityName="Training"
        />
      )}

      {/* Form Drawer Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <EntityForm
            fields={getFormFields()}
            initialData={activeItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            title={isEditMode ? 'EDIT SOLDIER DRILL' : 'POST NEW READINESS DRILL'}
            isEditMode={isEditMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
