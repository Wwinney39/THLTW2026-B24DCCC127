import React, { useState } from 'react';
import { Card, Row, Col, Typography, Progress, Button, InputNumber, Drawer, Form, Input, Select, DatePicker, Popconfirm, Segmented, message, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { Goal, addGoal, updateGoal, updateGoalValue, deleteGoal } from '@/models/dataFitness';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const GoalManagement: React.FC = () => {
  const goals = useSelector((state: RootState) => state.fitnessState.goals);
  const dispatch = useDispatch();

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [form] = Form.useForm();

  const showDrawer = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      form.setFieldsValue({
        ...goal,
        deadline: moment(goal.deadline),
      });
    } else {
      setEditingGoal(null);
      form.resetFields();
      form.setFieldsValue({ status: 'In Progress' });
    }
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const handleFinish = (values: any) => {
    const goalData: Goal = {
      ...values,
      id: editingGoal ? editingGoal.id : Math.random().toString(36).substr(2, 9),
      deadline: values.deadline.format('YYYY-MM-DD'),
      currentValue: editingGoal ? editingGoal.currentValue : (values.initialValue || 0),
    };

    if (editingGoal) {
      dispatch(updateGoal(goalData));
      message.success('Cập nhật mục tiêu thành công!');
    } else {
      dispatch(addGoal(goalData));
      message.success('Thêm mục tiêu mới thành công!');
    }
    closeDrawer();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteGoal(id));
    message.success('Xóa mục tiêu thành công!');
  };

  const handleUpdateCurrentValue = (id: string, value: number) => {
    dispatch(updateGoalValue({ id, currentValue: value }));
  };

  const filteredGoals = goals.filter(g => {
    if (filterStatus === 'All') return true;
    return g.status === filterStatus;
  });

  const getStatusTag = (status: string) => {
    if (status === 'In Progress') return <Tag color="processing">Đang thực hiện</Tag>;
    if (status === 'Achieved') return <Tag color="success">Đã đạt</Tag>;
    if (status === 'Cancelled') return <Tag color="default">Đã hủy</Tag>;
    return null;
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Mục tiêu</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()} size="large">
          Thêm Mục tiêu
        </Button>
      </div>

      <div style={{ marginBottom: 24, backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <Text strong style={{ marginRight: 16 }}>Lọc trạng thái:</Text>
        <Segmented
          options={[
            { label: 'Tất cả', value: 'All' },
            { label: 'Đang thực hiện', value: 'In Progress' },
            { label: 'Đã đạt', value: 'Achieved' },
            { label: 'Đã hủy', value: 'Cancelled' },
          ]}
          value={filterStatus}
          onChange={value => setFilterStatus(value as string)}
        />
      </div>

      <Row gutter={[24, 24]}>
        {filteredGoals.map(goal => {
          const isWeightLoss = goal.type === 'Giảm cân';
          let percent = 0;
          if (isWeightLoss) {
            percent = goal.currentValue <= goal.targetValue ? 100 : Math.max(0, 100 - ((goal.currentValue - goal.targetValue) / goal.targetValue * 100));
          } else {
            percent = calculateProgress(goal.currentValue, goal.targetValue);
          }

          return (
            <Col xs={24} sm={12} lg={8} key={goal.id}>
              <Card 
                title={<Space><TrophyOutlined style={{ color: '#faad14' }}/> {goal.name}</Space>}
                extra={getStatusTag(goal.status)}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}
                actions={[
                  <Button type="text" icon={<EditOutlined />} onClick={() => showDrawer(goal)}>Sửa</Button>,
                  <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(goal.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
                  </Popconfirm>
                ]}
              >
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary">Loại: </Text>
                  <Tag>{goal.type}</Tag>
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary">Hạn chót: </Text>
                  <Text>{moment(goal.deadline).format('DD/MM/YYYY')}</Text>
                </div>

                <div style={{ margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Hiện tại: 
                      <InputNumber 
                        size="small" 
                        value={goal.currentValue} 
                        onChange={(val) => handleUpdateCurrentValue(goal.id, val as number)}
                        style={{ width: '80px', marginLeft: '8px' }}
                      />
                    </Text>
                    <Text strong>Mục tiêu: {goal.targetValue}</Text>
                  </div>
                  <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} />
                </div>
              </Card>
            </Col>
          );
        })}
        {filteredGoals.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">Không có mục tiêu nào phù hợp.</Text>
          </Col>
        )}
      </Row>

      <Drawer
        title={editingGoal ? "Sửa Mục tiêu" : "Thêm Mục tiêu Mới"}
        width={400}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>Hủy</Button>
            <Button onClick={() => form.submit()} type="primary">Lưu</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Vd: Chạy 5km, Giảm 5kg..." />
          </Form.Item>
          <Form.Item name="type" label="Loại mục tiêu" rules={[{ required: true }]}>
            <Select>
              <Option value="Giảm cân">Giảm cân</Option>
              <Option value="Tăng cơ">Tăng cơ</Option>
              <Option value="Cải thiện sức bền">Cải thiện sức bền</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          {!editingGoal && (
            <Form.Item name="initialValue" label="Giá trị hiện tại ban đầu" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="deadline" label="Hạn chót" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="In Progress">Đang thực hiện</Option>
              <Option value="Achieved">Đã đạt</Option>
              <Option value="Cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default GoalManagement;
