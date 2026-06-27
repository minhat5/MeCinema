---
name: Bug Report
about: Tạo báo cáo lỗi để giúp MeCinema hoàn thiện hơn
title: "[RES_005] - Tiêu đề lỗi ngắn gọn"
labels: bug
assignees: 'An Thái'
---

**Mô tả lỗi (Summary)**
Khi đăng ký tài khoản với số điện thoại chứa ký tự không phải số, hệ thống vẫn cho phép đăng ký thành công và chuyển sang trang home

**Các bước tái hiện (Steps to reproduce)**
1. Tới trang http://localhost:5173/register
2. Nhập đầy đủ thông tin bao gồm Email = test1@example.com, Mật khẩu = 123456, Xác nhận mật khẩu = 123456, Họ tên = Tester, Số điện thoại = abcxyz
3. Click Đăng ký
4. Thấy lỗi xảy ra

**Kết quả mong đợi (Expected result)**
Không cho đăng ký và hiển thị thông báo thất bại do Số điện thoại không được có ký tự khác số

**Kết quả thực tế (Actual result)**
Vẫn đăng ký thành công và tạo tài khoản mới và tự động đăng nhập và chuyển sang trang home

**Ảnh chụp màn hình (Screenshots)**
<img width="393" height="551" alt="image" src="https://github.com/user-attachments/assets/e40d9378-4b21-4033-a0e4-590dfeea7e80" />

**Môi trường kiểm thử (Environment):**
 - Hệ điều hành (OS): Windows 11
 - Trình duyệt (Browser): Chrome, Safari
