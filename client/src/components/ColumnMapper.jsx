import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ColumnMapper({ datasetContext, onClose }) {
  const { columns, columnMapping, warnings, updateColumnMapping } = datasetContext;
  const [localMapping, setLocalMapping] = useState({ ...columnMapping });

  const requiredFields = [
    { key: 'employee_id', label: 'Mã Nhân viên (ID)', required: true },
    { key: 'department', label: 'Phòng ban', required: true },
    { key: 'hire_date', label: 'Ngày vào làm', required: false },
    { key: 'termination_date', label: 'Ngày thôi việc', required: false },
    { key: 'gender', label: 'Giới tính', required: false },
    { key: 'age', label: 'Tuổi', required: false },
    { key: 'salary', label: 'Mức lương', required: false },
    { key: 'performance_score', label: 'Điểm Hiệu suất', required: false },
    { key: 'engagement_score', label: 'Điểm Gắn kết', required: false },
    { key: 'training_hours', label: 'Giờ Đào tạo', required: false },
    { key: 'absence_days', label: 'Số ngày vắng mặt', required: false },
    { key: 'promotion_count', label: 'Số lần thăng tiến', required: false },
  ];

  const handleMap = (fieldKey, sourceColumn) => {
    setLocalMapping(prev => {
      const next = { ...prev };
      if (!sourceColumn) {
        delete next[fieldKey];
      } else {
        Object.keys(next).forEach(k => {
          if (next[k] === sourceColumn) delete next[k];
        });
        next[fieldKey] = sourceColumn;
      }
      return next;
    });
  };

  const handleSave = () => {
    updateColumnMapping(localMapping);
    onClose();
  };

  const missingRequired = requiredFields.filter(f => f.required && !localMapping[f.key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl rounded-2xl shadow-xl border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Ánh xạ Cột dữ liệu</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Hệ thống đã tự động nhận diện các cột. Vui lòng kiểm tra và khớp lại nếu cần.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-accent border space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Cảnh báo nhận diện
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                {warnings.map((w, i) => (
                  <li key={i} className={w.type === 'error' ? 'text-destructive font-medium' : ''}>
                    {w.message.replace('Required column', 'Cột bắt buộc').replace('not detected. Please map it manually.', 'không được phát hiện. Vui lòng tự ánh xạ.')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredFields.map(field => {
              const mappedCol = localMapping[field.key];
              const isMissing = field.required && !mappedCol;

              return (
                <div 
                  key={field.key} 
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    isMissing ? "border-destructive/50 bg-destructive/5" : "bg-card",
                    mappedCol && !isMissing ? "border-primary/20" : ""
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-sm flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {mappedCol ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground/30" />
                    )}
                  </div>
                  
                  <select
                    value={mappedCol || ''}
                    onChange={(e) => handleMap(field.key, e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="">-- Chưa ánh xạ --</option>
                    {columns.map(col => {
                      const isUsed = Object.entries(localMapping).some(([k, v]) => v === col && k !== field.key);
                      return (
                        <option key={col} value={col} disabled={isUsed}>
                          {col} {isUsed ? '(đang dùng)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {missingRequired.length > 0 ? (
              <span className="text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Thiếu cột bắt buộc: {missingRequired.map(f => f.label).join(', ')}
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đã ánh xạ đủ các trường bắt buộc
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium border hover:bg-accent transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={missingRequired.length > 0}
              className="px-6 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              Áp dụng <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
