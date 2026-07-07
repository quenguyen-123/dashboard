const HR_COLUMN_MAPPINGS = {
  employee_id: ['employee_id', 'emp_id', 'id', 'employee_number', 'empno', 'staff_id', 'employeeid'],
  department: ['department', 'dept', 'department_name', 'dept_name', 'division'],
  hire_date: ['hire_date', 'hiredate', 'date_hired', 'start_date', 'joining_date', 'join_date'],
  termination_date: ['termination_date', 'term_date', 'end_date', 'leave_date', 'exit_date', 'separation_date'],
  years_of_service: ['years_of_service', 'tenure', 'service_years', 'yos', 'experience'],
  gender: ['gender', 'sex', 'gender_identity'],
  age: ['age', 'employee_age'],
  salary: ['salary', 'annual_salary', 'compensation', 'pay', 'base_salary', 'wage'],
  performance_score: ['performance_score', 'performance', 'perf_score', 'rating', 'performance_rating', 'perf_rating', 'performancescore'],
  absence_days: ['absence_days', 'absences', 'days_absent', 'sick_days', 'leave_days', 'absent_days', 'absencedays'],
  training_hours: ['training_hours', 'training', 'training_hrs', 'hours_trained', 'traininghours'],
  promotion_count: ['promotion_count', 'promotions', 'num_promotions', 'promotion', 'promotioncount'],
  engagement_score: ['engagement_score', 'engagement', 'satisfaction', 'satisfaction_score', 'engagement_rating', 'engagementscore'],
};

export function detectColumnType(values) {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 100);
  if (sample.length === 0) return 'unknown';
  const dateCount = sample.filter(v => isDateValue(v)).length;
  const numericCount = sample.filter(v => isNumericValue(v)).length;
  if (dateCount / sample.length > 0.7) return 'date';
  if (numericCount / sample.length > 0.7) return 'numeric';
  return 'categorical';
}

function isDateValue(val) {
  if (typeof val === 'number' && val > 30000 && val < 60000) return true;
  if (val instanceof Date) return true;
  const str = String(val);
  const datePatterns = [
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,
    /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/,
    /^\d{1,2}\s+\w+\s+\d{4}$/,
    /^\w+\s+\d{1,2},?\s+\d{4}$/,
  ];
  return datePatterns.some(p => p.test(str.trim()));
}

function isNumericValue(val) {
  if (typeof val === 'number') return true;
  const str = String(val).trim().replace(/[$,\u20ac\u00a3\u00a5]/g, '');
  return !isNaN(parseFloat(str)) && isFinite(str);
}

export function mapColumns(headers) {
  const mapping = {};
  const warnings = [];
  const detected = {};

  headers.forEach(header => {
    const normalized = header.toLowerCase().trim().replace(/[\s-]+/g, '_');
    for (const [field, aliases] of Object.entries(HR_COLUMN_MAPPINGS)) {
      if (aliases.includes(normalized) || aliases.some(a => normalized.includes(a))) {
        if (!mapping[field]) {
          mapping[field] = header;
          detected[field] = true;
        }
        break;
      }
    }
  });

  const required = ['employee_id', 'department'];
  const recommended = ['salary', 'age', 'gender', 'performance_score', 'hire_date'];

  required.forEach(field => {
    if (!detected[field]) {
      warnings.push({ type: 'error', field, message: `Required column '${field}' not detected. Please map it manually.` });
    }
  });

  recommended.forEach(field => {
    if (!detected[field]) {
      warnings.push({ type: 'warning', field, message: `Recommended column '${field}' not detected. Some charts may be unavailable.` });
    }
  });

  return { mapping, warnings, unmappedHeaders: headers.filter(h => !Object.values(mapping).includes(h)) };
}

export function analyzeColumns(data, headers) {
  const analysis = {};
  headers.forEach(header => {
    const values = data.map(row => row[header]);
    const type = detectColumnType(values);
    const uniqueValues = [...new Set(values.filter(v => v !== null && v !== undefined && v !== ''))];
    analysis[header] = {
      type,
      uniqueCount: uniqueValues.length,
      nullCount: values.filter(v => v === null || v === undefined || v === '').length,
      sampleValues: uniqueValues.slice(0, 5),
    };
  });
  return analysis;
}

export function excelDateToJS(serial) {
  if (serial instanceof Date) return serial;
  if (typeof serial === 'string') {
    const d = new Date(serial);
    if (!isNaN(d.getTime())) return d;
    return null;
  }
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    return date;
  }
  return null;
}
