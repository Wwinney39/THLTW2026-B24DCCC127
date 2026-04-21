import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, Popconfirm, Modal, Form, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { addPost, updatePost, deletePost, Post } from '@/models/dataBlog';

const { Option } = Select;
const { TextArea } = Input;

const Admin: React.FC = () => {
  const posts = useSelector((state: RootState) => state.blogState.posts);
  const tags = useSelector((state: RootState) => state.blogState.tags);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchText = post.title.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = filterStatus === 'all' || post.status === filterStatus;
      return matchText && matchStatus;
    });
  }, [posts, searchText, filterStatus]);

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      form.setFieldsValue(post);
    } else {
      setEditingPost(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPost(null);
  };

  const handleSubmit = (values: any) => {
    if (editingPost) {
      dispatch(updatePost({ ...editingPost, ...values }));
      message.success('Cập nhật bài viết thành công');
    } else {
      const newPost: Post = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Admin', // default mock author
      };
      dispatch(addPost(newPost));
      message.success('Thêm bài viết mới thành công');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePost(id));
    message.success('Xóa bài viết thành công');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã đăng' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ tag',
      dataIndex: 'tags',
      key: 'tags',
      render: (postTags: string[]) => (
        <>
          {postTags.map((tag: React.Key | null | undefined) => (
            <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Post) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size="small" />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="Quản lý bài viết" style={{ borderRadius: 8 }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Input
                placeholder="Tìm tiêu đề..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="published">Đã đăng</Option>
                <Option value="draft">Bản nháp</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              Thêm bài viết
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingPost ? "Sửa bài viết" : "Thêm bài viết"}
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
                <Input placeholder="bai-viet-moi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="thumbnail" label="URL Ảnh nền" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]} initialValue="draft">
                <Select>
                  <Option value="draft">Bản nháp</Option>
                  <Option value="published">Đã đăng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
            <TextArea rows={2} placeholder="Nhập tóm tắt..." />
          </Form.Item>

          <Form.Item name="tags" label="Thẻ tag" rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ' }]}>
            <Select mode="multiple" placeholder="Chọn thẻ">
              {tags.map(tag => (
                <Option key={tag.id} value={tag.name}>{tag.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TextArea rows={10} placeholder="Nhập nội dung bài viết dưới dạng Markdown..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
