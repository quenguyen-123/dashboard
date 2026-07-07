import React, { useState } from 'react';
import KPICards from './KPICards';
import Filters from './Filters';
import DataTable from './DataTable';
import AIReport from './AIReport';
import ExportMenu from './ExportMenu';
import ThemeToggle from './ThemeToggle';
import { useFilters } from '../hooks/useFilters';
import { calculateKPIs, calculateChartData } from '../services/kpiCalculator';
import {
  DepartmentDistribution, GenderDistribution, AgeDistribution, SalaryDistribution,
  SalaryByDepartment, PerformanceDistribution, EngagementDistribution,
  TrainingVsPerformance, SalaryVsPerformance, PromotionByDepartment,
  HiringTrend, LeavingTrend, TurnoverRate, TopSalaryEmployees, TopEngagementDepts
} from './Charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LayoutDashboard, Table as TableIcon, Bot } from 'lucide-react';

export default function Dashboard({ datasetContext }) {
  const { processedData, columnMapping, fileName } = datasetContext;
  
  const { filters, filterOptions, filteredData, activeFilterCount, updateFilter, resetFilters } = useFilters(processedData);

  const kpis = calculateKPIs(filteredData, columnMapping);
  const chartData = calculateChartData(filteredData, columnMapping);

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-primary">Phân tích Nhân sự</h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border-l pl-4">
              <span className="truncate max-w-[200px]">{fileName}</span>
              <span className="px-2 py-0.5 rounded bg-muted text-xs">
                {filteredData.length.toLocaleString('vi-VN')} bản ghi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportMenu kpis={kpis} filters={filters} dataSnapshot={filteredData} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 sm:px-8 py-6 max-w-full space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" /> <span>Xem Dữ liệu</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Bot className="w-4 h-4" /> <span>AI Insights</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Filters 
            filters={filters} 
            options={filterOptions} 
            activeCount={activeFilterCount}
            onUpdate={updateFilter} 
            onReset={resetFilters} 
          />
        </div>

        {/* Dashboard View */}
        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
          <div id="dashboard-content" className="space-y-6 pb-20">
            <KPICards kpis={kpis} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <DepartmentDistribution data={chartData.departmentDistribution} />
              <GenderDistribution data={chartData.genderDistribution} />
              <AgeDistribution data={chartData.ageDistribution} />
              
              <SalaryDistribution data={chartData.salaryDistribution} />
              <SalaryByDepartment data={chartData.salaryByDepartment} />
              <TopSalaryEmployees data={chartData.topSalaryEmployees} />
              
              <PerformanceDistribution data={chartData.performanceDistribution} />
              <EngagementDistribution data={chartData.engagementDistribution} />
              <TopEngagementDepts data={chartData.topEngagementDepts} />
              
              <TrainingVsPerformance data={chartData.trainingVsPerformance} />
              <SalaryVsPerformance data={chartData.salaryVsPerformance} />
              <PromotionByDepartment data={chartData.promotionByDepartment} />
              
              <HiringTrend data={chartData.hiringTrend} />
              <LeavingTrend data={chartData.leavingTrend} />
              <TurnoverRate data={chartData.turnoverRate} className="xl:col-span-2" />
            </div>
          </div>
        </div>

        {/* Data View */}
        <div className={activeTab === 'data' ? 'block' : 'hidden'}>
          <DataTable data={filteredData} columnMapping={columnMapping} />
        </div>

        {/* AI Report View */}
        <div className={activeTab === 'ai' ? 'block' : 'hidden'}>
          <AIReport kpis={kpis} filters={filters} dataSnapshot={filteredData.slice(0, 50)} />
        </div>

      </div>
    </div>
  );
}
