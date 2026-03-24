import React from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Space,
  message,
  Drawer,
  Descriptions,
  Tag,
  Alert,
  ConfigProvider,
} from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

import { Diploma, FieldConfig, QuyetDinh, SearchQuery } from '@/models/datadiploma';

interface TraCuuProps {
  diplomas: Diploma[];
  configs: FieldConfig[];
  quyetDinhs: QuyetDinh[];
  onSearch: (query: SearchQuery) => Diploma[];
  onIncreaseSearchCount: (quyetDinhId: string) => void;
}

const TraCuu: React.FC<TraCuuProps> = ({
  diplomas,
  configs,
  quyetDinhs,
  onSearch,
  onIncreaseSearchCount,
}) => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = React.useState<Diploma[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedDiploma, setSelectedDiploma] = React.useState<Diploma | null>(null);
  const [paramCount, setParamCount] = React.useState(0);

  const handleSearch = async () => {
    const values = await form.validateFields();

    // Đếm số tham số được nhập
    const count = Object.values(values).filter(v => v !== undefined && v !== null && v !== '').length;

    if (count < 2) {
      message.error('Vui lòng nhập ít nhất 2 tham số!');
      return;
    }

    // Tạo SearchQuery object
    const query: SearchQuery = {
      soHieu: values.soHieu || undefined,
      soVaoSo: values.soVaoSo || undefined,
      maSV: values.maSV || undefined,
      hoTen: values.hoTen || undefined,
      ngaySinh: values.ngaySinh ? values.ngaySinh.format('DD/MM/YYYY') : undefined,
      quyetDinhId: values.quyetDinhId || undefined,
    };

    const results = onSearch(query);
    setSearchResults(results);
    setParamCount(count);

    if (results.length === 0) {
      message.info('Không tìm thấy kết quả');
    } else {
      message.success(`Tìm thấy ${results.length} kết quả`);
      // Tăng lượt tra cứu cho các QĐ liên quan
      const uniqueQDs = [...new Set(results.map(r => r.quyetDinhId))];
      uniqueQDs.forEach(qdId => onIncreaseSearchCount(qdId));
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults([]);
    setParamCount(0);
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số hiệu',
      dataIndex: 'soHieu',
      key: 'soHieu',
      width: 120,
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSV',
      key: 'maSV',
      width: 100,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 150,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 110,
    },
    {
      title: 'Quyết định',
      key: 'qdName',
      width: 150,
      render: (_: any, record: Diploma) => {
        const qd = quyetDinhs.find(q => q.id === record.quyetDinhId);
        return <Tag color="blue">{qd?.soQD || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: Diploma) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedDiploma(record);
            setDrawerOpen(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title="Tra cứu thông tin văn bằng">
      {/* FORM TRA CỨU */}
      <div
        style={{
          background: '#f0f2f5',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '24px',
        }}
      >
        <h3>Điều kiện tìm kiếm</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          Vui lòng nhập ít nhất <strong>2 tham số</strong> để tìm kiếm
        </p>

        <ConfigProvider locale={vi_VN}>
          <Form form={form} layout="vertical">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <Form.Item name="soHieu" label="Số hiệu văn bằng">
                <Input placeholder="Ví dụ: BV/2026/001" />
              </Form.Item>

              <Form.Item name="soVaoSo" label="Số vào sổ">
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>

              <Form.Item name="maSV" label="Mã sinh viên">
                <Input placeholder="Ví dụ: B20001" />
              </Form.Item>

              <Form.Item name="hoTen" label="Họ tên">
                <Input />
              </Form.Item>

              <Form.Item name="ngaySinh" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item name="quyetDinhId" label="Quyết định">
                <select style={{ width: '100%', padding: '4px 8px', borderRadius: '2px', border: '1px solid #d9d9d9' }}>
                  <option value="">-- Tất cả --</option>
                  {quyetDinhs.map(qd => (
                    <option key={qd.id} value={qd.id}>
                      {qd.soQD}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </div>

            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>Xóa bộ lọc</Button>
            </Space>
          </Form>
        </ConfigProvider>
      </div>

      {/* KẾT QUẢ TÌM KIẾM */}
      {searchResults.length > 0 && (
        <Alert
          message={`Tìm thấy ${searchResults.length} kết quả (nhập ${paramCount} tham số)`}
          type="success"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      <Table
        columns={columns}
        dataSource={searchResults}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        size="small"
        locale={{ emptyText: 'Hãy tìm kiếm để xem kết quả' }}
      />

      {/* THỐNG KÊ LƯỢT TRA CỨU */}
      {quyetDinhs.some(qd => (qd.searchCount || 0) > 0) && (
        <Card
          title="Thống kê lượt tra cứu theo quyết định"
          style={{ marginTop: '24px' }}
        >
          <Table
            columns={[
              {
                title: 'Số QĐ',
                dataIndex: 'soQD',
                key: 'soQD',
              },
              {
                title: 'Trích yếu',
                dataIndex: 'trichYeu',
                key: 'trichYeu',
              },
              {
                title: 'Lượt tra cứu',
                key: 'searchCount',
                render: (_: any, record: QuyetDinh) => (
                  <Tag color="volcano">{record.searchCount || 0}</Tag>
                ),
              },
            ]}
            dataSource={quyetDinhs.filter(qd => (qd.searchCount || 0) > 0)}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </Card>
      )}

      {/* DRAWER CHI TIẾT */}
      <Drawer
        title="Chi tiết văn bằng"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
      >
        {selectedDiploma && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h4>Thông tin cơ bản</h4>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Số vào sổ">{selectedDiploma.soVaoSo}</Descriptions.Item>
                <Descriptions.Item label="Số hiệu">{selectedDiploma.soHieu}</Descriptions.Item>
                <Descriptions.Item label="Mã SV">{selectedDiploma.maSV}</Descriptions.Item>
                <Descriptions.Item label="Họ tên">{selectedDiploma.hoTen}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{selectedDiploma.ngaySinh}</Descriptions.Item>
                <Descriptions.Item label="Quyết định">
                  {quyetDinhs.find(q => q.id === selectedDiploma.quyetDinhId)?.soQD}
                </Descriptions.Item>
                <Descriptions.Item label="Trích yếu">
                  {quyetDinhs.find(q => q.id === selectedDiploma.quyetDinhId)?.trichYeu}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {Object.keys(selectedDiploma.metadata || {}).length > 0 && (
              <div>
                <h4>Thông tin phụ lục</h4>
                <Descriptions column={1} bordered size="small">
                  {configs.map(conf => (
                    <Descriptions.Item key={conf.id} label={conf.fieldName}>
                      {selectedDiploma.metadata?.[conf.id]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            )}
          </>
        )}
      </Drawer>
    </Card>
  );
};

export default TraCuu;
