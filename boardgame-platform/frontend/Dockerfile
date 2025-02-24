# Node.js 18 이미지 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /frontend

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 프로젝트 파일 복사
COPY . .

# 5173 포트 개방 (Vite 기본 포트)
EXPOSE 5173

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
