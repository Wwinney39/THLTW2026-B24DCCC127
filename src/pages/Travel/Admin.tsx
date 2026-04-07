import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Table, Button, Space, Modal, Form, Input, InputNumber, Select, Popconfirm, message, Card, Row, Col, Statistic, ConfigProvider, Rate, List } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import { getDestinations, saveDestinations } from '@/models/datatravel';
import { Destination } from '@/models/datatravel';

const { TabPane } = Tabs;
const { Option } = Select;

const Admin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setDestinations(getDestinations());
  }, []);

  const handleAdd = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Destination) => {
    setEditingDestination(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newData = destinations.filter(item => item.id !== id);
    setDestinations(newData);
    saveDestinations(newData);
    message.success('Xóa thành công');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      let newData = [...destinations];
      if (editingDestination) {
        // Edit mode
        const index = newData.findIndex(item => item.id === editingDestination.id);
        if (index > -1) {
          newData[index] = { ...editingDestination, ...values };
        }
      } else {
        // Add mode
        const newRecord: Destination = {
          ...values,
          id: `d_new_${Date.now()}`,
        };
        newData.push(newRecord);
      }
      setDestinations(newData);
      saveDestinations(newData);
      setIsModalVisible(false);
      message.success('Lưu thành công');
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (text: string) => <img src={text} alt="img" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} />,
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
    },
    {
      title: 'Chi phí ước tính',
      dataIndex: 'price',
      render: (val: number) => `${val.toLocaleString()} đ`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mock data for statistics
  const statConfig = {
    data: [
      { month: 'Tháng 1', count: 38 },
      { month: 'Tháng 2', count: 52 },
      { month: 'Tháng 3', count: 61 },
      { month: 'Tháng 4', count: 145 },
      { month: 'Tháng 5', count: 200 },
      { month: 'Tháng 6', count: 180 },
    ],
    xField: 'month',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      month: { alias: 'Tháng' },
      count: { alias: 'Lượt tạo' },
    },
  };

  const revenueByCategory = [
    { category: 'Ăn uống', value: 125000000 },
    { category: 'Lưu trú', value: 175000000 },
    { category: 'Di chuyển', value: 98000000 },
    { category: 'Vé tham quan', value: 54000000 },
  ];

  const popularDestinations = [
    { name: 'Vịnh Hạ Long', plans: 124, revenue: 54000000 },
    { name: 'Đà Nẵng', plans: 96, revenue: 42000000 },
    { name: 'Hội An', plans: 84, revenue: 36000000 },
  ];

  const totalPlans = statConfig.data.reduce((sum, item) => sum + item.count, 0);
  const totalRevenue = revenueByCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <PageContainer title="Quản Trị Hệ Thống">
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quản lý điểm đến" key="1">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Thêm điểm đến mới
              </Button>
            </div>
            <Table columns={columns} dataSource={destinations} rowKey="id" pagination={{ pageSize: 8 }} />
          </TabPane>
          
          <TabPane tab="Thống kê" key="2">
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                 <Card>
                    <Statistic
                      title="Tổng lượt tạo lịch trình"
                      value={totalPlans}
                      prefix={<UserOutlined />}
                    />
                 </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                 <Card>
                    <Statistic
                      title="Doanh thu thu về"
                      value={totalRevenue}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix="₫"
                    />
                 </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                 <Card>
                    <Statistic
                      title="Địa điểm phổ biến"
                      value={popularDestinations[0].name}
                      formatter={(val) => String(val)}
                    />
                 </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                 <Card>
                    <Statistic
                      title="Doanh thu theo hạng mục"
                      value={revenueByCategory.length}
                      suffix=" mục"
                    />
                 </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="Lượt tạo lịch trình theo tháng">
                  <div style={{ height: 300 }}>
                     {/* @ts-ignore */}
                     <Column {...statConfig} />
                  </div>
                </Card>

                <Card title="Địa điểm phổ biến" style={{ marginTop: 24 }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={popularDestinations}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          description={`Số lịch trình: ${item.plans} | Doanh thu: ${item.revenue.toLocaleString()} đ`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Doanh thu theo hạng mục">
                  {revenueByCategory.map(item => (
                    <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span>{item.category}</span>
                      <strong>{item.value.toLocaleString()} đ</strong>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingDestination ? "Sửa thông tin điểm đến" : "Thêm điểm đến mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <ConfigProvider locale={vi_VN}>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Vd: Vịnh Hạ Long" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Vị trí (Tỉnh/Thành)" rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="image" label="URL Hình ảnh" rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}>
                <Select>
                  <Option value="Biển">Biển</Option>
                  <Option value="Núi">Núi</Option>
                  <Option value="Thành phố">Thành phố</Option>
                  <Option value="Văn hóa">Văn hóa</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Tổng chi phí chung" rules={[{ required: true, message: 'Vui lòng nhập tổng chi phí chung' }]}>
                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            {/* The rest could be calculated or user input, let's allow user input */}
            <Col span={8}>
              <Form.Item name="costFood" label="Giá ăn uống" rules={[{ required: true, message: 'Vui lòng nhập giá ăn uống' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="costAccommodation" label="Giá lưu trú" rules={[{ required: true, message: 'Vui lòng nhập giá lưu trú' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costTravel" label="Giá di chuyển" rules={[{ required: true, message: 'Vui lòng nhập giá di chuyển' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="visitTime" label="Thời gian (Giờ)" rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đánh giá (Sao)">
                <Input.Group compact>
                  <Form.Item
                    name="rating"
                    noStyle
                    rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                  >
                    <InputNumber
                      min={0}
                      max={5}
                      step={0.5}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item shouldUpdate={(prev, curr) => prev.rating !== curr.rating} noStyle>
                    {({ getFieldValue }) => (
                      <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 12 }}>
                        <Rate allowHalf disabled value={getFieldValue('rating')} />
                        <span style={{ marginLeft: 8, minWidth: 32, textAlign: 'right' }}>
                          {getFieldValue('rating') ?? 0}
                        </span>
                      </span>
                    )}
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ConfigProvider>
      </Modal>
    </PageContainer>
  );
};

export default Admin;
