
import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  message,
  Divider,
  Card,
  Space,
  Tag,
  Typography,
  Tabs,
  Modal,
} from "antd";

import {
  PlusOutlined,
  FileTextOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

interface Subject {
  id: string;
  name: string;
}

interface Question {
  id: number;
  content: string;
  subjectId: string;
  blockId: string;
}

const QuestionBank: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [subjectForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [subjectEditForm] = Form.useForm();
  const [questionEditForm] = Form.useForm();

  const [newBlock, setNewBlock] = useState("");

  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    const savedBlocks = localStorage.getItem("blocks");
    const savedQuestions = localStorage.getItem("questions");

    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedBlocks) setBlocks(JSON.parse(savedBlocks));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleAddSubject = (values: Subject) => {
    if (subjects.find((s) => s.id === values.id)) {
      message.error("Mã môn đã tồn tại!");
      return;
    }

    setSubjects([...subjects, values]);
    subjectForm.resetFields();
    message.success("Đã thêm môn học!");
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    message.success("Đã xóa môn học");
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    subjectEditForm.setFieldsValue(subject);
  };

  const handleUpdateSubject = () => {
    subjectEditForm.validateFields().then((values) => {
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject?.id ? values : s
        )
      );

      setEditingSubject(null);
      message.success("Cập nhật môn học thành công");
    });
  };

  const handleAddBlock = () => {
    if (!newBlock) return;

    if (blocks.includes(newBlock)) {
      message.error("Khối đã tồn tại!");
      return;
    }

    setBlocks([...blocks, newBlock]);
    setNewBlock("");
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);

    questionEditForm.setFieldsValue({
      content: q.content,
      subjectId: q.subjectId,
      blockId: q.blockId,
    });
  };

  const handleUpdateQuestion = () => {
    questionEditForm.validateFields().then((values) => {
      if (!editingQuestion) return;

      const updated = questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...values } : q
      );

      setQuestions(updated);

      setEditingQuestion(null);
      questionEditForm.resetFields();

      message.success("Cập nhật câu hỏi thành công");
    });
  };

  const tabConfig = (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <Card title="Thêm môn học" size="small" style={{ flex: "1 1 400px" }}>
        <Form
          form={subjectForm}
          onFinish={handleAddSubject}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="id" rules={[{ required: true }]}>
            <Input placeholder="Mã môn" style={{ width: 120 }} />
          </Form.Item>

          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Tên môn" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => subjectForm.submit()}
                >
              Thêm
            </Button>
          </Form.Item>
        </Form>

        <Table
          dataSource={subjects}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: "Mã", dataIndex: "id" },
            { title: "Tên môn", dataIndex: "name" },
            {
              title: "Hành động",
              render: (_, r: Subject) => (
                <Space>
                  <Button type="link" onClick={() => handleEditSubject(r)}>
                    Sửa
                  </Button>

                  <Button
                    type="link"
                    danger
                    onClick={() => handleDeleteSubject(r.id)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Card title="Khối kiến thức" size="small" style={{ flex: "1 1 300px" }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            value={newBlock}
            onChange={(e) => setNewBlock(e.target.value)}
            placeholder="Nhập khối..."
          />

          <Button type="primary" onClick={handleAddBlock}>
            Lưu
          </Button>
        </Space>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {blocks.map((b) => (
            <Tag
              key={b}
              color="blue"
              closable
              onClose={(e) => {
                e.preventDefault();
                setBlocks(blocks.filter((i) => i !== b));
              }}
            >
              {b}
            </Tag>
          ))}
        </div>
      </Card>
    </div>
  );

  const tabQuestions = (
    <Card size="small">
      <Form
        form={questionForm}
        layout="vertical"
        onFinish={(v) => {
          const newQuestion: Question = {
            id: Date.now(),
            content: v.content,
            subjectId: v.subjectId,
            blockId: v.blockId,
          };

          setQuestions([...questions, newQuestion]);

          message.success("Đã lưu câu hỏi");
          questionForm.resetFields();
        }}
      >
        <Space align="end" wrap>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 160 }}
              options={subjects.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="blockId" label="Khối">
            <Select
              style={{ width: 160 }}
              options={blocks.map((b) => ({
                label: b,
                value: b,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu câu hỏi
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <Divider />

      <Table
        dataSource={questions}
        rowKey="id"
        columns={[
          { title: "Nội dung", dataIndex: "content" },
          {
            title: "Môn",
            dataIndex: "subjectId",
            render: (id: string) =>
              subjects.find((s) => s.id === id)?.name || id,
          },
          {
            title: "Hành động",
            render: (_, r: Question) => (
              <Space>
                <Button type="link" onClick={() => handleEditQuestion(r)}>
                  Sửa
                </Button>

                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setQuestions(questions.filter((q) => q.id !== r.id))
                  }
                />
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>
      <Card bordered={false}>
        <Title level={4}>Hệ thống Ngân hàng câu hỏi</Title>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane
            tab={
              <span>
                <BookOutlined /> Môn học & Khối
              </span>
            }
            key="1"
          >
            {tabConfig}
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined /> Câu hỏi
              </span>
            }
            key="2"
          >
            {tabQuestions}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Sửa môn học"
        visible={!!editingSubject}
        onCancel={() => setEditingSubject(null)}
        onOk={handleUpdateSubject}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={subjectEditForm} layout="vertical">
          <Form.Item name="id" label="Mã môn">
            <Input disabled />
          </Form.Item>

          <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa câu hỏi"
        visible={!!editingQuestion}
        onCancel={() => setEditingQuestion(null)}
        onOk={handleUpdateQuestion}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={questionEditForm} layout="vertical">
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="subjectId" label="Môn">
            <Select
              options={subjects.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="blockId" label="Khối">
            <Select
              options={blocks.map((b) => ({
                label: b,
                value: b,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionBank;

