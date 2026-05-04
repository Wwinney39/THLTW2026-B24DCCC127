import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Select, Modal, Form, InputNumber, Popconfirm, Tag, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BookOutlined, FireOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { Exercise, addExercise, updateExercise, deleteExercise } from '@/models/dataFitness';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ExerciseLibrary: React.FC = () => {
  const exercises = useSelector((state: RootState) => state.fitnessState.exercises);
  const dispatch = useDispatch();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  const showForm = (exercise?: Exercise) => {
    if (exercise) {
      setCurrentExercise(exercise);
      form.setFieldsValue(exercise);
    } else {
      setCurrentExercise(null);
      form.resetFields();
    }
    setIsFormVisible(true);
  };

  const showDetail = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsDetailVisible(true);
  };

  const handleFinish = (values: any) => {
    const exerciseData: Exercise = {
      ...values,
      id: currentExercise ? currentExercise.id : Math.random().toString(36).substr(2, 9),
    };

    if (currentExercise) {
      dispatch(updateExercise(exerciseData));
      message.success('Cập nhật bài tập thành công!');
    } else {
      dispatch(addExercise(exerciseData));
      message.success('Thêm bài tập mới thành công!');
    }
    setIsFormVisible(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteExercise(id));
    message.success('Xóa bài tập thành công!');
  };

  const getDifficultyTag = (level: string) => {
    if (level === 'Dễ') return <Tag color="green">Dễ</Tag>;
    if (level === 'Trung bình') return <Tag color="gold">Trung bình</Tag>;
    if (level === 'Khó') return <Tag color="red">Khó</Tag>;
    return <Tag>{level}</Tag>;
  };

  const filteredExercises = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchText.toLowerCase()) || e.description.toLowerCase().includes(searchText.toLowerCase());
    const matchMuscle = filterMuscle ? e.muscleGroup === filterMuscle : true;
    const matchDiff = filterDifficulty ? e.difficulty === filterDifficulty : true;
    return matchSearch && matchMuscle && matchDiff;
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <Title level={2} style={{ margin: 0 }}>Thư viện Bài tập</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showForm()}>
          Thêm bài tập
        </Button>
      </div>

      <Space style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm tên bài tập..."
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          placeholder="Lọc nhóm cơ"
          allowClear
          style={{ width: 150 }}
          onChange={value => setFilterMuscle(value)}
        >
          <Option value="Chest">Chest (Ngực)</Option>
          <Option value="Back">Back (Lưng)</Option>
          <Option value="Legs">Legs (Chân)</Option>
          <Option value="Shoulders">Shoulders (Vai)</Option>
          <Option value="Arms">Arms (Tay)</Option>
          <Option value="Core">Core (Bụng)</Option>
          <Option value="Full Body">Full Body (Toàn thân)</Option>
        </Select>
        <Select
          placeholder="Mức độ khó"
          allowClear
          style={{ width: 150 }}
          onChange={value => setFilterDifficulty(value)}
        >
          <Option value="Dễ">Dễ</Option>
          <Option value="Trung bình">Trung bình</Option>
          <Option value="Khó">Khó</Option>
        </Select>
      </Space>

      <Row gutter={[24, 24]}>
        {filteredExercises.map(exercise => (
          <Col xs={24} sm={12} lg={8} key={exercise.id}>
            <Card
              hoverable
              title={<Space><BookOutlined style={{ color: '#1890ff' }} /> {exercise.name}</Space>}
              extra={getDifficultyTag(exercise.difficulty)}
              style={{ borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ flex: 1 }}
              actions={[
                <Button type="text" onClick={() => showDetail(exercise)}>Chi tiết</Button>,
                <Button type="text" icon={<EditOutlined />} onClick={() => showForm(exercise)}>Sửa</Button>,
                <Popconfirm title="Xóa bài tập này?" onConfirm={() => handleDelete(exercise.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
              ]}
            >
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary">Nhóm cơ: </Text>
                <Tag color="blue">{exercise.muscleGroup}</Tag>
              </div>
              <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                {exercise.description}
              </Paragraph>
              <div>
                <Text type="secondary">Calo trung bình/giờ: </Text>
                <Text strong>{exercise.caloriesPerHour} kcal</Text>
              </div>
            </Card>
          </Col>
        ))}
        {filteredExercises.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">Không tìm thấy bài tập nào phù hợp.</Text>
          </Col>
        )}
      </Row>

      {/* Modal Form Thêm/Sửa */}
      <Modal
        title={currentExercise ? "Sửa Bài Tập" : "Thêm Bài Tập Mới"}
        visible={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="muscleGroup" label="Nhóm cơ tác động" rules={[{ required: true }]}>
            <Select>
              <Option value="Chest">Chest</Option>
              <Option value="Back">Back</Option>
              <Option value="Legs">Legs</Option>
              <Option value="Shoulders">Shoulders</Option>
              <Option value="Arms">Arms</Option>
              <Option value="Core">Core</Option>
              <Option value="Full Body">Full Body</Option>
            </Select>
          </Form.Item>
          <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true }]}>
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
            </Select>
          </Form.Item>
          <Form.Item name="caloriesPerHour" label="Calo đốt trung bình/giờ" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả & Hướng dẫn" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsFormVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chi tiết */}
      <Modal
        title={currentExercise?.name}
        visible={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>Đóng</Button>
        ]}
      >
        {currentExercise && (
          <div>
            <div style={{ marginBottom: 16 }}>
              {getDifficultyTag(currentExercise.difficulty)}
              <Tag color="blue" style={{ marginLeft: 8 }}>{currentExercise.muscleGroup}</Tag>
            </div>
            <Title level={5}>Hướng dẫn thực hiện:</Title>
            <Paragraph style={{ whiteSpace: 'pre-line' }}>
              {currentExercise.description}
            </Paragraph>
            <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <FireOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
              <Text>Đốt cháy khoảng <Text strong>{currentExercise.caloriesPerHour} kcal</Text> mỗi giờ tập luyện.</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;
