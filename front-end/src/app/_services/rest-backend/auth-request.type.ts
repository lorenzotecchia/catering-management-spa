export interface AuthRequest {
  usr: string;
  pwd: string;
  role?: 'maitre' | 'waiter';
}
