# EProject Phase 1 - Hệ thống Microservices Bán hàng Đơn giản

Dự án này mô phỏng một hệ thống thương mại điện tử nhỏ sử dụng kiến trúc microservices.

## 1. Vấn đề giải quyết

Cung cấp API để quản lý người dùng, sản phẩm và đặt hàng trong một ứng dụng bán hàng.

## 2. Kiến trúc Hệ thống

Hệ thống bao gồm các dịch vụ (services) sau:

* API Gateway (`api-gateway`):
  * Ý nghĩa: Là điểm vào duy nhất cho tất cả các request từ client. Nó điều hướng request đến các service phù hợp bên dưới.
  * Cổng (Port): 3003
* Auth Service (`auth`):
  * Ý nghĩa: Quản lý việc đăng ký, đăng nhập và xác thực người dùng bằng JWT token.
  * Cổng (Port): 3000
  * Database: MongoDB (lưu thông tin user)
* Product Service (`product`):
  * Ý nghĩa: Quản lý thông tin sản phẩm (tạo mới, lấy danh sách, lấy chi tiết) và xử lý yêu cầu đặt hàng ban đầu.
  * Cổng (Port): 3001
  * Database: MongoDB (lưu thông tin sản phẩm)
  * Giao tiếp: Gửi thông điệp đặt hàng đến RabbitMQ. Nhận thông điệp hoàn thành đơn hàng từ RabbitMQ.
* Order Service (`order`):
  * Ý nghĩa: Nhận yêu cầu đặt hàng từ RabbitMQ, xử lý logic đơn hàng (tính tổng tiền,...) và lưu thông tin đơn hàng. Gửi thông điệp xác nhận hoàn thành về cho Product Service qua RabbitMQ.
  * Cổng (Port): 3002
  * Database: MongoDB (lưu thông tin đơn hàng)
  * Giao tiếp: Nhận thông điệp đặt hàng từ RabbitMQ. Gửi thông điệp hoàn thành đơn hàng đến RabbitMQ.

### Sơ đồ kiến trúc

## 3. Giao tiếp giữa các Dịch vụ

* Client giao tiếp với hệ thống thông qua API Gateway.
* API Gateway sử dụng HTTP Proxy để chuyển tiếp request đến các service `auth`, `product`, `order`.
* Product Service và Order Service giao tiếp bất đồng bộ (asynchronously) qua hàng đợi tin nhắn RabbitMQ để xử lý đơn hàng.
  1. Khi người dùng gọi API đặt hàng (`/products/buy`), Product Service gửi thông tin đơn hàng (sản phẩm, user) vào queue `orders` trên RabbitMQ.
  2. Order Service lắng nghe queue `orders`, nhận thông tin, tạo đơn hàng trong database của nó, sau đó gửi thông điệp xác nhận (chứa thông tin đơn hàng hoàn chỉnh) vào queue `products` trên RabbitMQ.
  3. Product Service lắng nghe queue `products`, nhận thông tin đơn hàng hoàn chỉnh và trả về cho người dùng.

## 4. Cách chạy dự án với Docker

1. Cài đặt Docker Desktop.
2. Clone repository này về máy.
3. Tạo file `.env` ở thư mục gốc và đặt biến `JWT_SECRET=your_secret_key`.
4. Mở Terminal tại thư mục gốc và chạy lệnh: `docker compose up --build -d`
5. Truy cập API Gateway tại `http://localhost:3003`.

## 5. Các mẫu thiết kế
