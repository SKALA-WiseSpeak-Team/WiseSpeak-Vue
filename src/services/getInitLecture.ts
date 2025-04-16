interface VoiceSettings {
  tone: string;
  language: string;
}

interface LectureData {
  pdfUrl: string;
  audioUrls: string[];
  metadata: {
    title: string;
    description: string;
    pages: number;
    duration: string;
    // 기타 메타데이터
  };
}

export async function initializeLecture(
  lectureId: string,
  settings: VoiceSettings
): Promise<LectureData> {
  try {
    // 로딩 시간을 6초로 늘려서 로딩 상태를 더 오래 볼 수 있도록 설정
    console.log('강의 초기화 시작:', lectureId, '설정:', settings);
    await new Promise(resolve => setTimeout(resolve, 6000));
    console.log('강의 초기화 완료');

    // 가끔 랜덤하게 오류 발생시키기 (테스트 용도)
    if (Math.random() < 0.2) {
      // 20% 확률로 오류 발생
      throw new Error(
        '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
      );
    }

    // 목업 데이터 반환 - 강의 ID에 따라 다른 데이터 반환
    const mockData: { [key: string]: LectureData } = {
      '1': {
        pdfUrl: 'https://example.com/lectures/ancient-rome.pdf',
        audioUrls: Array.from(
          { length: 10 },
          (_, i) => `https://example.com/lectures/ancient-rome/page${i + 1}.mp3`
        ),
        metadata: {
          title: '고대 로마 건축의 비밀',
          description: '고대 로마의 건축 기술과 공학적 경이로움을 탐구합니다',
          pages: 10,
          duration: '2시간 30분'
        }
      },
      '2': {
        pdfUrl: 'https://example.com/lectures/physics.pdf',
        audioUrls: Array.from(
          { length: 15 },
          (_, i) => `https://example.com/lectures/physics/page${i + 1}.mp3`
        ),
        metadata: {
          title: '현대 물리학의 이해',
          description: '양자역학과 상대성 이론의 이해',
          pages: 15,
          duration: '3시간 15분'
        }
      },
      '3': {
        pdfUrl: 'https://example.com/lectures/philosophy.pdf',
        audioUrls: Array.from(
          { length: 12 },
          (_, i) => `https://example.com/lectures/philosophy/page${i + 1}.mp3`
        ),
        metadata: {
          title: '철학의 기초',
          description: '기본적인 철학 개념과 사상가들',
          pages: 12,
          duration: '1시간 45분'
        }
      }
    };

    // lectureId에 해당하는 데이터가 있으면 반환, 없으면 기본 데이터 반환
    return (
      mockData[lectureId] || {
        pdfUrl: 'https://example.com/lectures/sample.pdf',
        audioUrls: Array.from(
          { length: 5 },
          (_, i) => `https://example.com/lectures/sample/page${i + 1}.mp3`
        ),
        metadata: {
          title: '샘플 강의',
          description: '이것은 샘플 강의입니다',
          pages: 5,
          duration: '45분'
        }
      }
    );
  } catch (error) {
    console.error('강의 초기화 중 오류 발생:', error);
    // 오류 발생 시 5초 기다린 후 오류 처리 (로딩 화면이 더 오래 표시되도록)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 에러 객체에서 메시지 추출
    const errorMessage =
      error instanceof Error
        ? error.message
        : '강의를 불러오는 데 실패했습니다. 다시 시도해주세요.';

    throw new Error(errorMessage);
  }
}
