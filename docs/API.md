# MeCinema API Documentation

Tài liệu này được tổng hợp từ các controller trong project Spring Boot.

- Base URL local: `http://localhost:5000/mecinema`
- API prefix: `/api`
- Frontend mặc định gọi: `http://localhost:5000/mecinema/api`
- Content-Type: `application/json`

## Xác thực và phân quyền

Backend dùng JWT qua `JwtAuthFilter`.

Header thường dùng:

```http
Authorization: Bearer <jwt_token>
```

`POST /api/auth/login` hiện trả token trong cookie HTTP-only tên `AUTH_TOKEN`; `GET /api/auth/me` lại yêu cầu header `Authorization: Bearer ...`.

Theo `WebSecurityConfig`:

| Nhóm | Quyền |
| --- | --- |
| `/api/auth/**` | Public |
| `/api/movie/**` | Public |
| `/api/public/foods/**` | Public |
| `GET /api/showtimes/**` | Public |
| `GET /api/rooms/*/seat-map` | Public |
| `/api/payments/callback` | Public |
| `/api/user/**` | Authenticated |
| `/api/bookings/**` | Authenticated |
| `/api/admin/**`, `/api/users/**`, `/api/foods/**`, `/api/movies/**`, `/api/genres/**`, `/api/cinemas/**`, `/api/rooms/**` | ADMIN |

Lưu ý: `RoomController` có `GET /api/rooms` và `GET /api/rooms/{id}` không gắn `@PreAuthorize`, nhưng security config đang match `/api/rooms/**` là ADMIN, ngoại trừ `GET /api/rooms/{roomId}/seat-map`.

## Response Wrapper

Một số endpoint trả trực tiếp entity hoặc `Page<T>`. Một số endpoint trả wrapper:

```json
{
  "statusCode": 200,
  "message": "OK",
  "data": {},
  "timestamp": "2026-06-29 16:30:00"
}
```

Endpoint cinema dùng wrapper riêng:

```json
{
  "success": true,
  "message": "Cinema retrieved successfully",
  "data": {},
  "statusCode": 200
}
```

## Enum

| Enum | Values |
| --- | --- |
| `RoleUser` | `CUSTOMER`, `ADMIN` |
| `MovieStatus` | `UPCOMING`, `RELEASED`, `ENDED` |
| `FoodType` | `FOOD`, `DRINK`, `COMBO` |
| `SeatType` | `NORMAL`, `VIP`, `SWEETBOX` |
| `SeatAvailabilityStatus` | `AVAILABLE`, `HELD`, `BOOKED` |
| `PaymentMethod` | `SEPAY`, `MOMO` |
| `Status` | `PENDING`, `SUCCESS`, `FAILED`, `CANCELED` |

## Auth

Base path: `/api/auth`

| Method | Path | Auth | Mô tả |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Đăng ký tài khoản customer |
| `POST` | `/login` | Public | Đăng nhập, set cookie `AUTH_TOKEN` |
| `GET` | `/me` | Bearer token | Lấy thông tin user theo token |

### Register Request

```json
{
  "email": "user@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "fullName": "Nguyen Van A",
  "phone": "0900000000"
}
```

Response: `200 OK` không có body.

### Login Request

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response: `200 OK`, header `Set-Cookie: AUTH_TOKEN=...`.

## User

Base path: `/api/user`

| Method | Path | Auth | Mô tả |
| --- | --- | --- | --- |
| `GET` | `/me` | Authenticated | Lấy profile hiện tại |
| `PUT` | `/{id}` | Authenticated | Cập nhật profile |

### Update User Request

```json
{
  "fullName": "Nguyen Van A",
  "phone": "0900000000"
}
```

## Public Movies

Base path: `/api/movie`

| Method | Path | Auth | Query | Mô tả |
| --- | --- | --- | --- | --- |
| `GET` | `` | Public | `page=0`, `size=10` | Danh sách phim đang khả dụng |
| `GET` | `/{id}` | Public |  | Chi tiết phim |
| `GET` | `/search` | Public | `q`, `page=0`, `size=10` | Tìm phim khả dụng |

## Public Cinemas

Base path: `/api/movie/cinemas`

| Method | Path | Auth | Query | Mô tả |
| --- | --- | --- | --- | --- |
| `GET` | `` | Public | `page=0`, `size=10` | Danh sách cụm rạp |
| `GET` | `/{id}` | Public |  | Chi tiết cụm rạp |
| `GET` | `/search` | Public | `q`, `page=0`, `size=10` | Tìm cụm rạp |

## Public Foods

Base path: `/api/public/foods`

| Method | Path | Auth | Query | Mô tả |
| --- | --- | --- | --- | --- |
| `GET` | `/available` | Public | `page=0`, `size=20` | Danh sách đồ ăn active |
| `GET` | `/search` | Public | `name?`, `type?`, `isActive=true`, `page=0`, `size=10` | Tìm đồ ăn |
| `GET` | `/by-type/{type}` | Public | `page=0`, `size=10` | Lọc theo `FOOD`, `DRINK`, `COMBO` |
| `GET` | `` | Public | `page=0`, `size=10`, `sortBy=id` | Danh sách đồ ăn |
| `GET` | `/{id}` | Public |  | Chi tiết đồ ăn |

Food DTO:

```json
{
  "id": 1,
  "name": "Combo 1",
  "description": "Popcorn and drink",
  "price": 99000,
  "imageUrl": "https://example.com/food.jpg",
  "type": "COMBO",
  "isActive": true,
  "createdAt": "2026-06-29 16:30:00",
  "updatedAt": "2026-06-29 16:30:00"
}
```

## Showtimes

Base path: `/api/showtimes`

`GET` endpoint public. `POST`, `PUT`, `DELETE` yêu cầu ADMIN.

| Method | Path | Auth | Query | Mô tả |
| --- | --- | --- | --- | --- |
| `GET` | `` | Public | `page=0`, `size=10`, `sortBy=startTime`, `sortDirection=asc`, `fromNow=false` | Danh sách suất chiếu |
| `GET` | `/{id}` | Public |  | Chi tiết suất chiếu |
| `GET` | `/movie/{movieId}` | Public |  | Suất chiếu theo phim |
| `GET` | `/room/{roomId}` | Public |  | Suất chiếu theo phòng |
| `GET` | `/cinema/{cinemaId}` | Public | `page=0`, `size=10`, `sortBy=startTime`, `sortDirection=asc` | Suất chiếu theo rạp |
| `GET` | `/upcoming` | Public | `page=0`, `size=10`, `sortBy=startTime`, `sortDirection=asc` | Suất chiếu sắp tới |
| `GET` | `/date/{date}` | Public |  | Suất chiếu theo ngày, `date` dạng `yyyy-MM-dd` |
| `POST` | `` | ADMIN |  | Tạo suất chiếu |
| `PUT` | `/{id}` | ADMIN |  | Cập nhật suất chiếu |
| `DELETE` | `/{id}` | ADMIN |  | Xóa suất chiếu |

### Create Showtime Request

```json
{
  "movieId": 1,
  "roomId": 2,
  "startTime": "2026-07-01 19:00:00",
  "endTime": "2026-07-01 21:00:00",
  "basePrice": 90000
}
```

### Update Showtime Request

```json
{
  "roomId": 2,
  "startTime": "2026-07-01 19:30:00",
  "endTime": "2026-07-01 21:30:00",
  "basePrice": 95000
}
```

## Seat Map

| Method | Path | Auth | Mô tả |
| --- | --- | --- | --- |
| `GET` | `/api/rooms/{roomId}/seat-map` | Public | Lấy sơ đồ ghế của phòng |

Response:

```json
{
  "roomId": 1,
  "roomName": "Room 1",
  "rowSymbols": ["A", "B"],
  "maxSeatNumberPerRow": 10,
  "seats": [
    {
      "id": 1,
      "rowSymbol": "A",
      "seatNumber": 1,
      "type": "NORMAL"
    }
  ],
  "stats": {
    "totalSeats": 20,
    "normalSeats": 10,
    "vipSeats": 8,
    "sweetboxSeats": 2
  }
}
```

## Bookings

Base path: `/api/bookings`

Yêu cầu authenticated user.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `/showtimes/{showtimeId}/seats` |  | Trạng thái ghế theo suất chiếu |
| `POST` | `` |  | Tạo booking |
| `GET` | `/{bookingId}` |  | Chi tiết booking của user hiện tại |
| `GET` | `/me` | `page=0`, `size=10` | Lịch sử booking của user hiện tại |
| `DELETE` | `/{bookingId}` |  | Hủy booking |

### Create Booking Request

```json
{
  "showtimeId": 1,
  "seatIds": [10, 11],
  "foods": [
    {
      "foodId": 1,
      "quantity": 2
    }
  ]
}
```

### Booking Response

```json
{
  "bookingId": 1,
  "bookingStatus": "PENDING",
  "totalPrice": 250000,
  "bookingTime": "2026-06-29T16:30:00",
  "showtime": {
    "showtimeId": 1,
    "movieTitle": "Movie title",
    "startTime": "2026-07-01T19:00:00",
    "endTime": "2026-07-01T21:00:00",
    "roomId": 2,
    "roomName": "Room 1",
    "cinemaId": 1,
    "cinemaName": "MeCinema",
    "cinemaAddress": "Address",
    "cinemaHotline": "1900xxxx"
  },
  "seats": [
    {
      "seatId": 10,
      "rowSymbol": "A",
      "seatNumber": 1,
      "seatType": "NORMAL",
      "price": 90000
    }
  ],
  "foods": [
    {
      "foodId": 1,
      "name": "Combo 1",
      "quantity": 2,
      "price": 35000
    }
  ],
  "payment": {
    "paymentId": 1,
    "method": "SEPAY",
    "status": "PENDING",
    "transactionNo": "MC123456"
  }
}
```

## Payments

| Method | Path | Auth | Query | Mô tả |
| --- | --- | --- | --- | --- |
| `POST` | `/api/bookings/{id}/payments` | Authenticated |  | Khởi tạo thanh toán cho booking |
| `GET` | `/api/bookings/{id}/payments/status` | Authenticated | `paymentId?` | Kiểm tra trạng thái thanh toán |
| `POST` | `/api/payments/callback` | Public webhook |  | Callback từ SePay |

### Init Payment Request

```json
{
  "method": "SEPAY",
  "regenerate": false
}
```

### Init Payment Response

```json
{
  "bookingId": 1,
  "paymentId": 1,
  "transactionNo": "MC123456",
  "method": "SEPAY",
  "status": "PENDING",
  "paymentUrl": "https://...",
  "expiresAt": "2026-06-29T09:35:00Z"
}
```

### Payment Callback Request

Header token được lấy từ `Authorization: Apikey <token>` hoặc `Authorization: Bearer <token>`.

```json
{
  "id": 123,
  "gateway": "SEPAY",
  "transactionDate": "2026-06-29 16:30:00",
  "accountNumber": "962470334128493",
  "subAccount": "",
  "amountIn": 250000,
  "amountOut": 0,
  "accumulated": 250000,
  "code": "MC123456",
  "transactionContent": "MC123456",
  "referenceCode": "REF123",
  "body": "transfer body",
  "amount_in": 250000,
  "amount_out": 0,
  "transferAmount": 250000,
  "transferType": "in"
}
```

## Admin - Users

Base path: `/api/users`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `page=0`, `size=10` | Danh sách user |
| `GET` | `/search` | `q`, `page=0`, `size=10` | Tìm user |
| `GET` | `/{id}` |  | Chi tiết user |
| `GET` | `/role/{role}` | `page=0`, `size=10` | Lọc user theo role |
| `POST` | `` |  | Tạo user |
| `PUT` | `/{id}` |  | Cập nhật user |
| `DELETE` | `/{id}` |  | Xóa user |

### Save User Request

```json
{
  "email": "admin@example.com",
  "fullName": "Admin User",
  "phone": "0900000001",
  "role": "ADMIN",
  "password": "123456"
}
```

## Admin - Movies

Base path: `/api/movies`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `page=0`, `size=10` | Danh sách phim |
| `GET` | `/search` | `q`, `page=0`, `size=10` | Tìm phim |
| `GET` | `/{id}` |  | Chi tiết phim |
| `POST` | `` |  | Tạo phim |
| `PUT` | `/{id}` |  | Cập nhật phim |
| `DELETE` | `/{id}` |  | Xóa phim |

### Movie Request

```json
{
  "title": "Movie title",
  "description": "Description",
  "durationMinutes": 120,
  "releaseDate": "2026-07-01",
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://example.com/trailer",
  "status": "RELEASED",
  "genres": ["Action", "Drama"]
}
```

## Admin - Genres

Base path: `/api/genres`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `page=0`, `size=10` | Danh sách thể loại |
| `GET` | `/search` | `q`, `page=0`, `size=10` | Tìm thể loại |
| `GET` | `/{id}` |  | Chi tiết thể loại |
| `POST` | `` |  | Tạo thể loại |
| `PUT` | `/{id}` |  | Cập nhật thể loại |
| `DELETE` | `/{id}` |  | Xóa thể loại |

### Genre Request

```json
{
  "name": "Action"
}
```

## Admin - Cinemas

Base path: `/api/cinemas`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `page=0`, `size=10` | Danh sách cụm rạp |
| `GET` | `/search` | `q`, `page=0`, `size=10` | Tìm cụm rạp |
| `GET` | `/{id}` |  | Chi tiết cụm rạp |
| `POST` | `` |  | Tạo cụm rạp |
| `PUT` | `/{id}` |  | Cập nhật cụm rạp |
| `DELETE` | `/{id}` |  | Xóa cụm rạp |

### Create Cinema Request

```json
{
  "name": "MeCinema Thu Duc",
  "address": "Thu Duc, Ho Chi Minh City",
  "hotline": "19001234"
}
```

### Update Cinema Request

```json
{
  "name": "MeCinema Thu Duc",
  "address": "New address",
  "hotline": "19001234"
}
```

## Admin - Foods

Base path: `/api/foods`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `page=0`, `size=10` | Danh sách đồ ăn |
| `GET` | `/search` | `name`, `type`, `isActive`, `page=0`, `size=10` | Tìm đồ ăn |
| `GET` | `/{id}` |  | Chi tiết đồ ăn |
| `POST` | `` |  | Tạo đồ ăn |
| `PUT` | `/{id}` |  | Cập nhật đồ ăn |
| `DELETE` | `/{id}` |  | Xóa đồ ăn |

### Food Request

```json
{
  "name": "Combo 1",
  "description": "Popcorn and drink",
  "price": 99000,
  "imageUrl": "https://example.com/food.jpg",
  "type": "COMBO",
  "isActive": true
}
```

## Admin - Rooms

Base path: `/api/rooms`

Yêu cầu ADMIN, trừ `/api/rooms/{roomId}/seat-map`.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `cinemaId?`, `page=0`, `limit=10` | Danh sách phòng |
| `GET` | `/{id}` |  | Chi tiết phòng |
| `POST` | `` |  | Tạo phòng |
| `PATCH` | `/{id}` |  | Cập nhật phòng |
| `DELETE` | `/{id}` |  | Xóa phòng |

### Create Room Request

```json
{
  "cinemaId": 1,
  "name": "Room 1"
}
```

### Update Room Request

```json
{
  "name": "Room 2"
}
```

## Admin - Seats

Base path: `/api/admin/seats`

Yêu cầu ADMIN.

| Method | Path | Query | Mô tả |
| --- | --- | --- | --- |
| `GET` | `` | `roomId`, `page=0`, `size=20` | Danh sách ghế theo phòng |
| `GET` | `/layout/{roomId}` |  | Sơ đồ ghế theo phòng |
| `GET` | `/{seatId}` |  | Chi tiết ghế |
| `POST` | `` |  | Tạo một ghế |
| `POST` | `/bulk` |  | Tạo nhiều ghế |
| `PATCH` | `/{seatId}` |  | Cập nhật loại ghế |
| `DELETE` | `/{seatId}` |  | Xóa ghế |
| `DELETE` | `/room/{roomId}` |  | Xóa toàn bộ ghế của phòng |

### Create Seat Request

```json
{
  "roomId": 1,
  "rowSymbol": "A",
  "seatNumber": 1,
  "type": "NORMAL"
}
```

### Bulk Create Seats Request

```json
{
  "roomId": 1,
  "rowSymbol": "A",
  "startSeatNumber": 1,
  "endSeatNumber": 10,
  "type": "NORMAL"
}
```

### Update Seat Request

```json
{
  "type": "VIP"
}
```

## Status Codes

| Code | Ý nghĩa |
| --- | --- |
| `200 OK` | Lấy/cập nhật/xóa thành công tùy endpoint |
| `201 Created` | Tạo booking, payment, showtime, room, seat thành công |
| `204 No Content` | Hủy booking thành công |
| `400 Bad Request` | Dữ liệu không hợp lệ hoặc lỗi nghiệp vụ |
| `401 Unauthorized` | Thiếu/sai token |
| `403 Forbidden` | Không đủ quyền |
| `404 Not Found` | Không tìm thấy dữ liệu |
| `409 Conflict` | Vi phạm ràng buộc dữ liệu |
| `500 Internal Server Error` | Lỗi hệ thống |

## cURL mẫu

Đăng ký:

```bash
curl -X POST "http://localhost:5000/mecinema/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456","confirmPassword":"123456","fullName":"Nguyen Van A","phone":"0900000000"}'
```

Lấy danh sách phim:

```bash
curl "http://localhost:5000/mecinema/api/movie?page=0&size=10"
```

Tạo booking:

```bash
curl -X POST "http://localhost:5000/mecinema/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"showtimeId":1,"seatIds":[10,11],"foods":[{"foodId":1,"quantity":2}]}'
```

Tạo phim bằng tài khoản admin:

```bash
curl -X POST "http://localhost:5000/mecinema/api/movies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -d '{"title":"Movie title","description":"Description","durationMinutes":120,"releaseDate":"2026-07-01","posterUrl":"https://example.com/poster.jpg","trailerUrl":"https://example.com/trailer","status":"RELEASED","genres":["Action"]}'
```
