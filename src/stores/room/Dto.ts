export interface IRoom {
  id: string;
  name: string;
  unreadCount: number;
  company: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoomReducer {
  activeRoom: {};
  roomId: string;
  roomName: string;
  messages: any[];
  typing: {
    users: Array<{
      name: string;
      roomId: string;
    }>;
  };
  users: any[];
  roomMembers: any[];
  rooms: IRoom[];
  companyRooms: any[];
  loading: boolean;
  emojiPicker: boolean;
  roomError: string;
}
