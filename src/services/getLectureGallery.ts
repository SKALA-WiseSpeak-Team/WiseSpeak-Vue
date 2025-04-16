import api from '../api/axiosInstance';

export const getLectureGallery = async () => {
  try {
    const response = await api.get(`/lectures`);
    console.log(response);

    return response.data;
  } catch (error) {
    console.error('Error fetching lecture gallery:', error);
    throw error;
  }
};
