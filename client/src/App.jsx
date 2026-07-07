import React from 'react';
import { useDataset } from './hooks/useDataset';
import UploadArea from './components/UploadArea';
import Dashboard from './components/Dashboard';

function App() {
  const datasetContext = useDataset();
  const { processedData } = datasetContext;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {!processedData ? (
        <UploadArea datasetContext={datasetContext} />
      ) : (
        <Dashboard datasetContext={datasetContext} />
      )}
    </div>
  );
}

export default App;
