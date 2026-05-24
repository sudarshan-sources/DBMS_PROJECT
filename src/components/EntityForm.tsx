import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert } from 'lucide-react';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required?: boolean;
  options?: FormFieldOption[];
  disabledOnEdit?: boolean;
}

interface EntityFormProps {
  fields: FormField[];
  initialData?: any | null;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  title: string;
  isEditMode: boolean;
}

export default function EntityForm({
  fields,
  initialData,
  onSubmit,
  onCancel,
  title,
  isEditMode
}: EntityFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Set empty/default states
      const defaults: any = {};
      fields.forEach((f) => {
        if (f.type === 'select' && f.options && f.options.length > 0) {
          defaults[f.name] = f.options[0].value;
        } else {
          defaults[f.name] = '';
        }
      });
      setFormData(defaults);
    }
    setErrors({});
  }, [initialData, fields]);

  // Handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
    
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form submit and validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required && (val === undefined || val === null || String(val).trim() === '')) {
        newErrors[field.name] = `Tactical warning: ${field.label} is mandatory.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div id="entity-form-drawer" className="fixed inset-0 z-50 flex justify-end">
      {/* Black Backdrop Overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-in Form Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg h-full bg-[#2C3318] border-l border-[#3D4A22] shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Brass-gold top strip header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C9A84C]" />

        {/* Header Block */}
        <div className="px-6 py-5 border-b border-[#3D4A22] bg-[#1A1F0E]/40 flex items-center justify-between mt-1">
          <div>
            <span className="font-code text-[10px] text-[#C9A84C] tracking-widest uppercase">
              SECTOR OPERATIONS COMMAND
            </span>
            <h3 className="font-tactical text-xl md:text-2xl font-black text-[#E8DFB8] tracking-wider uppercase mt-0.5">
              {title}
            </h3>
          </div>
          <button
            id="form-btn-close-drawer"
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full bg-[#1A1F0E]/45 border border-[#3D4A22] text-[#8A9070] hover:text-[#E8DFB8] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="drawer-form-element" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {fields.map((field) => {
            const isPrimaryKey = field.name.endsWith('_ID');
            // Disable on edit if it's the primary key ID
            const isFieldDisabled = isEditMode && isPrimaryKey;
            const hasError = !!errors[field.name];

            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="font-tactical font-extrabold text-[#E8DFB8] text-xs uppercase tracking-widest flex items-center"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-[#FF9933] ml-1 font-bold" title="Mandatory field">
                      *
                    </span>
                  )}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={`input-${field.name}`}
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    disabled={isFieldDisabled}
                    onChange={handleChange}
                    className={`font-sans text-sm text-[#E8DFB8] bg-[#1A1F0E] p-3 rounded border ${
                      hasError ? 'border-[#D32F2F]' : 'border-[#3D4A22]'
                    } focus:border-[#C9A84C] focus:outline-hidden focus:ring-2 focus:ring-[#C9A84C]/30 transition-all ${
                      isFieldDisabled ? 'opacity-50 cursor-not-allowed bg-black/40' : 'cursor-pointer'
                    }`}
                  >
                    {field.options && field.options.length > 0 ? (
                      field.options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#2C3318] text-[#E8DFB8]">
                          {opt.label}
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#2C3318] text-[#8A9070]">
                        No profiles found
                      </option>
                    )}
                  </select>
                ) : (
                  <input
                    id={`input-${field.name}`}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] ?? ''}
                    disabled={isFieldDisabled}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={`font-sans text-sm text-[#E8DFB8] bg-[#1A1F0E] p-3 rounded border ${
                      hasError ? 'border-[#D32F2F]' : 'border-[#3D4A22]'
                    } focus:border-[#C9A84C] focus:outline-hidden focus:ring-2 focus:ring-[#C9A84C]/30 transition-all ${
                      isFieldDisabled ? 'opacity-50 cursor-not-allowed bg-black/40' : ''
                    }`}
                  />
                )}

                {/* Validation error msg */}
                <AnimatePresence>
                  {hasError && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="font-code text-[11px] text-[#D32F2F] flex items-center gap-1 mt-0.5"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {errors[field.name]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </form>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-[#3D4A22] bg-[#1A1F0E]/40 flex items-center gap-3">
          <button
            id="drawer-btn-deploy"
            type="submit"
            form="drawer-form-element"
            className="flex-1 py-3 bg-gradient-to-r from-[#4A5A20] to-[#5C7025] hover:from-[#5C7025] hover:to-[#6E852D] text-[#E8DFB8] hover:text-[#C9A84C] font-tactical font-black text-sm tracking-widest uppercase rounded border-b-2 border-[#C9A84C] transition-all hover:shadow-lg active:scale-97 cursor-pointer"
          >
            DEPLOY RECORD
          </button>
          <button
            id="drawer-btn-abort"
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-[#1A1F0E] hover:bg-[#D32F2F]/15 hover:text-[#D32F2F] text-[#8A9070] font-tactical font-bold text-sm tracking-wide uppercase rounded border border-[#3D4A22] transition-colors active:scale-97 cursor-pointer"
          >
            ABORT
          </button>
        </div>
      </motion.div>
    </div>
  );
}
