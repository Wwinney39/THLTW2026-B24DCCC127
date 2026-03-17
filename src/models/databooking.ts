// 1. Định nghĩa Interface (Giữ nguyên cấu trúc của bạn)
export interface Staff {
  id: number;
  name: string;
  workStart: string; // "09:00"
  workEnd: string;   // "17:00"
  maxCustomersPerDay: number;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number; // phút
}

export interface Appointment {
  id: number;
  customerName: string;
  serviceId: number;
  staffId: number;
  date: string;      // "2025-03-18"
  startTime: string; // "10:00"
  endTime: string;   // "10:30"
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  rating?: number;
  review?: string;
  reply?: string;
}

// 2. Dữ liệu SERVICES (Sửa ID thành number)
export const SERVICES: Service[] = [
  { id: 1, name: 'Cắt tóc nam', price: 100000, duration: 30 },
  { id: 2, name: 'Gội đầu dưỡng sinh (Spa)', price: 200000, duration: 60 },
  { id: 3, name: 'Khám tổng quát', price: 500000, duration: 45 },
  { id: 4, name: 'Sửa chữa máy tính', price: 300000, duration: 90 },
];

// 3. Dữ liệu STAFF (Sửa thành kiểu Staff và khớp các trường dữ liệu)
export const STAFFS: Staff[] = [
  { 
    id: 1, 
    name: 'Nguyễn Văn An', 
    maxCustomersPerDay: 5, 
    workStart: '09:00', 
    workEnd: '17:00' 
  },
  { 
    id: 2, 
    name: 'Trần Thị Bình', 
    maxCustomersPerDay: 3, 
    workStart: '08:00', 
    workEnd: '12:00' 
  },
  { 
    id: 3, 
    name: 'Lê Văn Cường', 
    maxCustomersPerDay: 8, 
    workStart: '13:00', 
    workEnd: '21:00' 
  },
];