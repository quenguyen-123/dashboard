export function calculateKPIs(data, columnMapping) {
  if (!data || data.length === 0) return getEmptyKPIs();

  const total = data.length;
  const hasTermDate = columnMapping.termination_date;
  const terminated = hasTermDate 
    ? data.filter(r => r.termination_date && r.termination_date !== '' && r.termination_date !== null).length 
    : 0;
  const active = total - terminated;
  const avgAge = safeAverage(data, 'age');
  const avgSalary = safeAverage(data, 'salary');
  const avgPerformance = safeAverage(data, 'performance_score');
  const avgEngagement = safeAverage(data, 'engagement_score');
  const avgTraining = safeAverage(data, 'training_hours');
  const avgAbsence = safeAverage(data, 'absence_days');
  const promoted = data.filter(r => r.promotion_count && r.promotion_count > 0).length;
  const promotionRate = total > 0 ? (promoted / total) * 100 : 0;
  const turnoverRate = total > 0 ? (terminated / total) * 100 : 0;

  return {
    totalEmployees: total,
    activeEmployees: active,
    terminatedEmployees: terminated,
    avgAge: round(avgAge),
    avgSalary: round(avgSalary),
    avgPerformance: round(avgPerformance, 1),
    avgEngagement: round(avgEngagement, 1),
    avgTraining: round(avgTraining, 1),
    avgAbsence: round(avgAbsence, 1),
    promotionRate: round(promotionRate, 1),
    turnoverRate: round(turnoverRate, 1),
  };
}

export function calculateChartData(data, columnMapping) {
  return {
    departmentDistribution: getDepartmentDistribution(data),
    genderDistribution: getGenderDistribution(data),
    ageDistribution: getAgeDistribution(data),
    salaryDistribution: getSalaryDistribution(data),
    salaryByDepartment: getSalaryByDepartment(data),
    performanceDistribution: getPerformanceDistribution(data),
    engagementDistribution: getEngagementDistribution(data),
    trainingVsPerformance: getTrainingVsPerformance(data),
    salaryVsPerformance: getSalaryVsPerformance(data),
    promotionByDepartment: getPromotionByDepartment(data),
    hiringTrend: getHiringTrend(data),
    leavingTrend: getLeavingTrend(data),
    turnoverRate: getTurnoverRate(data),
    topSalaryEmployees: getTopSalaryEmployees(data),
    topEngagementDepts: getTopEngagementDepts(data),
  };
}

function getDepartmentDistribution(data) {
  return groupAndCount(data, 'department');
}

function getGenderDistribution(data) {
  return groupAndCount(data, 'gender');
}

function getAgeDistribution(data) {
  const ages = data.map(r => r.age).filter(a => a !== null && a !== undefined);
  if (ages.length === 0) return [];
  const buckets = {};
  ages.forEach(age => {
    const bucket = `${Math.floor(age / 5) * 5}-${Math.floor(age / 5) * 5 + 4}`;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });
  return Object.entries(buckets)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([range, count]) => ({ range, count }));
}

function getSalaryDistribution(data) {
  const salaries = data.map(r => r.salary).filter(s => s !== null && s !== undefined);
  if (salaries.length === 0) return [];
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const bucketSize = Math.ceil((max - min) / 10) || 1;
  const buckets = {};
  salaries.forEach(s => {
    const bucketStart = Math.floor((s - min) / bucketSize) * bucketSize + min;
    const label = `${formatCurrency(bucketStart)}-${formatCurrency(bucketStart + bucketSize)}`;
    buckets[label] = (buckets[label] || 0) + 1;
  });
  return Object.entries(buckets)
    .sort((a, b) => {
      const aVal = parseInt(a[0].replace(/[^0-9]/g, ''));
      const bVal = parseInt(b[0].replace(/[^0-9]/g, ''));
      return aVal - bVal;
    })
    .map(([range, count]) => ({ range, count }));
}

function getSalaryByDepartment(data) {
  const groups = {};
  data.forEach(r => {
    if (r.department && r.salary !== null && r.salary !== undefined) {
      if (!groups[r.department]) groups[r.department] = [];
      groups[r.department].push(r.salary);
    }
  });
  return Object.entries(groups)
    .map(([dept, salaries]) => ({ department: dept, avgSalary: round(salaries.reduce((a, b) => a + b, 0) / salaries.length) }))
    .sort((a, b) => b.avgSalary - a.avgSalary);
}

function getPerformanceDistribution(data) {
  const scores = data.map(r => r.performance_score).filter(s => s !== null && s !== undefined);
  if (scores.length === 0) return [];
  const buckets = {};
  scores.forEach(s => {
    const label = String(Math.round(s));
    buckets[label] = (buckets[label] || 0) + 1;
  });
  return Object.entries(buckets)
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    .map(([score, count]) => ({ score, count }));
}

function getEngagementDistribution(data) {
  const scores = data.map(r => r.engagement_score).filter(s => s !== null && s !== undefined);
  if (scores.length === 0) return [];
  const buckets = {};
  scores.forEach(s => {
    const rounded = Math.round(s * 2) / 2;
    const label = String(rounded);
    buckets[label] = (buckets[label] || 0) + 1;
  });
  return Object.entries(buckets)
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    .map(([score, count]) => ({ score, count }));
}

function getTrainingVsPerformance(data) {
  return data
    .filter(r => r.training_hours != null && r.performance_score != null)
    .map(r => ({ training: r.training_hours, performance: r.performance_score, name: r.employee_id || '' }));
}

function getSalaryVsPerformance(data) {
  return data
    .filter(r => r.salary != null && r.performance_score != null)
    .map(r => ({ salary: r.salary, performance: r.performance_score, name: r.employee_id || '' }));
}

function getPromotionByDepartment(data) {
  const groups = {};
  data.forEach(r => {
    if (r.department) {
      if (!groups[r.department]) groups[r.department] = { total: 0, promoted: 0 };
      groups[r.department].total++;
      if (r.promotion_count && r.promotion_count > 0) groups[r.department].promoted++;
    }
  });
  return Object.entries(groups)
    .map(([dept, d]) => ({ department: dept, promotions: d.promoted, rate: round((d.promoted / d.total) * 100, 1) }))
    .sort((a, b) => b.promotions - a.promotions);
}

function getHiringTrend(data) {
  const trend = {};
  data.forEach(r => {
    if (r.hire_date) {
      const d = r.hire_date instanceof Date ? r.hire_date : new Date(r.hire_date);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        trend[key] = (trend[key] || 0) + 1;
      }
    }
  });
  return Object.entries(trend).sort().map(([month, count]) => ({ month, hires: count }));
}

function getLeavingTrend(data) {
  const trend = {};
  data.forEach(r => {
    if (r.termination_date && r.termination_date !== '') {
      const d = r.termination_date instanceof Date ? r.termination_date : new Date(r.termination_date);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        trend[key] = (trend[key] || 0) + 1;
      }
    }
  });
  return Object.entries(trend).sort().map(([month, count]) => ({ month, terminations: count }));
}

function getTurnoverRate(data) {
  const yearData = {};
  data.forEach(r => {
    if (r.hire_date) {
      const hd = r.hire_date instanceof Date ? r.hire_date : new Date(r.hire_date);
      if (!isNaN(hd.getTime())) {
        const year = hd.getFullYear();
        if (!yearData[year]) yearData[year] = { hired: 0, left: 0 };
        yearData[year].hired++;
      }
    }
    if (r.termination_date && r.termination_date !== '') {
      const td = r.termination_date instanceof Date ? r.termination_date : new Date(r.termination_date);
      if (!isNaN(td.getTime())) {
        const year = td.getFullYear();
        if (!yearData[year]) yearData[year] = { hired: 0, left: 0 };
        yearData[year].left++;
      }
    }
  });
  let running = 0;
  return Object.entries(yearData).sort().map(([year, d]) => {
    running += d.hired - d.left;
    const rate = running > 0 ? round((d.left / running) * 100, 1) : 0;
    return { year, turnoverRate: rate, hired: d.hired, left: d.left, headcount: running };
  });
}

function getTopSalaryEmployees(data) {
  return data
    .filter(r => r.salary != null)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 10)
    .map(r => ({ name: r.employee_id || 'N/A', salary: r.salary, department: r.department || 'N/A' }));
}

function getTopEngagementDepts(data) {
  const groups = {};
  data.forEach(r => {
    if (r.department && r.engagement_score != null) {
      if (!groups[r.department]) groups[r.department] = [];
      groups[r.department].push(r.engagement_score);
    }
  });
  return Object.entries(groups)
    .map(([dept, scores]) => ({ department: dept, avgEngagement: round(scores.reduce((a, b) => a + b, 0) / scores.length, 2) }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
}

function groupAndCount(data, field) {
  const groups = {};
  data.forEach(r => {
    const val = r[field];
    if (val !== null && val !== undefined && val !== '') {
      groups[val] = (groups[val] || 0) + 1;
    }
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function safeAverage(data, field) {
  const values = data.map(r => r[field]).filter(v => v != null && !isNaN(v));
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function round(value, decimals = 0) {
  if (isNaN(value) || value == null) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function formatCurrency(value) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(Math.round(value));
}

function getEmptyKPIs() {
  return {
    totalEmployees: 0, activeEmployees: 0, terminatedEmployees: 0,
    avgAge: 0, avgSalary: 0, avgPerformance: 0, avgEngagement: 0,
    avgTraining: 0, avgAbsence: 0, promotionRate: 0, turnoverRate: 0,
  };
}
