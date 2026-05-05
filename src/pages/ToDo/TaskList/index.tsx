import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Popconfirm, Tooltip, Modal, Form, DatePicker, Select, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useTasks, Task, TaskStatus } from '../useTasks';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

const { Search, TextArea } = Input;
const { Option } = Select;

const statusMap: Record<TaskStatus, { text: string; color: string }> = {
  TODO: { text: 'Cần làm', color: 'default' },
  IN_PROGRESS: { text: 'Đang làm', color: 'processing' },
  DONE: { text: 'Hoàn thành', color: 'success' },
};

const priorityColorMap: Record<string, string> = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'green',
};

const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openAddModal = () => {
    setEditingTaskId(null);
    form.resetFields();
    form.setFieldsValue({ priority: 'MEDIUM', status: 'TODO' });
    setIsModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    form.setFieldsValue({
      ...task,
      deadline: moment(task.deadline),
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        deadline: values.deadline.toISOString(),
        status: values.status || 'TODO',
      };

      if (editingTaskId) {
        updateTask(editingTaskId, formattedValues);
      } else {
        addTask(formattedValues);
      }
      setIsModalVisible(false);
      form.resetFields();
    }).catch(() => {

    });
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Tên Task',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Cần làm', value: 'TODO' },
        { text: 'Đang làm', value: 'IN_PROGRESS' },
        { text: 'Hoàn thành', value: 'DONE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: TaskStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const text = priority === 'HIGH' ? 'Cao' : priority === 'MEDIUM' ? 'Trung bình' : 'Thấp';
        return <Tag color={priorityColorMap[priority]}>{text}</Tag>;
      },
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag) => (tag ? <Tag color="cyan">{tag}</Tag> : '-'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa task này?"
            onConfirm={() => deleteTask(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8, minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Tìm kiếm theo tên..."
          allowClear
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={openAddModal}
        >
          Thêm Task mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredTasks} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTaskId ? "Chỉnh sửa Công việc" : "Thêm Công việc mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTaskId ? "Cập nhật" : "Lưu"}
        cancelText="Hủy"
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên công việc"
            rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="deadline"
              label="Hạn chót"
              rules={[{ required: true, message: 'Vui lòng chọn hạn chót!' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} showTime format="DD/MM/YYYY HH:mm" />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Mức độ ưu tiên"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Option value="HIGH">Cao</Option>
                <Option value="MEDIUM">Trung bình</Option>
                <Option value="LOW">Thấp</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
             <Form.Item
              name="tag"
              label="Tag (Nhãn)"
              style={{ flex: 1 }}
            >
              <Input placeholder="Ví dụ: Work, Personal, Bug..." />
            </Form.Item>

            {editingTaskId && (
              <Form.Item
                name="status"
                label="Trạng thái"
                style={{ flex: 1 }}
              >
                <Select>
                  <Option value="TODO">Cần làm</Option>
                  <Option value="IN_PROGRESS">Đang làm</Option>
                  <Option value="DONE">Hoàn thành</Option>
                </Select>
              </Form.Item>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList;
