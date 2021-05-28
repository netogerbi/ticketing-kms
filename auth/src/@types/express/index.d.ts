export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserPayload | null;
    }
  }
}
