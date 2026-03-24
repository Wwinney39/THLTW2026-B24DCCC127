import React, { useState, useEffect } from 'react';
import { FieldConfig } from '@/models/datadiploma';
import CauHinhBieuMau from './CauHinhBieuMau';

const ConfigFields: React.FC = () => {
  const [configs, setConfigs] = useState<FieldConfig[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setConfigs(data.configs || []);
      } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    const data = stored ? JSON.parse(stored) : {};
    data.configs = configs;
    localStorage.setItem('diplomaSystemData', JSON.stringify(data));
  }, [configs]);

  const handleAddConfig = (config: FieldConfig) => {
    setConfigs([...configs, config]);
  };

  const handleUpdateConfig = (config: FieldConfig) => {
    setConfigs(configs.map(c => (c.id === config.id ? config : c)));
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  return (
    <CauHinhBieuMau
      configs={configs}
      onAddConfig={handleAddConfig}
      onUpdateConfig={handleUpdateConfig}
      onDeleteConfig={handleDeleteConfig}
    />
  );
};

export default ConfigFields;
