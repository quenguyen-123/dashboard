import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { exportCSV } from '../services/exportService';

export default function DataTable({ data, columnMapping }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== '_originalIndex');
  }, [data]);

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(lowerQuery)
        )
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        return sortConfig.direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCellValue = (val) => {
    if (val === null || val === undefined || val === '') return <span className="text-muted-foreground/50">-</span>;
    if (val instanceof Date) return val.toLocaleDateString('vi-VN');
    return String(val);
  };

  // Map header key to Vietnamese if possible
  const getHeaderLabel = (key) => {
    const translationMap = {
      employee_id: 'Mã Nhân viên',
      department: 'Phòng ban',
      hire_date: 'Ngày vào làm',
      termination_date: 'Ngày nghỉ việc',
      gender: 'Giới tính',
      age: 'Tuổi',
      salary: 'Mức lương',
      performance_score: 'Điểm Hiệu suất',
      engagement_score: 'Điểm Gắn kết',
      training_hours: 'Giờ Đào tạo',
      absence_days: 'Số ngày vắng',
      promotion_count: 'Số lần thăng tiến',
      years_of_service: 'Số năm công tác'
    };
    return translationMap[key] || key;
  };

  return (
    <div className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm mọi trường..." 
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground mr-2">
            Tìm thấy {processedData.length.toLocaleString('vi-VN')} kết quả
          </div>
          <Button variant="outline" size="sm" onClick={() => exportCSV(processedData)} className="gap-2">
            <Download className="w-4 h-4" /> Xuất file CSV
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col} className="whitespace-nowrap font-semibold">
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors select-none"
                      onClick={() => handleSort(col)}
                    >
                      {getHeaderLabel(col)}
                      <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === col ? 'text-primary opacity-100' : 'opacity-20'}`} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                    {columns.map(col => (
                      <TableCell key={col} className="whitespace-nowrap max-w-[200px] truncate">
                        {formatCellValue(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Không tìm thấy kết quả nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Trang {page} / {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
