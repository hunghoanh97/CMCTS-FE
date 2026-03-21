# CMCTS Game Hub - Frontend

Giao diện người dùng cho dự án CMCTS Game Hub (Nền tảng Gamification nội bộ).

## 🚀 Công nghệ sử dụng
- **Thư viện chính:** React 18
- **Ngôn ngữ:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Routing:** React Router DOM
- **HTTP Client:** Axios

## 📋 Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS >= 18)
- npm hoặc pnpm

## ⚙️ Hướng dẫn cài đặt và chạy Local

### 1. Cài đặt Dependencies
Di chuyển vào thư mục Frontend và chạy lệnh:
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` (nếu chưa có) và trỏ API về Backend:
```env
VITE_API_URL=http://localhost:5284/api
```
*(Nếu không có, hệ thống sẽ gọi mặc định vào `http://localhost:5284/api` theo cấu hình `src/utils/api.ts`)*

### 3. Chạy ứng dụng
```bash
npm run dev
```
Trang web sẽ chạy tại: `http://localhost:5173`

## 🐳 Triển khai với Docker
Dự án có thể chạy qua Docker với multi-stage build sử dụng Nginx để phục vụ static files:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
Build và chạy:
```bash
docker build -t cmcts-fe .
docker run -p 8080:80 cmcts-fe
```

## 🔗 Kết nối với Backend
- Frontend gọi các endpoint API của Backend thông qua `axios` instance được định nghĩa tại `src/utils/api.ts`.
- Đảm bảo Backend đang chạy và CORS được cấu hình chính xác trước khi thực hiện các chức năng như Đăng nhập, Submit Quiz.

## 🔄 CI/CD
Dự án có thể dễ dàng deploy lên **Vercel**, **Netlify** hoặc sử dụng **GitHub Actions**.

Ví dụ GitHub Actions build & deploy:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      # Thêm các bước deploy thực tế ở đây (ví dụ: rsync tới server, Vercel CLI, S3...)
```