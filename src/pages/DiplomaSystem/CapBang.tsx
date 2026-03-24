import React from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  message,
  Popconfirm,
  Descriptions,
  Drawer,
  ConfigProvider,
} from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Diploma, FieldConfig, QuyetDinh, SoVanBang } from '@/models/datadiploma';

interface CapBangProps {
  diplomas: Diploma[];
  configs: FieldConfig[];
  quyetDinhs: QuyetDinh[];
  soVanBangs: SoVanBang[];
  onAddDiploma: (diploma: Diploma) => void;
  onUpdateDiploma: (diploma: Diploma) => void;
  onDeleteDiploma: (key: string) => void;
}

const CapBang: React.FC<CapBangProps> = ({
  diplomas,
  configs,
  quyetDinhs,
  soVanBangs,
  onAddDiploma,
  onUpdateDiploma,
  onDeleteDiploma,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDiploma, setEditingDiploma] = React.useState<Diploma | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedDiploma, setSelectedDiploma] = React.useState<Diploma | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingDiploma(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Diploma) => {
    setEditingDiploma(record);
    const formData = {
      ...record,
      ngaySinh: record.ngaySinh ? moment(record.ngaySinh, 'DD/MM/YYYY') : undefined,
      ...record.metadata,
    };
    form.setFieldsValue(formData);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const qd = quyetDinhs.find(q => q.id === values.quyetDinhId);
    const so = soVanBangs.find(s => s.id === qd?.soVanBangId);

    if (!so) {
      message.error('Không tìm thấy sổ văn bằng phù hợp!');
      return;
    }

    // Lấy metadata từ các trường config
    const metadata: Record<string, any> = {};
    configs.forEach(conf => {
      if (values[conf.id] !== undefined) {
        metadata[conf.id] = values[conf.id];
      }
    });

    if (editingDiploma) {
      // Cập nhật: không cho tăng số vào sổ
      onUpdateDiploma({
        ...editingDiploma,
        soHieu: values.soHieu,
        maSV: values.maSV,
        hoTen: values.hoTen,
        ngaySinh: values.ngaySinh.format('DD/MM/YYYY'),
        quyetDinhId: values.quyetDinhId,
        metadata,
      });
      message.success('Cập nhật văn bằng thành công!');
    } else {
      // Tạo mới: tự động gán số vào sổ
      const newDiploma: Diploma = {
        key: Date.now().toString(),
        quyetDinhId: values.quyetDinhId,
        soVaoSo: so.soHienTai,
        soHieu: values.soHieu,
        maSV: values.maSV,
        hoTen: values.hoTen,
        ngaySinh: values.ngaySinh.format('DD/MM/YYYY'),
        metadata,
      };
      onAddDiploma(newDiploma);
      message.success(`Đã cấp bằng thành công! Số vào sổ: ${so.soHienTai}`);
    }
    setIsModalOpen(false);
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
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 110,
    },
    {
      title: 'QĐ tốt nghiệp',
      key: 'qdName',
      width: 150,
      render: (_: any, record: Diploma) => {
        const qd = quyetDinhs.find(q => q.id === record.quyetDinhId);
        return qd ? qd.soQD : 'N/A';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Diploma) => (
        <Space>
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
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa văn bằng?"
            onConfirm={() => {
              onDeleteDiploma(record.key);
              message.success('Xóa văn bằng thành công!');
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider locale={vi_VN}>
      <Card
        title="Cấp văn bằng & Quản lý thông tin"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Cấp bằng mới
          </Button>
        }
      >
      <Table
        columns={columns}
        dataSource={diplomas}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        size="small"
      />

      {/* MODAL CẤP BẰNG */}
      <Modal
        title={editingDiploma ? 'Chỉnh sửa thông tin văn bằng' : 'Cấp văn bằng mới'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
            {/* Nhóm thông tin cơ bản */}
            <div
              style={{
                background: '#f5f5f5',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '4px',
              }}
            >
              <h4 style={{ margin: '0 0 12px 0' }}>Thông tin cơ bản</h4>

              <Form.Item
                name="quyetDinhId"
                label="Quyết định tốt nghiệp"
                rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
              >
                <Select placeholder="Chọn quyết định">
                  {quyetDinhs.map(qd => (
                    <Select.Option key={qd.id} value={qd.id}>
                      {qd.soQD} - {qd.trichYeu}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="soHieu"
                label="Số hiệu văn bằng"
                rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
              >
                <Input placeholder="Ví dụ: BV/2026/001" />
              </Form.Item>

              <Form.Item
                name="maSV"
                label="Mã sinh viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
              >
                <Input placeholder="Ví dụ: B20001" />
              </Form.Item>

              <Form.Item
                name="hoTen"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            {/* Nhóm thông tin phụ lục */}
            {configs.length > 0 && (
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                }}
              >
                <h4 style={{ margin: '0 0 12px 0' }}>Thông tin phụ lục</h4>

                {configs.map(conf => (
                  <Form.Item key={conf.id} name={conf.id} label={conf.fieldName}>
                    {conf.dataType === 'Number' ? (
                      <InputNumber style={{ width: '100%' }} />
                    ) : conf.dataType === 'Date' ? (
                      <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                ))}
              </div>
            )}
          </Form>
      </Modal>

      {/* DRAWER CHI TIẾT */}
      <Drawer
        title="Chi tiết văn bằng"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
      >
        {selectedDiploma && (
          <>
            <div style={{ marginBottom: 24 }}>
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
    </ConfigProvider>
  );
};

export default CapBang;
