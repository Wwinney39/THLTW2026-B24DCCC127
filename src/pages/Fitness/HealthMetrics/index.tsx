import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, InputNumber, DatePicker, Popconfirm, Tag, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { HealthMetric, addHealthMetric, updateHealthMetric, deleteHealthMetric } from '@/models/dataFitness';
import moment from 'moment';

const { Title } = Typography;

const HealthMetrics: React.FC = () => {
  const healthMetrics = useSelector((state: RootState) => state.fitnessState.healthMetrics);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [form] = Form.useForm();

  const showModal = (record?: HealthMetric) => {
    if (record) {
      setEditingMetric(record);
      form.setFieldsValue({
        ...record,
        date: moment(record.date),
      });
    } else {
      setEditingMetric(null);
      form.resetFields();
      form.setFieldsValue({ date: moment() });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return 0;
    return Number((weight / (height * height)).toFixed(2));
  };

  const getBMITag = (bmi: number) => {
    if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
    if (bmi >= 18.5 && bmi <= 24.9) return <Tag color="green">Bình thường</Tag>;
    if (bmi >= 25 && bmi <= 29.9) return <Tag color="gold">Thừa cân</Tag>;
    if (bmi >= 30) return <Tag color="red">Béo phì</Tag>;
    return null;
  };

  const handleFinish = (values: any) => {
    const bmi = calculateBMI(values.weight, values.height);
    const metricData: HealthMetric = {
      ...values,
      bmi,
      id: editingMetric ? editingMetric.id : Math.random().toString(36).substr(2, 9),
      date: values.date.format('YYYY-MM-DD'),
    };

    if (editingMetric) {
      dispatch(updateHealthMetric(metricData));
      message.success('Cập nhật chỉ số thành công!');
    } else {
      dispatch(addHealthMetric(metricData));
      message.success('Thêm chỉ số thành công!');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteHealthMetric(id));
    message.success('Xóa chỉ số thành công!');
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
      sorter: (a: HealthMetric, b: HealthMetric) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Chiều cao (m)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
      render: (bmi: number) => (
        <Space>
          {bmi}
          {getBMITag(bmi)}
        </Space>
      ),
    },
    {
      title: 'Nhịp tim nghỉ (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
    },
    {
      title: 'Giờ ngủ (tiếng)',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: HealthMetric) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showModal(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Nhật ký chỉ số sức khỏe</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Ghi nhận chỉ số mới
        </Button>
      </div>

      <Table columns={columns} dataSource={healthMetrics} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={editingMetric ? "Sửa chỉ số" : "Thêm chỉ số"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
            <InputNumber min={20} max={300} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao (m)" rules={[{ required: true }]}>
            <InputNumber min={0.5} max={3} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)">
            <InputNumber min={30} max={200} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sleepHours" label="Giờ ngủ (tiếng)">
            <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthMetrics;
