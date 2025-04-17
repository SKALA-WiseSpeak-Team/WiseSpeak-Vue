// index.js (ESM 스타일)
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import OpenAI from 'openai';

dotenv.config();

const app = express();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 지원되는 파일 형식 정의
const SUPPORTED_AUDIO_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

// 파일 필터 함수 추가
const fileFilter = (req, file, cb) => {
  // 원본 파일 이름에서 확장자 추출
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  // 지원되는 형식인지 확인
  if (SUPPORTED_AUDIO_FORMATS.includes(ext)) {
    cb(null, true); // 허용
  } else {
    cb(new Error(`지원되지 않는 파일 형식입니다. 지원되는 형식: ${SUPPORTED_AUDIO_FORMATS.join(', ')}`), false);
  }
};

// multer 설정에 fileFilter 추가
const upload = multer({ 
  dest: 'uploads/', 
  fileFilter: fileFilter
});

app.use(cors());
app.use(express.json());

app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  try {
    // 파일이 없는 경우 체크
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았거나 지원되지 않는 형식입니다.' });
    }

    const filePath = req.file.path;
    console.log(`파일 업로드 중: ${req.file.originalname}, 경로: ${filePath}`);
    
    // 파일 확장자 변경 (webm -> mp3로 변환)
    const newFilePath = filePath + '.mp3';
    fs.renameSync(filePath, newFilePath);
    
    try {
      // 새로운 OpenAI SDK를 사용한 요청 방식
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(newFilePath),
        model: "whisper-1",
        response_format: "json"
      });

      console.log("변환 완료, 전체 응답:", transcription);
      console.log("변환된 텍스트:", transcription.text?.substring(0, 50) + "...");

      // 응답이 유효한지 확인
      if (!transcription || typeof transcription.text !== 'string') {
        throw new Error('OpenAI에서 유효한 텍스트 응답을 받지 못했습니다.');
      }

      // 결과 반환 - 명확한 형식으로
      res.json({ 
        success: true,
        text: transcription.text 
      });
    } finally {
      // 처리 완료 후 파일 삭제 (성공/실패 여부와 상관없이)
      if (fs.existsSync(newFilePath)) {
        fs.unlinkSync(newFilePath);
      }
    }
  } catch (err) {
    console.error('음성 변환 API 에러:', err.message);
    console.error('상세 에러:', err);
    
    // 에러 응답 개선
    let errorMessage = '음성 변환 처리 중 오류가 발생했습니다';
    let statusCode = 500;
    
    if (err.status === 400) {
      errorMessage = '지원되지 않는 파일 형식입니다';
      statusCode = 400;
    } else if (err.error?.message) {
      errorMessage = err.error.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(statusCode).json({ error: errorMessage });
    
    // 파일이 존재하면 삭제
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Proxy server on http://localhost:${PORT}`));