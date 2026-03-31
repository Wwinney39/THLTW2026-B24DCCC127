import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import giao diện mặc định

interface Props {
  value?: string;
  onChange?: (content: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  // Cấu hình các nút trên thanh công cụ
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'] // Nút xóa định dạng
    ],
  };

  return (
    <div style={{ background: '#fff' }}>
      <ReactQuill 
        theme="snow" 
        value={value || ''} 
        onChange={onChange} 
        modules={modules}
        style={{ height: '250px', marginBottom: '40px' }} // Cho cao lên tí và cách lề dưới
      />
    </div>
  );
};

export default RichTextEditor;