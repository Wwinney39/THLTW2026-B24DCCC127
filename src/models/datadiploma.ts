export type DataType = 'String' | 'Number' | 'Date';

export interface FieldConfig {
  id: string;
  fieldName: string;
  dataType: DataType;
}

export interface SoVanBang {
  id: string;
  nam: number;
  soHienTai: number;
}

export interface Diploma {
  key: string;
  quyetDinhId: string; // Liên kết với quyết định
  soVaoSo: number;
  soHieu: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  metadata: Record<string, any>; // Lưu các trường động như Dân tộc, GPA...
}

export interface QuyetDinh {
  id: string;
  soQD: string;
  ngayBanHanh: string;
  trichYeu: string;
  soVanBangId: string;
  searchCount?: number; // Ghi nhận tổng số lượt tra cứu
}

export interface SearchQuery {
  soHieu?: string;
  soVaoSo?: number;
  maSV?: string;
  hoTen?: string;
  ngaySinh?: string;
  quyetDinhId?: string;
}