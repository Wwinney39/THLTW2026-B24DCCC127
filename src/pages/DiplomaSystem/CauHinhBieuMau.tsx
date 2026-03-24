import React from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FieldConfig, DataType } from '@/models/datadiploma';

interface CauHinhBieuMauProps {
  configs: FieldConfig[];
  onAddConfig: (config: FieldConfig) => void;
  onUpdateConfig: (config: FieldConfig) => void;
  onDeleteConfig: (id: string) => void;
}

const CauHinhBieuMau: React.FC<CauHinhBieuMauProps> = ({
  configs,
  onAddConfig,
  onUpdateConfig,
  onDeleteConfig,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingConfig, setEditingConfig] = React.useState<FieldConfig | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingConfig(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: FieldConfig) => {
    setEditingConfig(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editingConfig) {
      onUpdateConfig({ ...editingConfig, ...values });
      message.success('Cập nhật trường thành công!');
    } else {
      onAddConfig({
        id: Date.now().toString(),
        ...values,
      });
      message.success('Thêm trường mới thành công!');
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Tên trường',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: '40%',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (dataType: DataType) => {
        const colors: { [key in DataType]: string } = {
          String: 'blue',
          Number: 'green',
          Date: 'orange',
        };
        return (
          <span
            style={{
              background: colors[dataType],
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '12px',
            }}
          >
            {dataType}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: FieldConfig) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa trường?"
            onConfirm={() => {
              onDeleteConfig(record.id);
              message.success('Xóa trường thành công!');
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
        title="Cấu hình biểu mẫu phụ lục"
        extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm trường
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Các trường được cấu hình ở đây sẽ hiển thị khi cấp bằng và tra cứu thông tin văn bằng
        </p>
      </div>

      <Table columns={columns} dataSource={configs} rowKey="id" pagination={{ pageSize: 10 }} size="small" />

      <Modal
        title={editingConfig ? 'Chỉnh sửa trường' : 'Thêm trường mới'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fieldName"
            label="Tên trường"
            rules={[
              { required: true, message: 'Vui lòng nhập tên trường' },
              { min: 2, message: 'Tên trường phải ít nhất 2 ký tự' },
            ]}
          >
            <Input placeholder="Ví dụ: Điểm trung bình, Nơi sinh, Xếp hạng" />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select placeholder="Chọn kiểu dữ liệu">
              <Select.Option value="String">Văn bản (String)</Select.Option>
              <Select.Option value="Number">Số (Number)</Select.Option>
              <Select.Option value="Date">Ngày (Date)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      </Card>
    </ConfigProvider>
  );
};

export default CauHinhBieuMau;
