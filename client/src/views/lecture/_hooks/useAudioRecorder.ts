// src/composables/useAudioRecorder.ts
import { ref } from 'vue';
import { postChat } from '../../../services/postChat';

export function useAudioRecorder(
  lectureId: string,
  language: string,
  tone: string,
  onTranscribeComplete: (text: string, response: any) => void
) {
  const isRecording = ref(false);
  const isProcessing = ref(false);
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm' };
      mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        isProcessing.value = true;

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const file = new File([audioBlob], 'recording.webm', {
          type: 'audio/webm'
        });
        audioChunks = [];

        try {
          // 1. 음성을 텍스트로 변환
          const transcribedText = await transcribeAudio(file);
          console.log('STT 결과:', transcribedText);

          if (transcribedText) {
            // 2. 변환된 텍스트로 채팅 API 호출
            const chatResponse = await postChat(
              lectureId,
              transcribedText,
              language,
              tone
            );

            // 3. 결과 전달
            onTranscribeComplete(transcribedText, chatResponse);
          }
        } catch (error) {
          console.error('음성 처리 오류:', error);
        } finally {
          isProcessing.value = false;
        }
      };

      audioChunks = [];
      mediaRecorder.start(1000);
      isRecording.value = true;
    } catch (err) {
      console.error('녹음을 시작할 수 없습니다:', err);
      alert('마이크 접근 권한을 허용해주세요.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      isRecording.value = false;
    }
  };

  const toggleRecording = async (e?: Event) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (isRecording.value) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  return {
    isRecording,
    isProcessing,
    toggleRecording
  };
}

// 음성을 텍스트로 변환하는 함수
async function transcribeAudio(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('음성 파일 전송 시작...');
    const response = await fetch('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('STT 서버 오류:', errorData);
      throw new Error(errorData.error || 'STT 서버 오류');
    }

    const data = await response.json();
    console.log('서버 응답 데이터:', data);

    if (data && typeof data.text === 'string') {
      return data.text;
    } else {
      console.error('STT 응답 형식 오류:', data);
      throw new Error('STT 응답 데이터 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('STT 요청 중 오류 발생:', error);
    throw error;
  }
}
