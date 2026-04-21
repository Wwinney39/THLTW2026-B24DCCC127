import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Popconfirm, Modal, Form, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/models/store';
import { addTag, updateTag, deleteTag, Tag } from '@/models/dataBlog';

const TagManagement: React.FC = () => {
  const tags = useSelector((state: RootState) => state.blogState.tags);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      form.setFieldsValue({ name: tag.name });
    } else {
      setEditingTag(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTag(null);
  };

  const handleSubmit = (values: any) => {
    // Check if tag already exists
    const exists = tags.find(t => t.name.toLowerCase() === values.name.trim().toLowerCase() && t.id !== editingTag?.id);
    if (exists) {
      message.error('Thẻ tag này đã tồn tại!');
      return;
    }

    if (editingTag) {
      dispatch(updateTag({ ...editingTag, name: values.name.trim() }));
      message.success('Cập nhật thẻ tag thành công');
    } else {
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: values.name.trim(),
        postCount: 0,
      };
      dispatch(addTag(newTag));
      message.success('Thêm thẻ tag mới thành công');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (record: Tag) => {
    if (record.postCount > 0) {
      message.error(`Không thể xóa thẻ này vì có ${record.postCount} bài viết đang sử dụng!`);
      return;
    }
    dispatch(deleteTag(record.id));
    message.success('Xóa thẻ tag thành công');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
    },
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      render: (count: number) => (
        <span style={{ color: count > 0 ? '#52c41a' : '#bfbfbf', fontWeight: 'bold' }}>
          {count} bài viết
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Tag) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} size="small" />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thẻ này?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
            disabled={record.postCount > 0}
          >
            <Button danger icon={<DeleteOutlined />} size="small" disabled={record.postCount > 0} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="Quản lý thẻ (Tag)" style={{ borderRadius: 8 }}>
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              Thêm thẻ tag
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingTag ? "Sửa thẻ tag" : "Thêm thẻ tag"}
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thẻ' },
              { whitespace: true, message: 'Tên thẻ không được chứa toàn khoảng trắng' }
            ]}
          >
            <Input placeholder="Nhập phần tên thẻ mới (VD: React, NodeJS...)" autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagement;
