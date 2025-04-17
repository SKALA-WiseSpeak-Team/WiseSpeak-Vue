import api from '../api/axiosInstance';

interface PostLectureResponse {
  lectureId: string;
}

interface PostLectureParams {
  file: File;
  title: string;
  description?: string;
}

export const postLectures = async (
  params: PostLectureParams
): Promise<PostLectureResponse> => {
  const { file, title, description } = params;

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  if (description) {
    formData.append('description', description);
  }

  try {
    const response = await api.post<PostLectureResponse>(
      '/lectures',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error posting lecture:', error);
    throw error;
  }
};
