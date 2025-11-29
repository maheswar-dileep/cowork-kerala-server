export interface IUploadedFile {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  originalName?: string;
}

export interface ISingleUploadResponse {
  success: boolean;
  message: string;
  data: IUploadedFile;
}

export interface IMultipleUploadResponse {
  success: boolean;
  message: string;
  data: IUploadedFile[];
}

export interface IDeleteFileRequest {
  key: string;
}

export interface IDeleteMultipleFilesRequest {
  keys: string[];
}

export enum UploadFolder {
  SPACES = 'spaces',
  LEADS = 'leads',
  USERS = 'users',
  DOCUMENTS = 'documents',
  GENERAL = 'uploads',
}
