import React from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SoVanBang, QuyetDinh } from '@/models/datadiploma';

interface QuanLySoVanBangProps {
  soVanBangs: SoVanBang[];
  quyetDinhs: QuyetDinh[];
  onAddSo: (so: SoVanBang) => void;
  onUpdateSo: (so: SoVanBang) => void;
  onDeleteSo: (id: string) => void;
  onAddQD: (qd: QuyetDinh) => void;
  onUpdateQD: (qd: QuyetDinh) => void;
  onDeleteQD: (id: string) => void;
}

const QuanLySoVanBang: React.FC<QuanLySoVanBangProps> = ({
  soVanBangs,
  quyetDinhs,
  onAddSo,
  onUpdateSo,
  onDeleteSo,
  onAddQD,
  onUpdateQD,
  onDeleteQD,
}) => {
  const [isModalSoOpen, setIsModalSoOpen] = React.useState(false);
  const [isModalQDOpen, setIsModalQDOpen] = React.useState(false);
  const [editingSo, setEditingSo] = React.useState<SoVanBang | null>(null);
  const [editingQD, setEditingQD] = React.useState<QuyetDinh | null>(null);
  const [formSo] = Form.useForm();
  const [formQD] = Form.useForm();

  // --- SỔ VĂN BẰNG ---
  const handleAddSo = () => {
    setEditingSo(null);
    formSo.resetFields();
    setIsModalSoOpen(true);
  };

  const handleEditSo = (record: SoVanBang) => {
    setEditingSo(record);
    formSo.setFieldsValue(record);
    setIsModalSoOpen(true);
  };

  const handleSaveSo = async () => {
    const values = await formSo.validateFields();
    if (editingSo) {
      onUpdateSo({ ...editingSo, ...values });
      message.success('Cập nhật sổ văn bằng thành công!');
    } else {
      onAddSo({
        id: 'S' + values.nam,
        ...values,
        soHienTai: 1,
      });
      message.success('Tạo sổ văn bằng mới thành công!');
    }
    setIsModalSoOpen(false);
  };

  const soColumns = [
    { title: 'Năm', dataIndex: 'nam', key: 'nam' },
    { title: 'Số hiện tại', dataIndex: 'soHienTai', key: 'soHienTai' },
    {
      title: 'Quyết định liên quan',
      key: 'qdCount',
      render: (_: any, record: SoVanBang) =>
        quyetDinhs.filter(qd => qd.soVanBangId === record.id).length,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: SoVanBang) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditSo(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sổ văn bằng?"
            onConfirm={() => {
              onDeleteSo(record.id);
              message.success('Xóa sổ văn bằng thành công!');
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- QUYẾT ĐỊNH TỐT NGHIỆP ---
  const handleAddQD = () => {
    setEditingQD(null);
    formQD.resetFields();
    setIsModalQDOpen(true);
  };

  const handleEditQD = (record: QuyetDinh) => {
    setEditingQD(record);
    formQD.setFieldsValue(record);
    setIsModalQDOpen(true);
  };

  const handleSaveQD = async () => {
    const values = await formQD.validateFields();
    if (editingQD) {
      onUpdateQD({ ...editingQD, ...values });
      message.success('Cập nhật quyết định thành công!');
    } else {
      onAddQD({
        id: Date.now().toString(),
        ...values,
        searchCount: 0,
      });
      message.success('Tạo quyết định mới thành công!');
    }
    setIsModalQDOpen(false);
  };

  const qdColumns = [
    { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
    { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh' },
    { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
    {
      title: 'Sổ văn bằng',
      key: 'soVanBangName',
      render: (_: any, record: QuyetDinh) => {
        const so = soVanBangs.find(s => s.id === record.soVanBangId);
        return so ? so.nam : 'N/A';
      },
    },
    {
      title: 'Lượt tra cứu',
      key: 'searchCount',
      render: (_: any, record: QuyetDinh) => record.searchCount || 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: QuyetDinh) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditQD(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa quyết định?"
            onConfirm={() => {
              onDeleteQD(record.id);
              message.success('Xóa quyết định thành công!');
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider locale={vi_VN}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* SỔ VĂN BẰNG */}
      <Card
        title="Sổ Văn Bằng"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSo}>
            Thêm sổ mới
          </Button>
        }
      >
        <Table
          columns={soColumns}
          dataSource={soVanBangs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Card>

      {/* QUYẾT ĐỊNH TỐT NGHIỆP */}
      <Card
        title="Quyết định tốt nghiệp"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQD}>
            Thêm QĐ
          </Button>
        }
      >
        <Table
          columns={qdColumns}
          dataSource={quyetDinhs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Card>

      {/* MODAL SỔ VĂN BẰNG */}
      <Modal
        title={editingSo ? 'Chỉnh sửa sổ văn bằng' : 'Tạo sổ văn bằng mới'}
        open={isModalSoOpen}
        onOk={handleSaveSo}
        onCancel={() => setIsModalSoOpen(false)}
      >
        <Form form={formSo} layout="vertical">
          <Form.Item
            name="nam"
            label="Năm"
            rules={[
              { required: true, message: 'Vui lòng nhập năm' },
              { pattern: /^\d{4}$/, message: 'Năm phải là 4 chữ số' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          {editingSo && (
            <Form.Item
              name="soHienTai"
              label="Số hiện tại"
              rules={[{ required: true, message: 'Vui lòng nhập số hiện tại' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* MODAL QUYẾT ĐỊNH */}
      <Modal
        title={editingQD ? 'Chỉnh sửa quyết định' : 'Tạo quyết định mới'}
        open={isModalQDOpen}
        onOk={handleSaveQD}
        onCancel={() => setIsModalQDOpen(false)}
      >
        <Form form={formQD} layout="vertical">
          <Form.Item
            name="soQD"
            label="Số QĐ"
            rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
          >
            <Input placeholder="Ví dụ: 100/QD-PTIT" />
          </Form.Item>
          <Form.Item
            name="ngayBanHanh"
            label="Ngày ban hành"
            rules={[{ required: true, message: 'Vui lòng nhập ngày ban hành' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="trichYeu"
            label="Trích yếu"
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
          >
            <Input.TextArea rows={3} placeholder="Ví dụ: Tốt nghiệp đợt 1" />
          </Form.Item>
          <Form.Item
            name="soVanBangId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <select style={{ width: '100%', padding: '4px 8px', borderRadius: '2px', border: '1px solid #d9d9d9' }}>
              <option value="">-- Chọn sổ --</option>
              {soVanBangs.map(so => (
                <option key={so.id} value={so.id}>
                  Năm {so.nam} (Số hiện tại: {so.soHienTai})
                </option>
              ))}
            </select>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </ConfigProvider>
  );
};

export default QuanLySoVanBang;
