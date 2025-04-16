import api from '../api/axiosInstance';

export interface Lecture {
  id: string;
  title: string;
  description: string;
  created_at: string;
  total_pages: number;
  thumbnail_url: string;
}

export interface GetLecturesResponse {
  data: Lecture[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetLecturesParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const getLectures = async (): Promise<GetLecturesResponse> => {
  const response = await api.get<GetLecturesResponse>('/lectures');
  console.log(response.data);
  return response.data;
};
