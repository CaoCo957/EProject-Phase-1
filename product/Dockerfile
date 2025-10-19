# Sử dụng base image Node.js 18
FROM node:18-slim

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app/order

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép code của service vào
COPY . .

# Mở cổng 3000 cho API Gateway
EXPOSE 3002

# Lệnh chạy service
CMD [ "node", "index.js" ]