import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  expertise: string;
  clubId: string;
  reason: string;
  status: AppStatus;
  history: string[];
  note?: string;
  joinedAt?: string;
}

interface AppState {
  applications: Application[];
}

const initialState: AppState = {
  applications: [
    {
      id: '1',
      fullName: 'Phạm Văn C',
      email: 'phamc@example.com',
      phone: '0901234567',
      gender: 'Nam',
      address: 'Hà Nội',
      expertise: 'Lập trình Fullstack',
      clubId: '1',
      reason: 'Tôi muốn học thêm về lập trình web.',
      status: 'Pending',
      history: ['Ứng viên đã gửi đơn vào 09:00 09/04/2025'],
    },
    {
      id: '2',
      fullName: 'Lê Thị D',
      email: 'lethid@example.com',
      phone: '0912345678',
      gender: 'Nữ',
      address: 'TP HCM',
      expertise: 'Thiết kế UI/UX',
      clubId: '2',
      reason: 'Tôi muốn tham gia để mở rộng kỹ năng thiết kế.',
      status: 'Approved',
      joinedAt: '09/04/2025',
      history: ['Admin đã Approved vào lúc 17:00 09/04/2025'],
    },
  ],
};

export const appSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    saveApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index > -1) {
        state.applications[index] = action.payload;
      } else {
        state.applications.push(action.payload);
      }
    },
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(a => a.id !== action.payload);
    },
    updateStatus: (state, action: PayloadAction<{ ids: string[]; status: AppStatus; note?: string }>) => {
      const { ids, status, note } = action.payload;
      state.applications.forEach(app => {
        if (ids.includes(app.id)) {
          app.status = status;
          if (status === 'Approved' && !app.joinedAt) {
            app.joinedAt = new Date().toLocaleDateString('vi-VN');
          }
          if (status === 'Rejected') {
            app.note = note;
          }
          const log = `Admin đã ${status} vào lúc ${new Date().toLocaleString('vi-VN')}${note ? ` với lý do: ${note}` : ''}`;
          app.history.push(log);
        }
      });
    },
    transferClub: (state, action: PayloadAction<{ ids: string[]; newClubId: string }>) => {
      const { ids, newClubId } = action.payload;
      state.applications.forEach(app => {
        if (ids.includes(app.id)) {
          app.clubId = newClubId;
          app.history.push(`Admin đã chuyển CLB sang ${newClubId} vào lúc ${new Date().toLocaleString('vi-VN')}`);
        }
      });
    },
  },
});

export const { saveApplication, deleteApplication, updateStatus, transferClub } = appSlice.actions;
export default appSlice.reducer;