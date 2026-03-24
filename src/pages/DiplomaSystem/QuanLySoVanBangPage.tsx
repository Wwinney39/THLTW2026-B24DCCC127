import React, { useState, useEffect } from 'react';
import { SoVanBang, QuyetDinh } from '@/models/datadiploma';
import QuanLySoVanBangComponent from './QuanLySoVanBang';

const QuanLySoVanBangPage: React.FC = () => {
  const [soVanBangs, setSoVanBangs] = useState<SoVanBang[]>([]);
  const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinh[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSoVanBangs(data.soVanBangs || []);
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
    data.soVanBangs = soVanBangs;
    data.quyetDinhs = quyetDinhs;
    localStorage.setItem('diplomaSystemData', JSON.stringify(data));
  }, [soVanBangs, quyetDinhs]);

  const handleAddSo = (so: SoVanBang) => {
    setSoVanBangs([...soVanBangs, so]);
  };

  const handleUpdateSo = (so: SoVanBang) => {
    setSoVanBangs(soVanBangs.map(s => (s.id === so.id ? so : s)));
  };

  const handleDeleteSo = (id: string) => {
    setSoVanBangs(soVanBangs.filter(s => s.id !== id));
  };

  const handleAddQD = (qd: QuyetDinh) => {
    setQuyetDinhs([...quyetDinhs, qd]);
  };

  const handleUpdateQD = (qd: QuyetDinh) => {
    setQuyetDinhs(quyetDinhs.map(q => (q.id === qd.id ? qd : q)));
  };

  const handleDeleteQD = (id: string) => {
    setQuyetDinhs(quyetDinhs.filter(q => q.id !== id));
  };

  return (
    <QuanLySoVanBangComponent
      soVanBangs={soVanBangs}
      quyetDinhs={quyetDinhs}
      onAddSo={handleAddSo}
      onUpdateSo={handleUpdateSo}
      onDeleteSo={handleDeleteSo}
      onAddQD={handleAddQD}
      onUpdateQD={handleUpdateQD}
      onDeleteQD={handleDeleteQD}
    />
  );
};

export default QuanLySoVanBangPage;
