export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type ApiErrorResponse = {
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
  requestId?: string;
  timestamp: string;
  fieldErrors?: Record<string, string>;
};
