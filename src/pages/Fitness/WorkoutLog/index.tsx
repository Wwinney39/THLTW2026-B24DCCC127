import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, DatePicker, InputNumber, Popconfirm, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { Workout, addWorkout, updateWorkout, deleteWorkout } from '@/models/dataFitness';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WorkoutLog: React.FC = () => {
  const workouts = useSelector((state: RootState) => state.fitnessState.workouts);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const showModal = (record?: Workout) => {
    if (record) {
      setEditingWorkout(record);
      form.setFieldsValue({
        ...record,
        date: moment(record.date),
      });
    } else {
      setEditingWorkout(null);
      form.resetFields();
      form.setFieldsValue({ date: moment(), status: 'Completed' });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    const workoutData: Workout = {
      ...values,
      id: editingWorkout ? editingWorkout.id : Math.random().toString(36).substr(2, 9),
      date: values.date.format('YYYY-MM-DD'),
    };

    if (editingWorkout) {
      dispatch(updateWorkout(workoutData));
      message.success('Cập nhật buổi tập thành công!');
    } else {
      dispatch(addWorkout(workoutData));
      message.success('Thêm buổi tập thành công!');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteWorkout(id));
    message.success('Xóa buổi tập thành công!');
  };

  const filteredWorkouts = workouts.filter((w) => {
    const matchSearch = w.notes.toLowerCase().includes(searchText.toLowerCase()) || w.type.toLowerCase().includes(searchText.toLowerCase());
    const matchType = filterType ? w.type === filterType : true;
    let matchDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const wDate = moment(w.date);
      matchDate = wDate.isSameOrAfter(dateRange[0], 'day') && wDate.isSameOrBefore(dateRange[1], 'day');
    }
    return matchSearch && matchType && matchDate;
  });

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
      sorter: (a: Workout, b: Workout) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue';
        if (type === 'Cardio') color = 'green';
        if (type === 'Strength') color = 'volcano';
        if (type === 'Yoga') color = 'purple';
        if (type === 'HIIT') color = 'red';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
      key: 'calories',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'success' : 'error'}>
          {status === 'Completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Workout) => (
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
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Space>
          <Input 
            placeholder="Tìm kiếm..." 
            prefix={<SearchOutlined />} 
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select 
            placeholder="Lọc loại" 
            allowClear 
            style={{ width: 150 }}
            onChange={value => setFilterType(value)}
          >
            <Option value="Cardio">Cardio</Option>
            <Option value="Strength">Strength</Option>
            <Option value="Yoga">Yoga</Option>
            <Option value="HIIT">HIIT</Option>
            <Option value="Other">Other</Option>
          </Select>
          <RangePicker 
            onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment] | null)}
            format="DD/MM/YYYY"
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm buổi tập
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredWorkouts} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={editingWorkout ? "Sửa buổi tập" : "Thêm buổi tập"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập!' }]}>
            <Select>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="calories" label="Calo đốt cháy" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Missed">Bỏ lỡ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
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

export default WorkoutLog;
