import React, { useState, useEffect } from 'react';
import { Diploma, FieldConfig, QuyetDinh, SearchQuery } from '@/models/datadiploma';
import TraCuuComponent from './TraCuu';

const TraCuuPage: React.FC = () => {
  const [configs, setConfigs] = useState<FieldConfig[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinh[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setConfigs(data.configs || []);
        setDiplomas(data.diplomas || []);
        setQuyetDinhs(data.quyetDinhs || []);
      } catch (e) {
        console.error('Lỗi khi tải dữ liệu:', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    const data = stored ? JSON.parse(stored) : {};
    data.quyetDinhs = quyetDinhs;
    localStorage.setItem('diplomaSystemData', JSON.stringify(data));
  }, [quyetDinhs]);

  const handleSearch = (query: SearchQuery): Diploma[] => {
    return diplomas.filter(d => {
      let match = true;
      if (query.soHieu && d.soHieu !== query.soHieu) match = false;
      if (query.soVaoSo && d.soVaoSo !== query.soVaoSo) match = false;
      if (query.maSV && d.maSV !== query.maSV) match = false;
      if (query.hoTen && !d.hoTen.toLowerCase().includes(query.hoTen.toLowerCase())) match = false;
      if (query.ngaySinh && d.ngaySinh !== query.ngaySinh) match = false;
      if (query.quyetDinhId && d.quyetDinhId !== query.quyetDinhId) match = false;
      return match;
    });
  };

  const handleIncreaseSearchCount = (quyetDinhId: string) => {
    setQuyetDinhs(
      quyetDinhs.map(q =>
        q.id === quyetDinhId ? { ...q, searchCount: (q.searchCount || 0) + 1 } : q
      )
    );
  };

  return (
    <TraCuuComponent
      diplomas={diplomas}
      configs={configs}
      quyetDinhs={quyetDinhs}
      onSearch={handleSearch}
      onIncreaseSearchCount={handleIncreaseSearchCount}
    />
  );
};

export default TraCuuPage;
