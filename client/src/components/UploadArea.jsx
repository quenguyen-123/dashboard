import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ColumnMapper from './ColumnMapper';

export default function UploadArea({ datasetContext }) {
  const { handleFileUpload, isLoading, error, datasetHistory, selectSheet, clearHistory } = datasetContext;
  const [showMapper, setShowMapper] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    try {
      const result = await handleFileUpload(acceptedFiles[0]);
      setUploadResult(result);
      if (result.warnings && result.warnings.length > 0) {
        setShowMapper(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background/50">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10 text-primary">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Hệ thống Phân tích Nhân sự</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tải lên tập dữ liệu HR của bạn để tự động tạo bảng điều khiển, tính toán KPIs và nhận thông tin chi tiết từ AI.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/15 text-destructive border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Lỗi Tải lên</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div 
          {...getRootProps()} 
          className={cn(
            "relative group overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-200 ease-out cursor-pointer bg-card hover:shadow-lg",
            isDragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={cn(
              "p-4 rounded-full transition-colors duration-200",
              isDragActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {isDragActive ? "Thả file Excel của bạn vào đây" : "Nhấp hoặc kéo thả để tải lên"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Hỗ trợ định dạng .xlsx và .xls
              </p>
            </div>
          </div>
        </div>

        {datasetHistory.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Dữ liệu gần đây</h3>
              <button 
                onClick={clearHistory}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Xóa lịch sử
              </button>
            </div>
            <div className="grid gap-3">
              {datasetHistory.map((dataset) => (
                <div 
                  key={dataset.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">{dataset.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(dataset.uploadedAt).toLocaleDateString('vi-VN')} • {dataset.rowCount.toLocaleString('vi-VN')} dòng • Sheet: {dataset.sheetName}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    Tải lại <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showMapper && (
        <ColumnMapper 
          datasetContext={datasetContext} 
          onClose={() => setShowMapper(false)} 
        />
      )}
    </div>
  );
}
