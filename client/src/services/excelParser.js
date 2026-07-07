import * as XLSX from 'xlsx';
import { mapColumns, analyzeColumns, excelDateToJS } from './columnDetector';

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetNames = workbook.SheetNames;
        
        const sheets = sheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
          return { name, data: jsonData, headers, rowCount: jsonData.length };
        });

        resolve({ sheets, sheetNames });
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function processSheet(sheetData, columnMapping) {
  const { data, headers } = sheetData;
  const analysis = analyzeColumns(data, headers);
  
  const processedData = data.map((row, index) => {
    const processed = { _originalIndex: index };
    
    for (const [field, sourceCol] of Object.entries(columnMapping)) {
      let value = row[sourceCol];
      
      if (['hire_date', 'termination_date', 'end_date'].includes(field)) {
        value = excelDateToJS(value);
      }
      
      if (['age', 'salary', 'performance_score', 'absence_days', 'training_hours', 'promotion_count', 'engagement_score', 'years_of_service'].includes(field)) {
        const num = parseFloat(String(value).replace(/[$,\u20ac\u00a3\u00a5]/g, ''));
        value = isNaN(num) ? null : num;
      }
      
      processed[field] = value;
    }
    
    headers.forEach(h => {
      if (!Object.values(columnMapping).includes(h)) {
        processed[h] = row[h];
      }
    });
    
    return processed;
  });

  return { processedData, analysis, headers };
}

export function dataToCSV(data) {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]).filter(h => !h.startsWith('_'));
  const csvRows = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = val instanceof Date ? val.toISOString().split('T')[0] : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    });
    csvRows.push(values.join(','));
  });
  return csvRows.join('\n');
}
