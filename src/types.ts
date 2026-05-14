export type RoomType = 'landing' | 'reception' | 'room-simple' | 'room-double' | 'room-suite' | 'hotel-gym' | 'hotel-pool' | 'salon';

export interface RoomData {
  id: RoomType;
  name: string;
  image: string;
  panorama?: string;
  description: string;
  features: string[];
  price?: string;
}

export interface RoomState {
  lights: boolean;
  tv: boolean;
  ac: boolean;
  security: boolean;
  temp: number;
}
