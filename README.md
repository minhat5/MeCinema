# MeCinema Booking & Payment Module

## Prerequisites
- Java 21+ (project targets Java 25 in `pom.xml`)
- Maven 3.9+
- MySQL instance (default URL `jdbc:mysql://localhost:3306/cinema_booking_db`)

## Run locally
```powershell
cd D:\Ngon ngu lap trinh tien tien\DOAN\MeCinema
mvn spring-boot:run
```

## Run tests
```powershell
cd D:\Ngon ngu lap trinh tien tien\DOAN\MeCinema
mvn test
```

## Environment variables
- `payment.sepay.bank-id` – Tên hoặc ID ngân hàng thụ hưởng (VD: vietcombank, mb, vib)
- `payment.sepay.account-number` – Số tài khoản ngân hàng thụ hưởng
- `payment.sepay.template` – Cấu hình mẫu QR (VD: compact)
- `payment.sepay.webhook-secret` – Secret key hoặc token dùng để verify webhook từ SePay
- `payment.sepay.expiry-minutes` – Thời gian tối đa của giao dịch (mặc định 15)

## API headers
- Temporary header `X-User-Id` (numeric) is required on booking/payment endpoints until the security module is integrated.
