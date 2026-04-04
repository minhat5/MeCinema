# ĐỒ ÁN KẾT THÚC MÔN - LẬP TRÌNH TIÊN TIẾN

## Thông tin chung

- Đề tài: **MeCinema - Hệ thống đặt vé rạp phim trực tuyến**
- Môn học: **Lập trình tiên tiến**
- Công nghệ sử dụng: backend Spring Boot + frontend React/Vite
- Sinh viên thực hiện:

| Họ và tên  | MSSV |
| ------------- | ------------- |
| Nguyễn Nhật Minh | 23110265 |
| Bùi Thành Tâm | 23110310 |
| Mai Hồng Tín | 23110342 |

---

## Mục lục

1. Mở đầu
2. Phân tích yêu cầu
3. Thiết kế hệ thống
4. Cài đặt và triển khai
5. Kiểm thử và đánh giá
6. Kết luận và hướng phát triển
7. Phụ lục UML
---

## 1. Mở đầu

### 1.1. Lý do chọn đề tài
  Cùng với sự phát triển của công nghệ, nhu cầu giải trí bằng điện ảnh của người dân ngày càng tăng cao. Tuy nhiên, nhiều rạp chiếu phim hiện nay vẫn còn tồn tại hạn chế trong việc quản lý, bán vé thủ công dẫn đến tình trạng khách hàng phải xếp hàng, khó chọn ghế và dễ sai sót khi thanh toán. Xuất phát từ thực tế đó, nhóm quyết định xây dựng website đặt vé xem phim MeCinema nhằm cung cấp một nền tảng trực tuyến hiện đại, thân thiện, giúp tối ưu hóa quy trình vận hành của rạp và nâng cao trải nghiệm người dùng.

### 1.2. Mục tiêu đề tài
- **Về mặt nghiệp vụ:** Tin học hóa toàn bộ quy trình hoạt động của rạp (quản lý phim, lịch chiếu, phòng chiếu). Giúp khách hàng tra cứu, đặt vé và mua F&B (bắp nước) dễ dàng, nhanh chóng. Cung cấp công cụ thống kê doanh thu hiệu quả cho quản trị viên.
- **Về mặt kỹ thuật:** Xây dựng hệ thống hoạt động ổn định với giao diện thân thiện, tương thích nhiều thiết bị. Áp dụng các kỹ thuật lập trình hiện đại: RESTful API, JWT, Role-based access control, kiến trúc Client-Server tách biệt. Vận dụng trọn vẹn quy trình phân tích, thiết kế (UML) và cài đặt hệ thống.

### 1.3. Đối tượng và Phạm vi đề tài
- **Đối tượng sử dụng:** Khách hàng (người xem phim), Quản trị viên (Admin) và Nhân viên vận hành rạp.
- **Phạm vi triển khai:** Hệ thống được xây dựng dưới dạng website. Tập trung vào các chức năng cốt lõi: Quản lý phim, suất chiếu, phòng/ghế, F&B, đặt vé trực tuyến và thống kê doanh thu. Không bao gồm các tính năng nâng cao như AI gợi ý phim hay tích hợp mạng xã hội phức tạp.

---

## 2. Phân tích yêu cầu

### 2.1. Bài toán nghiệp vụ
Hệ thống xử lý vòng đời đặt vé trực tuyến khép kín bao gồm các bước:
1. Khách hàng tra cứu thông tin phim và lịch chiếu.
2. Đăng nhập hệ thống để tiến hành đặt vé.
3. Lựa chọn suất chiếu và chọn ghế trống trực quan trên sơ đồ.
4. Lựa chọn mua thêm các sản phẩm đồ ăn/thức uống (F&B).
5. Thực hiện thanh toán trực tuyến qua cổng liên kết (VNPAY/Momo/SePay).
6. Hệ thống ghi nhận, cập nhật trạng thái đơn hàng và lưu vào lịch sử giao dịch.

### 2.2. Tác nhân hệ thống
Hệ thống được chia làm 3 nhóm tác nhân chính:
- **Khách vãng lai (Guest):** Người truy cập chưa đăng nhập, sử dụng các tính năng tra cứu cơ bản.
- **Khách hàng (Customer):** Người dùng đã có tài khoản, thực hiện các giao dịch đặt vé và quản lý cá nhân.
- **Quản trị viên (Admin):** Người quản lý, thiết lập dữ liệu hệ thống và theo dõi tình hình kinh doanh.

### 2.3. Yêu cầu chức năng
- **Đối với Khách vãng lai:** Xem và tìm kiếm phim, xem lịch chiếu, đăng ký và đăng nhập tài khoản.
- **Đối với Khách hàng:** Quản lý hồ sơ cá nhân, xem lịch sử đặt vé, đặt vé trực tuyến (chọn ghế, chọn F&B, thanh toán).
- **Đối với Quản trị viên:** Quản lý tài khoản (User), phim, thể loại, cụm rạp, phòng chiếu, sơ đồ ghế, danh mục đồ ăn thức uống, lên lịch chiếu và thống kê doanh thu.

### 2.4. Yêu cầu phi chức năng
- **Tính tiện dụng:** Giao diện trực quan, quy trình đặt vé được tối ưu hoàn thành trong tối đa 3 bước.
- **Tính bảo mật:** Dữ liệu nhạy cảm được mã hóa, bảo mật qua JWT và phân quyền theo Role. Tuân thủ các tiêu chuẩn an toàn khi giao dịch thanh toán trực tuyến.
- **Kiến trúc phần mềm:** Mã nguồn thiết kế theo kiến trúc phân lớp (layered architecture), API chuẩn RESTful dễ dàng tích hợp và mở rộng.

---

## 3. Thiết kế hệ thống

### 3.1. Kiến trúc tổng thể

Hệ thống gồm 2 thành phần:

- **Frontend (`client/`)**: React + TypeScript + Vite, quản lý route, gọi REST API.
- **Backend (`src/main/java/...`)**: Spring Boot, xử lý nghiệp vụ, bảo mật, truy cập CSDL.

Mặc định frontend kết nối đến:

- `http://localhost:5000/mecinema/api`

### 3.2. Thiết kế backend

- `controller`: tiếp nhận và trả về API.
- `service`: xử lý nghiệp vụ đặt vé, thanh toán, quản trị.
- `repo`: truy vấn CSDL qua JPA.
- `security`: `WebSecurityConfig`, JWT filter, current user resolver.
- `config`: properties, exception handler, scheduling.

### 3.3. Thiết kế frontend

- `features/`: chia theo domain (auth, booking, movies, admin, user).
- `components/`: dùng lại UI/layout.
- `lib/`: cấu hình API client và query.
- `App.tsx`: định nghĩa route user/admin.

### 3.4. Thiết kế bảo mật

Theo `WebSecurityConfig`:

- **Public**: auth, movie, foods public, callback thanh toán, một số GET showtimes/seat-map.
- **Authenticated**: user profile, booking.
- **Admin**: nhóm API quản trị.

### 3.5. Công nghệ sử dụng

- Backend: Java 25, Spring Boot 4.0.4, Security, JPA, MySQL, OAuth2, JWT.
- Frontend: React 19, TypeScript, React Router, TanStack Query, Mantine, Axios.

---

## 4. Cài đặt và triển khai

### 4.1. Yêu cầu môi trường

- Java 25
- Node.js LTS (khuyến nghị 20+)
- MySQL 8+

### 4.2. Cấu hình backend

File: `src/main/resources/application.properties`

- `server.port=5000`
- `server.servlet.context-path=/mecinema`
- datasource MySQL `cinema_booking_db`
- Query create database `create_database.sql`

### 4.3. Cấu hình frontend

Tạo `client/.env`:

```env
VITE_API_URL=http://localhost:5000/mecinema/api
```

### 4.4. Lệnh chạy hệ thống
**Backend**

```powershell
cd D:\NNLTTT\FinalProject\MeCinema
.\mvnw.cmd spring-boot:run
```
**Frontend**

```powershell
cd D:\NNLTTT\FinalProject\MeCinema\client
npm install
npm run dev
```

---

## 5. Kiểm thử và đánh giá

### 5.1. Kết quả đạt được

- Hoàn thành hệ thống đặt vé theo kiến trúc fullstack.
- Có luồng đăng nhập/phân quyền người dùng và admin.
- Có luồng booking + theo dõi kết quả + callback thanh toán.
- Có bộ UML phục vụ báo cáo phân tích/thiết kế.

### 5.2. Hạn chế

- Chưa tách hết secret khỏi source code.
- Chưa trình bày rõ bộ test case và chỉ số hiệu năng.
- Cần mở rộng kiểm thử tích hợp/E2E.

---

## 6. Kết luận và hướng phát triển

### 6.1. Kết luận

Đề tài MeCinema đạt mục tiêu môn học ở các mặt: phân tích bài toán, thiết kế kiến trúc, cài đặt hệ thống, và triển khai chức năng nghiệp vụ cốt lõi.

### 6.2. Hướng phát triển

- Tách secret sang biến môi trường + profile dev/staging/prod.
- Bổ sung monitoring, logging, dashboard thống kê.
- Nâng cấp bộ kiểm thử (unit/integration/e2e).
- Docker hóa và tích hợp CI/CD.

---

## 7. Phụ lục UML

### 7.1. Use Case

- File: `uml/UseCase.puml`
- Tóm tắt: mô tả toàn cảnh tác nhân (User/Admin) và các nhóm chức năng lớn: xác thực, xem phim, đặt vé, thanh toán, quản trị.

### 7.2. Activity diagrams

Nhóm activity được tách theo use case chính, đại diện bởi:

- `uml/activity/activity-auth.puml`: luồng đăng ký/đăng nhập.
- `uml/activity/activity-book-ticket.puml`: luồng tạo booking.
- `uml/activity/activity-select-seat.puml`: luồng chọn ghế.
- `uml/activity/activity-payment.puml`: luồng thanh toán/cập nhật trạng thái.
- `uml/activity/activity-manage-movies.puml`: luồng CRUD phim (admin).
- `uml/activity/activity-manage-showtimes.puml`: luồng quản lý suất chiếu.
- `uml/activity/activity-view-history.puml`: luồng xem lịch sử đặt vé.

### 7.3. Sequence diagrams

Nhóm sequence tương ứng theo từng nghiệp vụ, đại diện bởi:

- `uml/sequence/sequence-auth.puml`: Actor -> UI -> Auth API -> service/repository.
- `uml/sequence/sequence-book-ticket.puml`: User -> Booking API -> xử lý nghiệp vụ -> lưu booking.
- `uml/sequence/sequence-payment.puml`: User -> Payment API -> SePay -> callback -> cập nhật đơn.
- `uml/sequence/sequence-manage-movies.puml`: Admin -> Admin API -> service -> repository.
- `uml/sequence/sequence-view-showtimes.puml`: User -> Movie/Showtime API -> trả về danh sách suất.


### 7.4. Liên hệ UML với mã nguồn

- Controller layer: `src/main/java/com/mecinema/mecinema/controller/`
- Security và phân quyền: `src/main/java/com/mecinema/mecinema/security/WebSecurityConfig.java`
- Route frontend: `client/src/App.tsx`, `client/src/features/admin/routes.tsx`

---

## 8. Tài liệu tham chiếu kỹ thuật

- `pom.xml`
- `client/package.json`
- `src/main/resources/application.properties`
- `src/main/java/com/mecinema/mecinema/security/WebSecurityConfig.java`
- `src/main/java/com/mecinema/mecinema/controller/`
- `client/src/lib/api-client.ts`
- `uml/`


