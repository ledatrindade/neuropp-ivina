export type UserRole = "ADMIN" | "RESPONSIBLE";

export type LoginResponse = {
  token: string;
  tokenType: "Bearer" | string;
  expiresAt: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

export type RegisterResponsibleResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};
