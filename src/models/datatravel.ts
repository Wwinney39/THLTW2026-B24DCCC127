export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  type: 'Biển' | 'Núi' | 'Thành phố' | 'Văn hóa' | 'Khác';
  price: number; // Mức chi phí ước tính chung
  visitTime: number; // Thời gian tham quan ước tính (giờ)
  costFood: number; // Mức chi ăn uống
  costAccommodation: number; // Mức chi lưu trú
  costTravel: number; // Mức chi di chuyển
}

export interface ItineraryDay {
  date: string; // ISO string hoặc ngày cụ thể
  destinationIds: string[];
}

export interface Itinerary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  budgetLimit: number;
}



export const initialDestinations: Destination[] = [
  {
    id: 'd1',
    name: 'Vịnh Hạ Long',
    location: 'Quảng Ninh',
    description: 'Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi kỳ vĩ.',
    image: 'https://static-images.vnncdn.net/files/publish/2022/7/27/ha-long-bay-1-852.jpg',
    rating: 4.8,
    type: 'Biển',
    price: 2000000,
    visitTime: 8,
    costFood: 500000,
    costAccommodation: 1000000,
    costTravel: 500000,
  },
  {
    id: 'd2',
    name: 'Phố cổ Hội An',
    location: 'Quảng Nam',
    description: 'Khu phố cổ giữ được gần như nguyên vẹn với hơn 1000 di tích kiến trúc.',
    image: 'https://anhdephd.vn/wp-content/uploads/2022/04/anh-hoi-an.jpg',
    rating: 4.7,
    type: 'Văn hóa',
    price: 1500000,
    visitTime: 12,
    costFood: 400000,
    costAccommodation: 800000,
    costTravel: 300000,
  },
  {
    id: 'd3',
    name: 'Sa Pa',
    location: 'Lào Cai',
    description: 'Thị trấn mờ sương với ruộng bậc thang và cảnh quan hùng vĩ.',
    image: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/hinh-anh-sapa.jpg',
    rating: 4.6,
    type: 'Núi',
    price: 2500000,
    visitTime: 24,
    costFood: 600000,
    costAccommodation: 1200000,
    costTravel: 700000,
  },
  {
    id: 'd4',
    name: 'Đà Nẵng',
    location: 'Đà Nẵng',
    description: 'Thành phố đáng sống với những cây cầu độc đáo và bãi biển tuyệt đẹp.',
    image: 'https://img1.kienthucvui.vn/uploads/2019/08/15/nhung-hinh-anh-dep-nhat-ve-da-nang_102910333.jpg',
    rating: 4.9,
    type: 'Thành phố',
    price: 3000000,
    visitTime: 48,
    costFood: 1000000,
    costAccommodation: 1500000,
    costTravel: 500000,
  },
  {
    id: 'd5',
    name: 'Phú Quốc',
    location: 'Kiên Giang',
    description: 'Đảo ngọc với bãi biển cát trắng, nước biển trong xanh.',
    image: 'https://anhdephd.vn/wp-content/uploads/2022/05/anh-dao-phu-quoc-voi-thuyen-du-lich.jpg',
    rating: 4.8,
    type: 'Biển',
    price: 4000000,
    visitTime: 48,
    costFood: 1500000,
    costAccommodation: 2000000,
    costTravel: 500000,
  }
];

// Utility functions for LocalStorage mockup
export const getDestinations = (): Destination[] => {
  const data = localStorage.getItem('travel_destinations');
  if (data) return JSON.parse(data);
  localStorage.setItem('travel_destinations', JSON.stringify(initialDestinations));
  return initialDestinations;
};

export const saveDestinations = (destinations: Destination[]) => {
  localStorage.setItem('travel_destinations', JSON.stringify(destinations));
};

export const defaultItinerary = {
  id: 'it1',
  name: 'Chuyến đi mùa hè',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
  budgetLimit: 10000000,
  days: [
    { date: new Date().toISOString(), destinationIds: ['d1', 'd2'] },
    { date: new Date(Date.now() + 86400000).toISOString(), destinationIds: ['d4'] }
  ]
};

export const getItinerary = () => {
    const data = localStorage.getItem('travel_itinerary');
    if (data) return JSON.parse(data);
    localStorage.setItem('travel_itinerary', JSON.stringify(defaultItinerary));
    return defaultItinerary;
};

export const saveItinerary = (itinerary: any) => {
    localStorage.setItem('travel_itinerary', JSON.stringify(itinerary));
};
