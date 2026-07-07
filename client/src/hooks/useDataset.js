import { useState, useCallback, useEffect } from 'react';
import { parseExcelFile, processSheet } from '../services/excelParser';
import { mapColumns } from '../services/columnDetector';

const STORAGE_KEY = 'hr-analytics-datasets';

export function useDataset() {
  const [rawData, setRawData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [columns, setColumns] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [datasetHistory, setDatasetHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDatasetHistory(JSON.parse(stored));
    } catch (e) {
      console.warn('Failed to load dataset history:', e);
    }
  }, []);

  const saveToHistory = useCallback((name, sheetName, columnMap, rowCount) => {
    const entry = {
      id: Date.now(),
      name,
      sheetName,
      columnMapping: columnMap,
      rowCount,
      uploadedAt: new Date().toISOString(),
    };
    setDatasetHistory(prev => {
      const updated = [entry, ...prev.filter(d => d.name !== name)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const result = await parseExcelFile(file);
      setSheets(result.sheets);
      const firstSheet = result.sheets.find(s => s.rowCount > 0) || result.sheets[0];
      setSelectedSheet(firstSheet);
      setRawData(firstSheet);
      const { mapping, warnings: w } = mapColumns(firstSheet.headers);
      setColumnMapping(mapping);
      setColumns(firstSheet.headers);
      setWarnings(w);
      const { processedData: pd } = processSheet(firstSheet, mapping);
      setProcessedData(pd);
      saveToHistory(file.name, firstSheet.name, mapping, firstSheet.rowCount);
      return { sheets: result.sheets, mapping, warnings: w };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveToHistory]);

  const selectSheet = useCallback((sheetName) => {
    const sheet = sheets.find(s => s.name === sheetName);
    if (!sheet) return;
    setSelectedSheet(sheet);
    setRawData(sheet);
    const { mapping, warnings: w } = mapColumns(sheet.headers);
    setColumnMapping(mapping);
    setColumns(sheet.headers);
    setWarnings(w);
    const { processedData: pd } = processSheet(sheet, mapping);
    setProcessedData(pd);
  }, [sheets]);

  const updateColumnMapping = useCallback((newMapping) => {
    setColumnMapping(newMapping);
    if (selectedSheet) {
      const { processedData: pd } = processSheet(selectedSheet, newMapping);
      setProcessedData(pd);
    }
  }, [selectedSheet]);

  const clearData = useCallback(() => {
    setRawData(null);
    setProcessedData(null);
    setColumnMapping({});
    setColumns([]);
    setWarnings([]);
    setSheets([]);
    setSelectedSheet(null);
    setError(null);
    setFileName('');
  }, []);

  const clearHistory = useCallback(() => {
    setDatasetHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    rawData, processedData, columnMapping, columns, warnings, sheets,
    selectedSheet, isLoading, error, fileName, datasetHistory,
    handleFileUpload, selectSheet, updateColumnMapping, clearData, clearHistory,
  };
}
