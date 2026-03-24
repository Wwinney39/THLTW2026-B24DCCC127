import React, { useState, useEffect } from 'react';
import { FieldConfig, Diploma, SoVanBang, QuyetDinh } from '@/models/datadiploma';
import CapBang from './CapBang';

const BookManagement: React.FC = () => {
  const [configs, setConfigs] = useState<FieldConfig[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [soVanBangs, setSoVanBangs] = useState<SoVanBang[]>([]);
  const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinh[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setConfigs(data.configs || []);
        setDiplomas(data.diplomas || []);
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
    data.diplomas = diplomas;
    data.soVanBangs = soVanBangs;
    localStorage.setItem('diplomaSystemData', JSON.stringify(data));
  }, [diplomas, soVanBangs]);

  const handleAddDiploma = (diploma: Diploma) => {
    const qd = quyetDinhs.find(q => q.id === diploma.quyetDinhId);
    if (qd) {
      const so = soVanBangs.find(s => s.id === qd.soVanBangId);
      if (so) {
        setSoVanBangs(
          soVanBangs.map(s =>
            s.id === so.id ? { ...s, soHienTai: s.soHienTai + 1 } : s
          )
        );
      }
    }
    setDiplomas([...diplomas, diploma]);
  };

  const handleUpdateDiploma = (diploma: Diploma) => {
    setDiplomas(diplomas.map(d => (d.key === diploma.key ? diploma : d)));
  };

  const handleDeleteDiploma = (key: string) => {
    setDiplomas(diplomas.filter(d => d.key !== key));
  };

  return (
    <CapBang
      diplomas={diplomas}
      configs={configs}
      quyetDinhs={quyetDinhs}
      soVanBangs={soVanBangs}
      onAddDiploma={handleAddDiploma}
      onUpdateDiploma={handleUpdateDiploma}
      onDeleteDiploma={handleDeleteDiploma}
    />
  );
};

export default BookManagement;
