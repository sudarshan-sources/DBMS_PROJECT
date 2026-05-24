import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import StatusBadge from './StatusBadge.js';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  entityName: string;
}

export default function DataTable({ columns, data, onEdit, onDelete, entityName }: DataTableProps) {
  // Inline confirmation state to satisfy the iframe window.confirm restriction
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Auto-find primary key (e.g., Soldier_ID, Weapon_ID)
  const getPrimaryKey = (item: any): string => {
    const key = Object.keys(item).find((k) => k.endsWith('_ID'));
    return key ? item[key] : '';
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <div id="data-table-container">
      {/* 1. Desktop Tabular Grid View (Visible on md and larger) */}
      <div className="hidden md:block overflow-x-auto rounded border border-[#3D4A22] bg-[#2C3318] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1A1F0E] text-[#C9A84C] font-tactical text-xs tracking-wider uppercase border-b border-[#3D4A22]">
              {columns.map((col) => (
                <th key={col.key} className="p-4 font-bold border-b border-[#3D4A22]">
                  {col.label}
                </th>
              ))}
              <th className="p-4 font-bold border-b border-[#3D4A22] text-right">
                TACTICAL ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((item, index) => {
                const id = getPrimaryKey(item);
                const isConfirming = deleteConfirmId === id;

                return (
                  <motion.tr
                    key={id || index}
                    id={`table-row-${id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: isConfirming ? -50 : 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="border-b border-[#3D4A22]/40 bg-[#232B14] odd:bg-[#2C3318] hover:bg-[#354020] transition-colors relative"
                  >
                    {columns.map((col) => {
                      const value = item[col.key];
                      const isId = col.key.endsWith('_ID');
                      const isStatus = col.key.toLowerCase().includes('status');

                      return (
                        <td
                          key={col.key}
                          className={`p-4 font-sans text-xs text-[#E8DFB8] ${
                            isId ? 'font-code text-[#FF9933] font-bold' : ''
                          }`}
                        >
                          {isStatus ? (
                            <StatusBadge status={value} />
                          ) : col.key === 'Soldier_Name' && item.FName && item.LName ? (
                            <span className="font-semibold">{`${item.FName} ${item.LName}`}</span>
                          ) : isId ? (
                            <span>{value}</span>
                          ) : (
                            value ?? <span className="text-[#8A9070] italic">—</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Actions cell */}
                    <td className="p-4 text-right">
                      <AnimatePresence mode="wait">
                        {isConfirming ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-[#D32F2F]/10 border border-[#D32F2F]/50 p-1.5 rounded"
                          >
                            <span className="font-code text-[11px] text-[#D32F2F] tracking-tight font-bold mr-1 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              CONFIRM?
                            </span>
                            <button
                              id={`btn-confirm-del-${id}`}
                              onClick={() => handleConfirmDelete(id)}
                              className="px-2.5 py-1 bg-[#D32F2F] hover:bg-red-700 text-white font-tactical text-xs font-bold rounded cursor-pointer transition-transform active:scale-95"
                            >
                              YES
                            </button>
                            <button
                              id={`btn-abort-del-${id}`}
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2.5 py-1 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] font-tactical text-xs font-bold rounded cursor-pointer transition-transform active:scale-95"
                            >
                              ABORT
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div key="action-buttons" className="inline-flex items-center gap-2">
                            <button
                              id={`btn-edit-${id}`}
                              onClick={() => onEdit(item)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A5A20] hover:bg-[#5C7025] text-[#E8DFB8] font-tactical text-xs font-bold uppercase rounded border border-[#C9A84C]/20 transition-all active:scale-97 cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3 text-[#C9A84C]" />
                              <span>✏️ EDIT</span>
                            </button>
                            <button
                              id={`btn-delete-${id}`}
                              onClick={() => setDeleteConfirmId(id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D32F2F]/20 hover:bg-[#D32F2F]/40 text-[#E8DFB8] font-tactical text-xs font-bold uppercase rounded border border-[#D32F2F]/40 transition-all active:scale-97 hover:animate-shake cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 text-[#D32F2F]" />
                              <span>🗑 DELETE</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card Stack Layout (Visible on screens < 768px) */}
      <div id="mobile-card-stack" className="block md:hidden space-y-4 pb-20">
        <AnimatePresence>
          {data.map((item, index) => {
            const id = getPrimaryKey(item);
            const isConfirming = deleteConfirmId === id;

            return (
              <motion.div
                key={id || index}
                id={`mobile-card-${id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="p-5 rounded border border-[#3D4A22] bg-[#2C3318] shadow-lg relative flex flex-col gap-3"
              >
                {/* Brass Gold Top Banner */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />

                {/* Card Header: Primary ID & Edit Action */}
                <div className="flex items-center justify-between border-b border-[#3D4A22]/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-tactical text-xs text-[#8A9070] font-bold uppercase">
                      ID NO:
                    </span>
                    <span className="font-code text-sm font-black text-[#FF9933]">
                      {id}
                    </span>
                  </div>
                  <div>
                    <span className="font-code text-[10px] text-[#8A9070]">
                      SECURED REPORT
                    </span>
                  </div>
                </div>

                {/* Fields List */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                  {columns
                    .filter((col) => !col.key.endsWith('_ID'))
                    .map((col) => {
                      const val = item[col.key];
                      const isStatus = col.key.toLowerCase().includes('status');

                      return (
                        <div key={col.key} className="flex flex-col">
                          <span className="font-tactical text-[11px] font-bold text-[#8A9070] uppercase tracking-wider leading-none">
                            {col.label}
                          </span>
                          <span className="font-sans text-xs text-[#E8DFB8] mt-1 break-words">
                            {isStatus ? (
                              <StatusBadge status={val} />
                            ) : col.key === 'Soldier_Name' && item.FName && item.LName ? (
                              `${item.FName} ${item.LName}`
                            ) : (
                              val ?? <span className="text-[#8A9070] italic">—</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                </div>

                {/* Tactical Actions Footer */}
                <div className="border-t border-[#3D4A22]/50 pt-3 mt-1 flex items-center justify-end gap-2">
                  <AnimatePresence mode="wait">
                    {isConfirming ? (
                      <motion.div
                        key="confirm-mobile"
                        className="flex items-center gap-2 bg-[#D32F2F]/10 border border-[#D32F2F]/40 p-1.5 rounded w-full justify-between"
                      >
                        <span className="font-code text-[11px] text-[#D32F2F] tracking-tight font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          CONFIRM DELETION?
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            id={`btn-mobile-confirm-${id}`}
                            onClick={() => handleConfirmDelete(id)}
                            className="px-3 py-1 bg-[#D32F2F] hover:bg-red-700 text-white font-tactical text-xs font-bold rounded cursor-pointer"
                          >
                            YES
                          </button>
                          <button
                            id={`btn-mobile-abort-${id}`}
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1 bg-[#4A5A20] text-[#E8DFB8] font-tactical text-xs font-bold rounded cursor-pointer"
                          >
                            ABORT
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex justify-end gap-2 w-full">
                        <button
                          id={`btn-mobile-edit-${id}`}
                          onClick={() => onEdit(item)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#4A5A20] text-[#E8DFB8] font-tactical text-xs font-extrabold rounded cursor-pointer border border-[#C9A84C]/30"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-[#C9A84C]" />
                          EDIT
                        </button>
                        <button
                          id={`btn-mobile-del-${id}`}
                          onClick={() => setDeleteConfirmId(id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#D32F2F]/25 text-[#E8DFB8] font-tactical text-xs font-extrabold rounded cursor-pointer border border-[#D32F2F]/40"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[#D32F2F]" />
                          DELETE
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
