import api from '../api/axiosInstance';

interface LectureResponse {
  id: string;
  title: string;
  description: string;
  created_at: string; // ISO date string, e.g., "2025-04-16T08:07:16.483Z"
  pdf_url: string;
  voice_url: string;
}

interface GetLectureParams {
  id: string;
  voice_style?: string;
  language?: string;
}

const getLecture = async (
  params: GetLectureParams
): Promise<LectureResponse> => {
  const { id, voice_style, language } = params;

  try {
    const response = await api.get<LectureResponse>(`/course/${id}`, {
      params: {
        voice_style,
        language
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching lecture:', error);
    throw error;
  }
};

export default getLecture;
