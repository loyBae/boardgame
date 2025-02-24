# 베이스 이미지 설정 (Node.js 18 사용)
FROM node:20

# 작업 디렉토리 설정
WORKDIR /backend

# package.json과 package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# EXPOSE는 내부 포트 명시 (실제 포트 매핑은 docker-compose에서 처리)
EXPOSE 5000

# 서버 실행 (app.js 또는 server.js가 메인 파일)
CMD ["node", "app.js"]
