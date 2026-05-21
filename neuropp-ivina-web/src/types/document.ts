/*
 * Tipo de documento privado liberado pela Ivina.
 */

export type DocumentType =
  | "EVALUATION"
  | "SESSION"
  | "DEVOLUTION"
  | "GUIDANCE";

export type AttendanceDocumentResponse = {
  id: string;

  appointmentId: string;

  responsibleId: string;
  responsibleName: string;

  childId: string;
  childName: string;

  title: string;
  documentType: DocumentType;
  content?: string;
  fileUrl?: string;

  isReleased: boolean;
  releasedAt?: string;
  createdAt: string;
};