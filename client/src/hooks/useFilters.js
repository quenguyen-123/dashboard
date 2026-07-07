import { useState, useCallback, useMemo } from 'react';

export function useFilters(processedData) {
  const [filters, setFilters] = useState({
    departments: [],
    genders: [],
    ageRange: [0, 100],
    salaryRange: [0, 1000000],
    performanceScore: [0, 10],
    hireYear: 'all',
    terminationStatus: 'all',
  });

  const filterOptions = useMemo(() => {
    if (!processedData || processedData.length === 0) return {
      departments: [], genders: [], ageRange: [0, 100],
      salaryRange: [0, 1000000], performanceRange: [0, 10], hireYears: [],
    };
    const departments = [...new Set(processedData.map(r => r.department).filter(Boolean))].sort();
    const genders = [...new Set(processedData.map(r => r.gender).filter(Boolean))].sort();
    const ages = processedData.map(r => r.age).filter(a => a != null);
    const ageRange = ages.length > 0 ? [Math.min(...ages), Math.max(...ages)] : [0, 100];
    const salaries = processedData.map(r => r.salary).filter(s => s != null);
    const salaryRange = salaries.length > 0 ? [Math.min(...salaries), Math.max(...salaries)] : [0, 1000000];
    const performances = processedData.map(r => r.performance_score).filter(p => p != null);
    const performanceRange = performances.length > 0 ? [Math.min(...performances), Math.max(...performances)] : [0, 10];
    const hireYears = [...new Set(processedData.map(r => {
      if (r.hire_date instanceof Date) return r.hire_date.getFullYear();
      if (r.hire_date) { const d = new Date(r.hire_date); if (!isNaN(d.getTime())) return d.getFullYear(); }
      return null;
    }).filter(Boolean))].sort();
    return { departments, genders, ageRange, salaryRange, performanceRange, hireYears };
  }, [processedData]);

  const filteredData = useMemo(() => {
    if (!processedData) return [];
    return processedData.filter(row => {
      if (filters.departments.length > 0 && !filters.departments.includes(row.department)) return false;
      if (filters.genders.length > 0 && !filters.genders.includes(row.gender)) return false;
      if (row.age != null) {
        if (row.age < filters.ageRange[0] || row.age > filters.ageRange[1]) return false;
      }
      if (row.salary != null) {
        if (row.salary < filters.salaryRange[0] || row.salary > filters.salaryRange[1]) return false;
      }
      if (row.performance_score != null) {
        if (row.performance_score < filters.performanceScore[0] || row.performance_score > filters.performanceScore[1]) return false;
      }
      if (filters.hireYear !== 'all') {
        const hireDate = row.hire_date instanceof Date ? row.hire_date : new Date(row.hire_date);
        if (isNaN(hireDate.getTime()) || hireDate.getFullYear() !== parseInt(filters.hireYear)) return false;
      }
      if (filters.terminationStatus === 'active') {
        if (row.termination_date && row.termination_date !== '') return false;
      } else if (filters.terminationStatus === 'terminated') {
        if (!row.termination_date || row.termination_date === '') return false;
      }
      return true;
    });
  }, [processedData, filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      departments: [],
      genders: [],
      ageRange: filterOptions.ageRange || [0, 100],
      salaryRange: filterOptions.salaryRange || [0, 1000000],
      performanceScore: filterOptions.performanceRange || [0, 10],
      hireYear: 'all',
      terminationStatus: 'all',
    });
  }, [filterOptions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.departments.length > 0) count++;
    if (filters.genders.length > 0) count++;
    if (filters.hireYear !== 'all') count++;
    if (filters.terminationStatus !== 'all') count++;
    if (filterOptions.ageRange && (filters.ageRange[0] !== filterOptions.ageRange[0] || filters.ageRange[1] !== filterOptions.ageRange[1])) count++;
    if (filterOptions.salaryRange && (filters.salaryRange[0] !== filterOptions.salaryRange[0] || filters.salaryRange[1] !== filterOptions.salaryRange[1])) count++;
    return count;
  }, [filters, filterOptions]);

  return { filters, filterOptions, filteredData, activeFilterCount, updateFilter, resetFilters, setFilters };
}
