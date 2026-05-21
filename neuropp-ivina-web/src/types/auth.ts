/*
 * Tipos usados no fluxo de login e cadastro.
 */

export type UserRole = "ADMIN" | "RESPONSIBLE";

export type LoginResponse = {
  token: string;
  tokenType: "Bearer";
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