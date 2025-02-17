import { AuthRequest } from "./auth-request.type";

export interface EventItem {
  id?: number;
  eventName: string;
  eventDate: Date | string;
  eventDescription?: string;
  eventLocation: string,
  numberOfParticipants: number,
  createdAt?: Date,
  updatedAt?: Date,
  UserUserName?: string;
  Users?: AuthRequest[];
}

