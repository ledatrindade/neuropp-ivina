export type DocumentType =
  | "EVALUATION"
  | "SESSION"
  | "DEVOLUTION"
  | "GUIDANCE";

export type AttendanceDocumentSummary = {
  id: string;
  appointmentId: string;
  responsibleId: string;
  responsibleName: string;
  childId: string;
  childName: string;
  title: string;
  documentType: DocumentType;
  isReleased: boolean;
  releasedAt?: string | null;
  createdAt: string;
};

export type AttendanceDocumentDetail = AttendanceDocumentSummary & {
  content?: string | null;
  fileUrl?: string | null;
  updatedAt: string;
};
