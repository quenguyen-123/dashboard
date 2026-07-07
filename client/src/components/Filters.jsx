import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Filter, RotateCcw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export default function Filters({ filters, options, activeCount, onUpdate, onReset }) {
  
  const handleMultiSelect = (key, value) => {
    const current = filters[key] || [];
    if (current.includes(value)) {
      onUpdate(key, current.filter(v => v !== value));
    } else {
      onUpdate(key, [...current, value]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="w-4 h-4" />
          Bộ lọc
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onReset} className="h-8 gap-2 text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pb-20">
            
            {/* Trạng thái làm việc */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Trạng thái nhân viên</h4>
              <Select value={filters.terminationStatus} onValueChange={(v) => onUpdate('terminationStatus', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả nhân sự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhân sự</SelectItem>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="terminated">Đã thôi việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            
            {/* Phòng ban */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex justify-between items-center">
                Phòng ban
                {filters.departments.length > 0 && (
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                    Đã chọn {filters.departments.length}
                  </span>
                )}
              </h4>
              <div className="flex flex-wrap gap-2">
                {options.departments.map(dept => (
                  <Badge 
                    key={dept} 
                    variant={filters.departments.includes(dept) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handleMultiSelect('departments', dept)}
                  >
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            
            {/* Giới tính */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex justify-between items-center">
                Giới tính
                {filters.genders.length > 0 && (
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                    Đã chọn {filters.genders.length}
                  </span>
                )}
              </h4>
              <div className="flex flex-wrap gap-2">
                {options.genders.map(gender => {
                  const vnGender = gender === 'Male' ? 'Nam' : gender === 'Female' ? 'Nữ' : 'Khác';
                  return (
                    <Badge 
                      key={gender} 
                      variant={filters.genders.includes(gender) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleMultiSelect('genders', gender)}
                    >
                      {vnGender}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Separator />
            
            {/* Độ tuổi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Độ tuổi</h4>
                <span className="text-xs text-muted-foreground">
                  {filters.ageRange[0]} - {filters.ageRange[1]} tuổi
                </span>
              </div>
              <Slider 
                min={options.ageRange[0] || 0} 
                max={options.ageRange[1] || 100} 
                step={1} 
                value={filters.ageRange}
                onValueChange={(val) => onUpdate('ageRange', val)}
                className="pt-2"
              />
            </div>
            <Separator />
            
            {/* Mức lương */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Mức lương</h4>
                <span className="text-xs text-muted-foreground">
                  ${(filters.salaryRange[0] / 1000).toFixed(0)}k - ${(filters.salaryRange[1] / 1000).toFixed(0)}k
                </span>
              </div>
              <Slider 
                min={options.salaryRange[0] || 0} 
                max={options.salaryRange[1] || 1000000} 
                step={1000} 
                value={filters.salaryRange}
                onValueChange={(val) => onUpdate('salaryRange', val)}
                className="pt-2"
              />
            </div>
            <Separator />

            {/* Điểm Hiệu suất */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Điểm Hiệu suất</h4>
                <span className="text-xs text-muted-foreground">
                  {filters.performanceScore[0]} - {filters.performanceScore[1]}
                </span>
              </div>
              <Slider 
                min={options.performanceRange[0] || 0} 
                max={options.performanceRange[1] || 10} 
                step={1} 
                value={filters.performanceScore}
                onValueChange={(val) => onUpdate('performanceScore', val)}
                className="pt-2"
              />
            </div>
            
            {/* Năm tuyển dụng */}
            {options.hireYears.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Năm vào làm</h4>
                  <Select value={filters.hireYear.toString()} onValueChange={(v) => onUpdate('hireYear', v === 'all' ? 'all' : parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả các năm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả các năm</SelectItem>
                      {options.hireYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
