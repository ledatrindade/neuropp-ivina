/*
 * Tipo de resposta da criança criada pela API.
 */

export type ChildResponse = {
  id: string;
  name: string;
  age: number;
  responsibleId: string;
  responsibleName: string;
};