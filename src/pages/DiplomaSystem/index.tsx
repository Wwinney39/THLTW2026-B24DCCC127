import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Space, message } from 'antd';
import {
  FileAddOutlined,
  SearchOutlined,
  SettingOutlined,
  BookOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { FieldConfig, Diploma, SoVanBang, QuyetDinh, SearchQuery } from '@/models/datadiploma';
import QuanLySoVanBang from './QuanLySoVanBang';
import CauHinhBieuMau from './CauHinhBieuMau';
import CapBang from './CapBang';
import TraCuu from './TraCuu';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// ===== INTERFACES & TYPES =====
type TabKey = '1' | '2' | '3' | '4';

// ===== COMPONENT CHÍNH =====
const DiplomaSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('1');

  // ===== STATE LƯU TRỮ =====
  const [configs, setConfigs] = useState<FieldConfig[]>([
    { id: '1', fieldName: 'Dân tộc', dataType: 'String' },
    { id: '2', fieldName: 'Nơi sinh', dataType: 'String' },
    { id: '3', fieldName: 'Điểm trung bình', dataType: 'Number' },
  ]);

  const [soVanBangs, setSoVanBangs] = useState<SoVanBang[]>([
    { id: 'S2026', nam: 2026, soHienTai: 1 },
  ]);

  const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinh[]>([
    {
      id: 'QD01',
      soQD: '100/QD-PTIT',
      ngayBanHanh: '2026-03-01',
      trichYeu: 'Tốt nghiệp đợt 1 năm 2026',
      soVanBangId: 'S2026',
      searchCount: 0,
    },
  ]);

  const [diplomas, setDiplomas] = useState<Diploma[]>([
    {
      key: '1',
      quyetDinhId: 'QD01',
      soVaoSo: 1,
      soHieu: 'BV/2026/001',
      maSV: 'B20001',
      hoTen: 'Nguyễn Văn A',
      ngaySinh: '01/01/2000',
      metadata: {
        '1': 'Kinh',
        '2': 'Hà Nội',
        '3': 3.5,
      },
    },
  ]);

  // ===== EFFECT: RESTORE STORAGE =====
  useEffect(() => {
    const stored = localStorage.getItem('diplomaSystemData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setConfigs(data.configs || configs);
        setSoVanBangs(data.soVanBangs || soVanBangs);
        setQuyetDinhs(data.quyetDinhs || quyetDinhs);
        setDiplomas(data.diplomas || diplomas);
      } catch (e) {
        console.error('Lỗi khi khôi phục dữ liệu:', e);
      }
    }
  }, []);

  // ===== EFFECT: SAVE STORAGE =====
  useEffect(() => {
    const dataToSave = { configs, soVanBangs, quyetDinhs, diplomas };
    localStorage.setItem('diplomaSystemData', JSON.stringify(dataToSave));
  }, [configs, soVanBangs, quyetDinhs, diplomas]);

  // ===== HANDLERS: CẤU HÌNH BIỂU MẪU =====
  const handleAddConfig = (config: FieldConfig) => {
    setConfigs([...configs, config]);
  };

  const handleUpdateConfig = (config: FieldConfig) => {
    setConfigs(configs.map(c => (c.id === config.id ? config : c)));
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  // ===== HANDLERS: SỔ VĂN BẰNG =====
  const handleAddSo = (so: SoVanBang) => {
    setSoVanBangs([...soVanBangs, so]);
  };

  const handleUpdateSo = (so: SoVanBang) => {
    setSoVanBangs(soVanBangs.map(s => (s.id === so.id ? so : s)));
  };

  const handleDeleteSo = (id: string) => {
    setSoVanBangs(soVanBangs.filter(s => s.id !== id));
  };

  // ===== HANDLERS: QUYẾT ĐỊNH =====
  const handleAddQD = (qd: QuyetDinh) => {
    setQuyetDinhs([...quyetDinhs, qd]);
  };

  const handleUpdateQD = (qd: QuyetDinh) => {
    setQuyetDinhs(quyetDinhs.map(q => (q.id === qd.id ? qd : q)));
  };

  const handleDeleteQD = (id: string) => {
    setQuyetDinhs(quyetDinhs.filter(q => q.id !== id));
  };

  // ===== HANDLERS: VĂN BẰNG =====
  const handleAddDiploma = (diploma: Diploma) => {
    // Tự động tăng số trong sổ
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

  // ===== LOGIC TRA CỨU =====
  const handleSearch = (query: SearchQuery): Diploma[] => {
    return diplomas.filter(d => {
      let match = true;

      if (query.soHieu && d.soHieu !== query.soHieu) match = false;
      if (query.soVaoSo && d.soVaoSo !== query.soVaoSo) match = false;
      if (query.maSV && d.maSV !== query.maSV) match = false;
      if (
        query.hoTen &&
        !d.hoTen.toLowerCase().includes(query.hoTen.toLowerCase())
      )
        match = false;
      if (query.ngaySinh && d.ngaySinh !== query.ngaySinh) match = false;
      if (query.quyetDinhId && d.quyetDinhId !== query.quyetDinhId)
        match = false;

      return match;
    });
  };

  const handleIncreaseSearchCount = (quyetDinhId: string) => {
    setQuyetDinhs(
      quyetDinhs.map(q =>
        q.id === quyetDinhId
          ? { ...q, searchCount: (q.searchCount || 0) + 1 }
          : q
      )
    );
  };

  // ===== EXPORT DATA =====
  const handleExport = () => {
    const data = { configs, soVanBangs, quyetDinhs, diplomas };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diploma-backup-${new Date().getTime()}.json`;
    a.click();
    message.success('Xuất dữ liệu thành công!');
  };

  // ===== MENU ITEMS =====
  const menuItems = [
    {
      key: '1',
      icon: <FileAddOutlined />,
      label: 'Cấp bằng',
    },
    {
      key: '2',
      icon: <SearchOutlined />,
      label: 'Tra cứu',
    },
    {
      key: '3',
      icon: <SettingOutlined />,
      label: 'Cấu hình',
    },
    {
      key: '4',
      icon: <BookOutlined />,
      label: 'Quản lý sổ & QĐ',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <Sider
        theme="dark"
        collapsible
        breakpoint="lg"
        collapsedWidth={0}
        style={{ position: 'sticky', top: 0, left: 0, height: '100vh' }}
      >
        <div
          style={{
            height: 64,
            margin: '16px',
            color: '#fff',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          📜 DIPLOMA SYSTEM
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={e => setActiveTab(e.key as TabKey)}
          selectedKeys={[activeTab]}
        />
      </Sider>

      {/* MAIN CONTENT */}
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Hệ thống Quản lý Văn bằng Tốt nghiệp
            </Title>
            <Space>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                title="Xuất dữ liệu ra file JSON"
              >
                Xuất
              </Button>
            </Space>
          </div>
        </Header>

        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          {/* TAB 1: CẤP BẰNG */}
          {activeTab === '1' && (
            <CapBang
              diplomas={diplomas}
              configs={configs}
              quyetDinhs={quyetDinhs}
              soVanBangs={soVanBangs}
              onAddDiploma={handleAddDiploma}
              onUpdateDiploma={handleUpdateDiploma}
              onDeleteDiploma={handleDeleteDiploma}
            />
          )}

          {/* TAB 2: TRA CỨU */}
          {activeTab === '2' && (
            <TraCuu
              diplomas={diplomas}
              configs={configs}
              quyetDinhs={quyetDinhs}
              onSearch={handleSearch}
              onIncreaseSearchCount={handleIncreaseSearchCount}
            />
          )}

          {/* TAB 3: CẤU HÌNH */}
          {activeTab === '3' && (
            <CauHinhBieuMau
              configs={configs}
              onAddConfig={handleAddConfig}
              onUpdateConfig={handleUpdateConfig}
              onDeleteConfig={handleDeleteConfig}
            />
          )}

          {/* TAB 4: QUẢN LÝ SỔ & QĐ */}
          {activeTab === '4' && (
            <QuanLySoVanBang
              soVanBangs={soVanBangs}
              quyetDinhs={quyetDinhs}
              onAddSo={handleAddSo}
              onUpdateSo={handleUpdateSo}
              onDeleteSo={handleDeleteSo}
              onAddQD={handleAddQD}
              onUpdateQD={handleUpdateQD}
              onDeleteQD={handleDeleteQD}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DiplomaSystem;
