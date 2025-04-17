// api/chat.ts
import api from '../api/axiosInstance';

/**
 * 채팅 메시지를 서버에 전송하고 응답을 받아오는 함수
 * @param lectureId 강의 ID
 * @param query 사용자 질문/메시지
 * @returns 서버 응답 데이터
 */
export const postChat = async (
  lectureId: string,
  query: string,
  language: string,
  tone: string
) => {
  try {
    // 디버깅을 위해 더 명확한 로그 추가
    console.log('postChat 호출:', {
      lectureId,
      query,
      language,
      tone
    });

    const response = await api.post('/chat', {
      lecture_id: lectureId,
      query: query,
      language: language,
      voice_style: tone
    });

    return response.data;
  } catch (error) {
    console.error('채팅 API 호출 오류:', error);
    throw error;
  }
};
