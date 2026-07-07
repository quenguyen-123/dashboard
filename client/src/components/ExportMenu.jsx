import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { buttonVariants } from './ui/button';
import { Download, FileText, FileSpreadsheet, Image as ImageIcon, Loader2 } from 'lucide-react';
import { exportDashboardPNG, exportCSV } from '../services/exportService';
import { cn } from '../lib/utils';

export default function ExportMenu({ kpis, filters, dataSnapshot }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    exportCSV(dataSnapshot);
  };

  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      await exportDashboardPNG('dashboard-content');
    } catch (err) {
      console.error(err);
      alert('Không thể xuất ảnh PNG');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "gap-2")} disabled={isExporting}>
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Xuất dữ liệu
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Tải xuống Dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPNG} className="cursor-pointer gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          <span>Xuất biểu đồ dạng PNG</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Xuất bảng tính dạng CSV</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2 text-muted-foreground" title="Vui lòng tạo báo cáo AI trước để tải định dạng PDF/Word">
          <FileText className="w-4 h-4" />
          <span>Lưu Báo cáo AI (tại tab AI)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
