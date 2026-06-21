# BÁO CÁO KIỂM THỬ HỆ THỐNG MECINEMA

Báo cáo này chứa danh sách các kịch bản kiểm thử (Test Cases) chi tiết cho các chức năng cốt lõi của hệ thống đặt vé xem phim **MeCinema**:
1. **Tạo ghế hàng loạt (Seat Bulk Creation - `SEAT_BULK`)**
2. **Hủy Booking (Booking Cancellation - `BKG_CANCEL`)**
3. **Cập nhật phim (Movie Update - `MOV_UPDATE`)**
4. **Quản lý phim (Movie Management - `MOV_MGMT`)**
5. **Quản lý thể loại (Genre Management - `GENRE`)**
6. **Quản lý suất chiếu (Showtime Management - `SHOWTIME`)**
7. **Quản lý phòng chiếu (Room Management - `ROOM`)**

Tất cả các testcase dưới đây được thiết kế dựa trên cấu trúc mã nguồn thực tế của hệ thống (cả Backend Spring Boot và Frontend React) và tuân thủ theo biểu mẫu kiểm thử của khách hàng.

---

## MỤC LỤC
- [PHẦN I: PHÂN HỆ TẠO GHẾ HÀNG LOẠT (SEAT_BULK)](#phần-i-phân-hệ-tạo-ghế-hàng-loạt-seat_bulk) (11 Test Cases)
- [PHẦN II: PHÂN HỆ HỦY BOOKING (BKG_CANCEL)](#phần-ii-phân-hệ-hủy-booking-bkg_cancel) (10 Test Cases)
- [PHẦN III: PHÂN HỆ CẬP NHẬT PHIM (MOV_UPDATE)](#phần-iii-phân-hệ-cập-nật-phim-mov_update) (11 Test Cases)
- [PHẦN IV: PHÂN HỆ QUẢN LÝ PHIM (MOV_MGMT)](#phần-iv-phân-hệ-quản-lý-phim-mov_mgmt) (11 Test Cases)
- [PHẦN V: PHÂN HỆ QUẢN LÝ THỂ LOẠI (GENRE)](#phần-v-phân-hệ-quản-lý-thể-loại-genre) (10 Test Cases)
- [PHẦN VI: PHÂN HỆ QUẢN LÝ SUẤT CHIẾU (SHOWTIME)](#phần-vi-phân-hệ-quản-lý-suất-chiếu-showtime) (12 Test Cases)
- [PHẦN VII: PHÂN HỆ QUẢN LÝ PHÒNG CHIẾU (ROOM)](#phần-vii-phân-hệ-quản-lý-phòng-chiếu-room) (11 Test Cases)

---

## PHẦN I: PHÂN HỆ TẠO GHẾ HÀNG LOẠT (SEAT_BULK)

### SEAT_BULK_001: Tạo ghế hàng loạt thành công
| **Test Case ID** | **SEAT_BULK_001** | **Test Case Description** | **Kiểm tra chức năng tạo ghế hàng loạt thành công với dữ liệu hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản đăng nhập có quyền ADMIN. | 1 | Room ID: `1` (Phòng chiếu đang tồn tại trong hệ thống) |
| 2 | Người dùng đang ở trang quản lý ghế của phòng chiếu. | 2 | Ký tự hàng: `"A"` |
| 3 | Hàng ghế dự kiến tạo (`A1` đến `A10`) chưa tồn tại trong phòng chiếu đó. | 3 | Số ghế bắt đầu: `1`, Số ghế kết thúc: `10` |
| | | 4 | Loại ghế: `NORMAL` (Thường) |

#### Test Scenario: Kiểm tra tạo hàng loạt ghế Thường (A1 -> A10) cho phòng chiếu hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Truy cập vào trang quản lý ghế của Phòng chiếu số 1. | Danh sách ghế hiện tại hiển thị đầy đủ, không có lỗi. | Kết quả như mong đợi | Pass |
| 2 | Nhấp vào nút "Tạo nhiều ghế" (Bulk Create). | Form tạo ghế hàng loạt xuất hiện trên màn hình. | Kết quả như mong đợi | Pass |
| 3 | Điền đầy đủ thông tin:<br>- Ký tự hàng: "A"<br>- Ghế bắt đầu: 1<br>- Ghế kết thúc: 10<br>- Loại ghế: Thường | Dữ liệu được ghi nhận vào form mà không có lỗi kiểm thực. | Kết quả như mong đợi | Pass |
| 4 | Nhấp vào nút "Tạo ghế". | - API `/api/admin/seats/bulk` trả về mã `201 Created` kèm danh sách 10 ghế đã tạo.<br>- Hiển thị thông báo: "Đã tạo 10 ghế hàng A".<br>- Form tự động reset.<br>- Sơ đồ hiển thị thêm các ghế `A1` đến `A10`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_002: Thất bại do Phòng chiếu không tồn tại
| **Test Case ID** | **SEAT_BULK_002** | **Test Case Description** | **Kiểm tra tạo ghế hàng loạt thất bại khi Room ID không tồn tại trên hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản đăng nhập có quyền ADMIN. | 1 | Room ID: `9999` (ID không tồn tại trong DB) |
| 2 | Đang gửi request trực tiếp qua công cụ kiểm thử API (Postman/cURL) hoặc can thiệp vào Request payload. | 2 | Ký tự hàng: `"B"` |
| | | 3 | Số ghế bắt đầu: `1`, Số ghế kết thúc: `5` |
| | | 4 | Loại ghế: `VIP` |

#### Test Scenario: Kiểm tra tính toàn vẹn của Room ID khi gọi API Bulk Create
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP POST request tới `/api/admin/seats/bulk` với Room ID = `9999`. | - API trả về mã lỗi `404 Not Found`.<br>- Message trả về: "Phòng chiếu với ID: 9999 không tồn tại". | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra trong cơ sở dữ liệu xem có ghế nào mới được tạo cho Room ID `9999` không. | Không có bản ghi mới nào được tạo trong bảng `seat`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_003: Thất bại do Ký tự hàng trống
| **Test Case ID** | **SEAT_BULK_003** | **Test Case Description** | **Kiểm tra validation khi ký tự hàng (rowSymbol) trống hoặc chứa toàn khoảng trắng** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1` |
| | | 2 | Ký tự hàng: `""` (Để trống) hoặc `"   "` |
| | | 3 | Số ghế bắt đầu: `1`, Số ghế kết thúc: `5` |
| | | 4 | Loại ghế: `NORMAL` |

#### Test Scenario: Nhập dữ liệu thiếu trường ký tự hàng trên giao diện và submit
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Tại form tạo ghế, không điền gì vào ô "Ký tự hàng (A, B, C...)". | Trường nhập liệu có thể hiển thị cảnh báo đỏ hoặc để trống. | Kết quả như mong đợi | Pass |
| 2 | Nhập các thông tin khác đầy đủ và bấm nút "Tạo ghế". | - Frontend thực hiện validate chặn lại, không gọi API.<br>- Thông báo lỗi hiện lên: "Nhập ký tự hàng (A, B, C...)". | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_004: Thất bại do Số ghế bắt đầu trống hoặc <= 0
| **Test Case ID** | **SEAT_BULK_004** | **Test Case Description** | **Kiểm tra lỗi khi số ghế bắt đầu trống, bằng 0 hoặc là số âm** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1`, Ký tự hàng: `"C"` |
| | | 2 | Số ghế bắt đầu: `-1` hoặc `0` hoặc `null` |
| | | 3 | Số ghế kết thúc: `10` |
| | | 4 | Loại ghế: `NORMAL` |

#### Test Scenario: Nhập số ghế bắt đầu không hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập vào trường "Ghế bắt đầu" giá trị `-1` hoặc `0` (hoặc để trống). | - Ở UI: Mantine `NumberInput` với `min={1}` sẽ tự động ngăn cản nhập số <= 0.<br>- Nếu gửi qua API trực tiếp: Backend ném lỗi Validation `400 Bad Request` do `@Positive` trên `startSeatNumber` hoặc `Số ghế bắt đầu phải là số dương / không được để trống`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_005: Thất bại do Số ghế kết thúc trống hoặc <= 0
| **Test Case ID** | **SEAT_BULK_005** | **Test Case Description** | **Kiểm tra lỗi khi số ghế kết thúc trống, bằng 0 hoặc là số âm** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1`, Ký tự hàng: `"C"` |
| | | 2 | Số ghế bắt đầu: `1` |
| | | 3 | Số ghế kết thúc: `-5` hoặc `0` hoặc `null` |
| | | 4 | Loại ghế: `NORMAL` |

#### Test Scenario: Nhập số ghế kết thúc không hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập vào trường "Ghế kết thúc" giá trị âm hoặc bằng 0. | - Ở UI: Mantine `NumberInput` ngăn chặn số <= 0 hoặc nếu gửi API trực tiếp sẽ bị chặn bởi `@Positive` và `@NotNull`. Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_006: Thất bại do Số ghế bắt đầu lớn hơn Số ghế kết thúc
| **Test Case ID** | **SEAT_BULK_006** | **Test Case Description** | **Kiểm tra logic nghiệp vụ khi Số ghế bắt đầu lớn hơn Số ghế kết thúc** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1`, Ký tự hàng: `"D"` |
| | | 2 | Số ghế bắt đầu: `10` |
| | | 3 | Số ghế kết thúc: `5` (Khoảng sai: `10 > 5`) |
| | | 4 | Loại ghế: `NORMAL` |

#### Test Scenario: Nhập khoảng ghế ngược (Start > End)
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập các thông tin: Ghế bắt đầu = 10, Ghế kết thúc = 5 và bấm nút "Tạo ghế". | - Frontend phát hiện lỗi `start > end` và hiển thị thông báo: "Số ghế bắt đầu phải nhỏ hơn hoặc bằng số ghế kết thúc".<br>- Nếu bypass client để gọi API: Backend ném lỗi do `@AssertTrue` (`isValidRange`) trong `BulkCreateSeatsDto` với message: "Số ghế bắt đầu phải nhỏ hơn hoặc bằng số ghế kết thúc". Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_007: Thất bại do Trùng lặp ghế (Đã tồn tại trong DB)
| **Test Case ID** | **SEAT_BULK_007** | **Test Case Description** | **Kiểm tra tính an toàn dữ liệu: Nếu 1 trong các ghế muốn tạo hàng loạt đã tồn tại, toàn bộ tiến trình phải được rollback** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang ở màn hình quản lý. | 1 | Room ID: `1`, Ký tự hàng: `"E"`, Loại: `NORMAL` |
| 2 | Trong phòng chiếu đã có sẵn ghế `E3` từ trước. | 2 | Số ghế bắt đầu muốn tạo: `1` |
| | | 3 | Số ghế kết thúc muốn tạo: `5` (Khoảng chứa `E3` bị trùng) |

#### Test Scenario: Tạo hàng loạt ghế E1 -> E5 nhưng ghế E3 đã có sẵn
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập thông tin tạo ghế hàng loạt: Hàng E, Ghế 1 -> 5, bấm "Tạo ghế". | - Hệ thống gọi API gửi request.<br>- Backend kiểm tra đến ghế `E3` thấy đã tồn tại, `SeatValidationService` ném ra `BookingException`: "Ghế hàng E số 3 đã tồn tại trong phòng này".<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra lại sơ đồ ghế trong phòng (hoặc DB). | Các ghế khác trong danh sách gửi lên (`E1`, `E2`, `E4`, `E5`) đều **KHÔNG** được tạo (Giao dịch được rollback hoàn toàn nhờ `@Transactional`). | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_008: Thất bại do Loại ghế trống
| **Test Case ID** | **SEAT_BULK_008** | **Test Case Description** | **Kiểm tra tạo ghế hàng loạt khi không chỉ định Loại ghế (SeatType)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1`, Ký tự hàng: `"F"` |
| | | 2 | Số ghế bắt đầu: `1`, Số ghế kết thúc: `5` |
| | | 3 | Loại ghế: `null` hoặc để trống |

#### Test Scenario: Tạo ghế hàng loạt mà không chọn loại ghế
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Xóa lựa chọn ở ô "Loại ghế" (để trống). | Form hiển thị cảnh báo lỗi nhập liệu ở trường loại ghế. | Kết quả như mong đợi | Pass |
| 2 | Nhấp vào nút "Tạo ghế". | - UI chặn lại và thông báo: "Chọn loại ghế".<br>- Nếu gửi API trực tiếp: Backend ném lỗi Validation `400 Bad Request` do `@NotNull(message = "Loại ghế không được để trống")`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_009: Thất bại do Không có quyền ADMIN
| **Test Case ID** | **SEAT_BULK_009** | **Test Case Description** | **Kiểm tra phân quyền: Tài khoản thường (USER) hoặc khách vãng lai cố tình gọi API tạo ghế** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đăng nhập bằng tài khoản thành viên thông thường (Role: `USER`). | 1 | Payload: Room ID: `1`, Ký tự hàng: `"G"`, Ghế bắt đầu: `1`, Kết thúc: `5`, Loại: `NORMAL` |

#### Test Scenario: Truy cập trái phép API ADMIN để tạo ghế
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sử dụng Token của USER thường để gửi HTTP POST request tới `/api/admin/seats/bulk`. | - Hệ thống kiểm tra quyền hạn (`@PreAuthorize("hasRole('ADMIN')")`).<br>- Trả về mã lỗi `403 Forbidden` (hoặc `401 Unauthorized` nếu không gửi token). | Kết quả như mong đợi | Pass |
| 2 | Truy vấn DB. | Không có ghế nào hàng `G` được tạo thêm trong Room ID `1`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_010: Tự động chuẩn hóa Ký tự hàng sang chữ hoa
| **Test Case ID** | **SEAT_BULK_010** | **Test Case Description** | **Kiểm tra chức năng tự động chuyển ký tự hàng thành chữ in hoa ở cả Frontend và Backend** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đang mở form "Tạo nhiều ghế". | 1 | Room ID: `1` |
| | | 2 | Ký tự hàng (nhập thường): `"h"` |
| | | 3 | Ghế bắt đầu: `1`, Ghế kết thúc: `3`, Loại: `NORMAL` |

#### Test Scenario: Nhập ký tự hàng chữ thường và kiểm tra kết quả lưu trữ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập ký tự `"h"` (chữ thường) vào ô "Ký tự hàng (A, B, C...)". | Ô nhập liệu tự động chuyển đổi hiển thị thành `"H"` (chữ in hoa) nhờ sự kiện `onChange`. | Kết quả như mong đợi | Pass |
| 2 | Nhấp vào nút "Tạo ghế" và kiểm tra kết quả trả về của API cũng như trong Database. | Ghế được lưu vào Database với ký tự hàng là `"H"` (chữ in hoa), không phải chữ thường `"h"`. | Kết quả như mong đợi | Pass |

---

### SEAT_BULK_011: Kiểm tra hiệu năng/giới hạn khi tạo số lượng ghế lớn
| **Test Case ID** | **SEAT_BULK_011** | **Test Case Description** | **Đánh giá hiệu năng và giới hạn hệ thống khi tạo số lượng ghế rất lớn trong một giao dịch** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập, phòng chiếu số 2 trống hoàn toàn. | 1 | Room ID: `2` |
| | | 2 | Ký tự hàng: `"X"` |
| | | 3 | Ghế bắt đầu: `1`, Ghế kết thúc: `200` (Tạo cùng lúc 200 ghế) |
| | | 4 | Loại ghế: `NORMAL` |

#### Test Scenario: Tạo hàng loạt 200 ghế trong một request
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập dữ liệu tạo 200 ghế (từ 1 đến 200) hàng X và bấm nút "Tạo ghế". | - Hệ thống xử lý request nhanh chóng (thời gian phản hồi < 2s).<br>- Tạo thành công 200 ghế mới trong DB.<br>- Trả về mã thành công `201 Created` và render sơ đồ ghế mượt mà, không bị crash trình duyệt. | Kết quả như mong đợi | Pass |


---
---

## PHẦN II: PHÂN HỆ HỦY BOOKING (BKG_CANCEL)

### BKG_CANCEL_001: Người dùng hủy thành công Booking PENDING
| **Test Case ID** | **BKG_CANCEL_001** | **Test Case Description** | **Kiểm tra người dùng hủy đặt vé thành công khi đơn đặt vé đang ở trạng thái PENDING** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đã đăng nhập tài khoản của mình. | 1 | Booking ID: `12` (Đang ở trạng thái `PENDING`) |
| 2 | Có một đơn đặt vé (Booking) đang chờ thanh toán (PENDING) thuộc sở hữu của tài khoản này. | | |

#### Test Scenario: Hủy đơn hàng đang chờ thanh toán từ màn hình Lịch sử đặt vé
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Truy cập trang "Lịch sử đặt vé" (ProfileInfoPage). | Danh sách các đơn đặt vé hiển thị, đơn hàng ID 12 hiển thị trạng thái "Chờ thanh toán" (PENDING). | Kết quả như mong đợi | Pass |
| 2 | Nhấp vào đơn hàng ID 12 để mở Modal chi tiết đơn hàng. | Modal chi tiết hiển thị đầy đủ thông tin kèm nút "Hủy đặt vé" (màu đỏ). | Kết quả như mong đợi | Pass |
| 3 | Nhấp vào nút "Hủy đặt vé" và xác nhận hủy. | - Frontend gửi request `DELETE /api/bookings/12`.<br>- API trả về mã thành công `204 No Content`.<br>- Trạng thái đơn hàng trên giao diện chuyển thành "Đã hủy" (FAILED).<br>- Trong Database, trạng thái booking ID 12 chuyển sang `FAILED`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_002: Tự động hủy khi rời khỏi trang thanh toán
| **Test Case ID** | **BKG_CANCEL_002** | **Test Case Description** | **Kiểm tra cơ chế tự động gọi API hủy đặt vé khi người dùng rời khỏi trang thanh toán** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đang thực hiện đặt vé và ở trang "Xác nhận đặt vé" (BookingConfirmPage - có bộ đếm thời gian). | 1 | Booking ID: `15` |

#### Test Scenario: Rời trang thanh toán để hủy vé tự động
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhấp vào nút quay lại trang chủ hoặc đóng tab trình duyệt khi thời gian giữ ghế đang đếm ngược. | - Hệ thống kích hoạt hook `useBookingGuard` để gọi API hủy booking `/api/bookings/15` ngầm trước khi hủy trang.<br>- Trạng thái booking chuyển thành `FAILED` trong DB để giải phóng ghế lập tức. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_003: Job hệ thống tự động hủy các booking PENDING hết hạn
| **Test Case ID** | **BKG_CANCEL_003** | **Test Case Description** | **Kiểm tra dịch vụ dọn dẹp hệ thống (BookingCleanupService) tự động hủy các booking hết hạn giữ chỗ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Hệ thống đang chạy nền. Cấu hình timeout giữ chỗ là `5` phút. | 1 | Booking ID: `18`, trạng thái `PENDING`. |
| 2 | Booking ID 18 được tạo lúc `08:00`. Hiện tại là `08:06` (đã quá 5 phút). | | |

#### Test Scenario: Chờ Job quét và cập nhật trạng thái Booking hết hạn
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Chờ đến thời điểm Job `BookingCleanupService.cancelExpiredBookings` chạy định kỳ (mỗi 60s). | Job chạy và quét thấy Booking ID 18 đã quá hạn 5 phút. | Kết quả như mong đợi | Pass |
| 2 | Truy vấn dữ liệu Booking ID 18 trong database. | Trạng thái Booking ID 18 tự động chuyển từ `PENDING` sang `FAILED`. Log hệ thống ghi nhận: "Cancelled 1 expired pending bookings older than 5 minutes". | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_004: Thất bại do Booking ID không tồn tại
| **Test Case ID** | **BKG_CANCEL_004** | **Test Case Description** | **Kiểm tra hành vi của API hủy booking khi Booking ID không tồn tại trên hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đã đăng nhập. | 1 | Booking ID không tồn tại: `999999` |

#### Test Scenario: Gọi API hủy đơn đặt vé với ID ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/bookings/999999`. | - API ném lỗi `ResourceNotFoundException`: "Booking not found".<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_005: Thất bại do Không phải chủ sở hữu Booking
| **Test Case ID** | **BKG_CANCEL_005** | **Test Case Description** | **Kiểm tra bảo mật: Ngăn chặn User A gửi request hủy Booking của User B** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | User A đã đăng nhập (User ID: 100). | 1 | Booking ID: `25` (Thuộc quyền sở hữu của User B - User ID: 200, trạng thái `PENDING`) |
| 2 | Booking ID 25 thuộc sở hữu của User B. | | |

#### Test Scenario: User A cố tình gửi request hủy Booking của User B
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sử dụng token của User A để gửi HTTP DELETE request tới `/api/bookings/25`. | - API kiểm tra logic tìm kiếm booking theo `bookingId` và `userId` (`bookingRepository.findByIdAndUserId(25, 100)`).<br>- Không tìm thấy booking phù hợp nên ném `ResourceNotFoundException("Booking not found")`. <br>- Trả về mã lỗi `404 Not Found` (để tránh lộ thông tin tồn tại của ID). | Kết quả như mong đợi | Pass |
| 2 | Truy vấn database kiểm tra booking ID 25. | Trạng thái booking ID 25 vẫn giữ nguyên là `PENDING`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_006: Thất bại khi trạng thái Booking đã SUCCESS
| **Test Case ID** | **BKG_CANCEL_006** | **Test Case Description** | **Không cho phép hủy đơn đặt vé đã thanh toán thành công (SUCCESS)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đã đăng nhập. | 1 | Booking ID: `30` (Đang ở trạng thái `SUCCESS`) |
| 2 | Đơn đặt vé ID 30 đã thanh toán thành công (SUCCESS). | | |

#### Test Scenario: Cố tình gửi request hủy đơn hàng đã thanh toán thành công
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/bookings/30`. | - Backend kiểm tra thấy trạng thái `SUCCESS`.<br>- Ném ra `BookingException("Cannot cancel a completed booking.")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Truy vấn database kiểm tra booking ID 30. | Trạng thái booking ID 30 vẫn giữ nguyên là `SUCCESS`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_007: Hủy Booking đã FAILED trước đó (Idempotent)
| **Test Case ID** | **BKG_CANCEL_007** | **Test Case Description** | **Kiểm tra tính idempotent: Hủy booking đã hủy/thất bại từ trước không báo lỗi** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đã đăng nhập. | 1 | Booking ID: `35` (Đang ở trạng thái `FAILED`) |
| 2 | Đơn đặt vé ID 35 đã thất bại/hủy trước đó (`FAILED`). | | |

#### Test Scenario: Hủy một đơn đặt vé đã bị hủy từ trước
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/bookings/35`. | - Backend kiểm tra thấy trạng thái là `FAILED`.<br>- Trả về kết quả thành công ngay lập tức (không thực hiện gì thêm).<br>- Trả về mã thành công `204 No Content`. | Kết quả như mong đợi | Pass |
| 2 | Truy vấn database kiểm tra booking ID 35. | Trạng thái booking ID 35 giữ nguyên là `FAILED`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_008: Kiểm tra giải phóng ghế sau khi Booking bị hủy
| **Test Case ID** | **BKG_CANCEL_008** | **Test Case Description** | **Đảm bảo ghế được giải phóng và sẵn sàng cho khách hàng khác đặt sau khi booking bị hủy** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Khách hàng A đang giữ ghế `A5` tại suất chiếu ID `2` (Booking ID: `40`, trạng thái `PENDING`). | 1 | Booking ID: `40`, Ghế ID: `5` (Ghế A5), Showtime ID: `2` |
| 2 | Khách hàng B đang ở màn hình chọn ghế của suất chiếu ID 2. | | |

#### Test Scenario: Giải phóng ghế động khi booking bị hủy
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Khách hàng B cố tình chọn ghế `A5` để đặt. | Hệ thống báo lỗi: "Seat already reserved by another booking" (Ghế đã bị giữ). | Kết quả như mong đợi | Pass |
| 2 | Thực hiện hủy Booking ID 40 của khách hàng A (chuyển sang `FAILED`). | Booking ID 40 chuyển sang trạng thái `FAILED`. | Kết quả như mong đợi | Pass |
| 3 | Khách hàng B thực hiện chọn lại ghế `A5` và tiến hành gửi yêu cầu đặt vé. | - Hệ thống kiểm tra thấy không còn ticket nào ở trạng thái `PENDING` hay `SUCCESS` liên kết với ghế `A5` tại suất chiếu ID 2.<br>- Cho phép khách hàng B đặt ghế `A5` thành công. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_009: Thất bại do Người dùng chưa đăng nhập
| **Test Case ID** | **BKG_CANCEL_009** | **Test Case Description** | **Kiểm tra việc bảo vệ API bằng Security: Khách vãng lai chưa đăng nhập cố tình gọi API hủy** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không gửi kèm JWT Token trong Header của request. | 1 | Booking ID: `12` |

#### Test Scenario: Hủy vé khi không có quyền xác thực
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/bookings/12` không có header `Authorization`. | - Spring Security chặn request.<br>- Trả về mã lỗi `401 Unauthorized`. | Kết quả như mong đợi | Pass |

---

### BKG_CANCEL_010: Hủy Booking khi suất chiếu đã diễn ra
| **Test Case ID** | **BKG_CANCEL_010** | **Test Case Description** | **Đảm bảo không thể hủy booking khi suất chiếu đã diễn ra/bắt đầu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản sở hữu booking. | 1 | Booking ID: `45` (Booking PENDING của suất chiếu đã bắt đầu lúc `07:00`). |
| 2 | Suất chiếu liên kết với Booking ID 45 đã bắt đầu (Thời điểm hiện tại là `08:15`). | | |

#### Test Scenario: Cố gắng hủy booking của suất chiếu đã diễn ra
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi yêu cầu hủy Booking ID 45 bằng cách gọi API DELETE. | - Backend kiểm tra thấy suất chiếu đã bắt đầu.<br>- Trả về mã lỗi phù hợp (Ví dụ: `400 Bad Request` hoặc chặn không cho hủy từ giao diện). | Kết quả như mong đợi | Pass |


---
---

## PHẦN III: PHÂN HỆ CẬP NHẬT PHIM (MOV_UPDATE)

### MOV_UPDATE_001: Cập nhật thành công phim không đổi tên
| **Test Case ID** | **MOV_UPDATE_001** | **Test Case Description** | **Kiểm tra chức năng cập nhật thông tin mô tả, poster, trailer của phim thành công mà không đổi tiêu đề phim** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đã đăng nhập với tài khoản ADMIN. | 1 | Movie ID: `1` (Tiêu đề hiện tại: "Lật Mặt 7") |
| 2 | Phim có ID = 1 đang tồn tại trong hệ thống. | 2 | Request Payload:<br>- `title`: "Lật Mặt 7" (Không thay đổi)<br>- `description`: "Mô tả mới cập nhật..."<br>- `durationMinutes`: `120`<br>- `releaseDate`: `"2026-06-20"`<br>- `posterUrl`: "http://image.com/latmat7_new.jpg"<br>- `status`: `RELEASED`<br>- `genres`: `["Hành động", "Gia đình"]` |

#### Test Scenario: Cập nhật thông tin chung của phim không thay đổi tiêu đề
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Vào trang quản lý phim, chọn phim "Lật Mặt 7" và bấm nút sửa. | Form hiển thị thông tin hiện tại của phim. | Kết quả như mong đợi | Pass |
| 2 | Giữ nguyên tên phim, thay đổi mô tả và ảnh Poster mới, bấm "Cập nhật". | - Frontend gửi request `PUT /api/movies/1`.<br>- API trả về mã `200 OK` kèm dữ liệu phim đã cập nhật.<br>- Hiển thị thông báo: "Đã cập nhật phim." | Kết quả như mong đợi | Pass |
| 3 | Kiểm tra lại thông tin phim trên danh sách và trong Database. | Các trường mô tả, posterUrl được lưu giá trị mới. Tên phim giữ nguyên. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_002: Cập nhật thành công phim có đổi tên (Đủ điều kiện)
| **Test Case ID** | **MOV_UPDATE_002** | **Test Case Description** | **Kiểm tra chức năng đổi tên phim thành công khi phim chưa có vé thanh toán thành công và không có suất chiếu sắp diễn ra trong 24h** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `2` (Tiêu đề hiện tại: "Dune: Part One") |
| 2 | Phim ID = 2 chưa có bất kỳ vé đặt thành công (`SUCCESS`) nào trong DB. | 2 | Request Payload:<br>- `title`: "Dune: Hành Tinh Cát (Phần 1)" (Đổi tên)<br>- `description`: "Mô tả..."<br>- `durationMinutes`: `155`<br>- `releaseDate`: `"2026-06-20"`<br>- `posterUrl`: "..."<br>- `status`: `RELEASED`<br>- `genres`: `["Khoa học viễn tưởng"]` |
| 3 | Phim ID = 2 không có suất chiếu nào diễn ra trong vòng 24 giờ tới. | | |

#### Test Scenario: Đổi tên phim khi thỏa mãn các điều kiện ràng buộc
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Thực hiện thay đổi Tên phim thành "Dune: Hành Tinh Cát (Phần 1)" và bấm "Cập nhật". | - Hệ thống gọi API `PUT /api/movies/2`.<br>- Backend kiểm tra các ràng buộc: không có vé `SUCCESS` và không có suất chiếu cận 24h.<br>- Cập nhật thành công tên phim mới.<br>- Phản hồi `200 OK` và hiển thị thông báo thành công. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_003: Thất bại do Movie ID không tồn tại
| **Test Case ID** | **MOV_UPDATE_003** | **Test Case Description** | **Kiểm tra hành vi khi cố gắng cập nhật phim có ID không tồn tại trên hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `999999` |
| | | 2 | Request Payload hợp lệ. |

#### Test Scenario: Gọi API cập nhật phim với ID ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/movies/999999` kèm payload. | - Backend kiểm tra thấy phim không tồn tại, ném `EntityNotFoundException("Không tìm thấy phim với id: 999999")`.<br>- Trả về mã lỗi `404 Not Found` kèm nội dung thông báo lỗi tương ứng. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_004: Đổi tên thất bại do phim đã có vé SUCCESS
| **Test Case ID** | **MOV_UPDATE_004** | **Test Case Description** | **Kiểm tra quy tắc nghiệp vụ: Không cho phép đổi tên phim khi đã có ít nhất một đơn đặt vé thanh toán thành công (SUCCESS)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `3` (Tiêu đề hiện tại: "Avengers: Endgame") |
| 2 | Phim ID = 3 đã có một số vé đã được thanh toán thành công (`SUCCESS`). | 2 | Request Payload: Đổi tiêu đề thành `"Avengers: Hồi Kết"` (Các thông tin khác giữ nguyên) |

#### Test Scenario: Đổi tên phim đã bán được vé thành công
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Thay đổi tên phim thành "Avengers: Hồi Kết" trên form và nhấn nút "Cập nhật". | - API gửi request lên server.<br>- Backend phát hiện phim đã có vé `SUCCESS` (`showtimeRepository.existsBookingByMovieAndStatus(3, Status.SUCCESS)`).<br>- Ném ra `IllegalStateException("Không thể đổi tên phim vì đã có vé thanh toán thành công.")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra lại tên phim trong Database. | Tên phim vẫn giữ nguyên là "Avengers: Endgame". | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_005: Đổi tên thất bại do phim có suất chiếu trong 24h
| **Test Case ID** | **MOV_UPDATE_005** | **Test Case Description** | **Kiểm tra quy tắc nghiệp vụ: Không cho phép đổi tên phim khi phim có suất chiếu sắp diễn ra trong vòng 24 giờ tới** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `4` (Tiêu đề hiện tại: "Conan Movie 27") |
| 2 | Phim ID = 4 có suất chiếu bắt đầu sau 5 tiếng nữa (nằm trong khoảng 24h tới). Chưa bán được vé nào. | 2 | Request Payload: Đổi tiêu đề thành `"Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh"` |

#### Test Scenario: Đổi tên phim có suất chiếu cận giờ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Thay đổi tên phim trên form và bấm "Cập nhật". | - API gửi request lên backend.<br>- Backend phát hiện có suất chiếu sắp diễn ra trong 24h.<br>- Ném lỗi `IllegalStateException("Không thể đổi tên phim vì có suất chiếu sắp diễn ra trong 24 giờ.")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra lại tên phim trong Database. | Tên phim vẫn giữ nguyên là "Conan Movie 27". | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_006: Thất bại do Thể loại phim không tồn tại
| **Test Case ID** | **MOV_UPDATE_006** | **Test Case Description** | **Kiểm tra lỗi khi cập nhật danh sách thể loại chứa tên thể loại không có trong DB** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `1` |
| | | 2 | Thể loại truyền lên: `["Kinh dị", "Thể loại ảo không tồn tại"]` |

#### Test Scenario: Cập nhật thể loại phim không hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request cập nhật thể loại có chứa `"Thể loại ảo không tồn tại"`. | - Backend thực hiện hàm `resolveGenres` tìm kiếm trong `GenreRepository`.<br>- Không tìm thấy thể loại ảo, ném `EntityNotFoundException("Không tìm thấy thể loại: Thể loại ảo không tồn tại")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_007: Thất bại do Tên phim trống
| **Test Case ID** | **MOV_UPDATE_007** | **Test Case Description** | **Kiểm tra validate dữ liệu đầu vào: Không cho phép cập nhật tên phim để trống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Form chỉnh sửa phim đang hiển thị. | 1 | Movie ID: `1` |
| | | 2 | Tên phim: `""` (Để trống) |

#### Test Scenario: Xóa tiêu đề phim và submit
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Xóa toàn bộ nội dung ô "Tên phim" trên form và bấm nút "Cập nhật". | - Frontend thông báo lỗi do trường "Tên phim" có thuộc tính `required`. Trình duyệt chặn submit.<br>- Nếu bypass gọi API: Backend từ chối cập nhật hoặc trả về lỗi validation phù hợp. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_008: Thất bại do Thời lượng phim âm hoặc bằng 0
| **Test Case ID** | **MOV_UPDATE_008** | **Test Case Description** | **Ngăn chặn cập nhật thời lượng phim có giá trị không hợp lệ (nhỏ hơn hoặc bằng 0)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Form chỉnh sửa phim đang hiển thị. | 1 | Movie ID: `1` |
| | | 2 | Thời lượng phim: `0` hoặc `-120` |

#### Test Scenario: Nhập thời lượng phim sai định dạng số dương
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập vào trường "Thời lượng (phút)" giá trị `0` hoặc `-120` và bấm nút "Cập nhật". | - Ở giao diện UI: Mantine `NumberInput` có `min={1}` tự động ngăn cản nhập giá trị nhỏ hơn 1.<br>- Nếu gọi trực tiếp qua API: Backend kiểm tra tính hợp lệ và trả về lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_009: Thất bại do Ngày khởi chiếu trống/sai định dạng
| **Test Case ID** | **MOV_UPDATE_009** | **Test Case Description** | **Kiểm tra lỗi khi trường Ngày khởi chiếu để trống hoặc sai định dạng ngày tháng** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Form chỉnh sửa phim đang hiển thị. | 1 | Movie ID: `1` |
| | | 2 | Ngày khởi chiếu: `null` hoặc chuỗi không đúng định dạng ngày tháng |

#### Test Scenario: Nhập ngày khởi chiếu trống hoặc lỗi định dạng
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Xóa trắng ô Ngày khởi chiếu (hoặc truyền chuỗi lỗi qua API) và bấm "Cập nhật". | - Ở UI: DateInput có thuộc tính `required` sẽ ngăn chặn submit khi rỗng.<br>- Gửi qua API: Trả về lỗi định dạng hoặc lỗi validation ngày tháng `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_010: Thất bại do Không có quyền ADMIN
| **Test Case ID** | **MOV_UPDATE_010** | **Test Case Description** | **Kiểm tra phân quyền: Tài khoản thường (USER) cố gọi API cập nhật phim** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản thông thường (Role: `USER`). | 1 | Movie ID: `1`, kèm payload cập nhật phim hợp lệ. |

#### Test Scenario: USER thường gửi request cập nhật phim
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sử dụng token của USER thường để gửi HTTP PUT request tới `/api/movies/1`. | - Spring Security phát hiện URL `/api/movies/**` (đối với phương thức PUT/POST/DELETE) được bảo vệ bởi `@PreAuthorize("hasRole('ADMIN')")`.<br>- Trả về mã lỗi `403 Forbidden`. | Kết quả như mong đợi | Pass |
| 2 | Truy vấn database kiểm tra thông tin phim ID 1. | Phim giữ nguyên thông tin ban đầu, không bị thay đổi. | Kết quả như mong đợi | Pass |

---

### MOV_UPDATE_011: Thất bại do Trạng thái phim không hợp lệ
| **Test Case ID** | **MOV_UPDATE_011** | **Test Case Description** | **Đảm bảo trạng thái của phim (status) phải thuộc một trong các giá trị của Enum MovieStatus (UPCOMING, RELEASED, ENDED)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Gọi API trực tiếp bằng tài khoản ADMIN. | 1 | Movie ID: `1` |
| | | 2 | Trạng thái truyền lên: `"COMING_SOON"` (không hợp lệ) |

#### Test Scenario: Cập nhật trạng thái phim không đúng Enum
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP PUT request tới `/api/movies/1` với trường `status` mang giá trị `"COMING_SOON"`. | - Jackson Mapper ở backend phát hiện chuỗi `"COMING_SOON"` không khớp với bất kỳ giá trị nào trong enum `MovieStatus`. <br>- Ném ra ngoại lệ deserialize và trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |


---
---

## PHẦN IV: PHÂN HỆ QUẢN LÝ PHIM (MOV_MGMT)

### MOV_MGMT_001: Tạo phim mới thành công
| **Test Case ID** | **MOV_MGMT_001** | **Test Case Description** | **Kiểm tra chức năng tạo phim mới thành công với đầy đủ thông tin hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản ADMIN và truy cập màn hình Thêm phim. | 1 | Tên phim: `"Spider-Man: No Way Home"` |
| 2 | Các thể loại `"Hành động"`, `"Phiêu lưu"` đã tồn tại trong DB. | 2 | Mô tả: `"Hành trình đa vũ trụ của Spider-Man..."` |
| | | 3 | Thời lượng: `148` phút, Ngày phát hành: `"2021-12-17"` |
| | | 4 | Thể loại: `["Hành động", "Phiêu lưu"]` |

#### Test Scenario: Tạo phim mới ở trạng thái UPCOMING (Sắp chiếu)
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Điền đầy đủ thông tin phim vào form và bấm nút "Tạo mới". | - Frontend gọi API `POST /api/movies`.<br>- Backend xử lý thành công, trả về `200 OK` kèm dữ liệu phim mới.<br>- Hiển thị thông báo: "Đã tạo phim mới." | Kết quả như mong đợi | Pass |
| 2 | Tìm kiếm phim mới tạo trong DB. | Bản ghi phim hiển thị đúng tên, mô tả, các thể loại liên kết, và trạng thái mặc định là `UPCOMING`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_002: Tạo phim thất bại do thiếu Tiêu đề
| **Test Case ID** | **MOV_MGMT_002** | **Test Case Description** | **Ngăn chặn tạo phim mới khi trường Tên phim (title) bị bỏ trống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Form tạo phim mới đang mở. | 1 | Tên phim: `""` (Trống) |
| | | 2 | Các thông tin khác nhập đầy đủ và hợp lệ. |

#### Test Scenario: Bỏ trống trường tên phim bắt buộc
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập các thông tin khác trừ Tên phim, nhấn "Tạo mới". | - Trường nhập liệu có thuộc tính `required` báo đỏ.<br>- Trình duyệt ngăn chặn submit. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_003: Tạo phim thất bại do Thể loại không tồn tại
| **Test Case ID** | **MOV_MGMT_003** | **Test Case Description** | **Kiểm tra nghiệp vụ Backend: Báo lỗi khi tạo phim với thể loại không tồn tại trong hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Gọi API tạo phim trực tiếp bằng tài khoản ADMIN. | 1 | Thể loại truyền lên: `["Kịch tính", "Thể loại không tồn tại"]` |

#### Test Scenario: Tạo phim kèm thể loại ảo qua API
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP POST request tới `/api/movies` kèm thể loại không tồn tại. | - Backend gọi `resolveGenres` và ném ra `EntityNotFoundException("Không tìm thấy thể loại: Thể loại không tồn tại")`.<br>- Trả về lỗi `400 Bad Request` hoặc `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_004: Tạo phim thất bại do Thời lượng không hợp lệ
| **Test Case ID** | **MOV_MGMT_004** | **Test Case Description** | **Ngăn chặn tạo phim mới khi nhập thời lượng phim nhỏ hơn hoặc bằng 0** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Form tạo phim đang mở. | 1 | Thời lượng: `-90` hoặc `0` |

#### Test Scenario: Nhập thời lượng phim âm
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Điền thời lượng = 0 hoặc số âm và nhấn "Tạo mới". | - Mantine `NumberInput` với `min={1}` tự động chặn không cho nhập số âm.<br>- Nếu gọi API trực tiếp, hệ thống trả về lỗi validate `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_005: Xóa phim thành công
| **Test Case ID** | **MOV_MGMT_005** | **Test Case Description** | **Kiểm tra chức năng xóa phim thành công khi phim chưa liên kết với suất chiếu nào** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = `10` đang tồn tại trong hệ thống. | 1 | Movie ID: `10` |
| 2 | Phim ID 10 chưa có suất chiếu (Showtime) nào trong DB. | | |

#### Test Scenario: Thực hiện xóa phim từ trang quản lý ADMIN
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhấp nút "Xóa" tại phim ID 10 và xác nhận. | - Gửi request `DELETE /api/movies/10`.<br>- Trả về mã thành công `200 OK`.<br>- Phim bị xóa hoàn toàn khỏi DB. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_006: Xóa phim thất bại khi đã có Suất chiếu
| **Test Case ID** | **MOV_MGMT_006** | **Test Case Description** | **Kiểm tra tính ràng buộc dữ liệu: Ngăn xóa phim khi phim đã có các suất chiếu liên kết** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = `2` đang có ít nhất 1 suất chiếu (Showtime) được thiết lập. | 1 | Movie ID: `2` |

#### Test Scenario: Cố gắng xóa phim đang có lịch chiếu hoạt động
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/movies/2`. | - Cơ sở dữ liệu hoặc Backend chặn hành động này do ràng buộc khóa ngoại (Foreign Key Constraint) giữa bảng `showtime` và `movie`.<br>- Trả về lỗi `500 Internal Server Error` hoặc `400 Bad Request` với message thích hợp. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_007: Xóa phim thất bại khi Movie ID không tồn tại
| **Test Case ID** | **MOV_MGMT_007** | **Test Case Description** | **Kiểm tra hành vi xóa phim với Movie ID không tồn tại trên hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản ADMIN. | 1 | Movie ID không tồn tại: `99999` |

#### Test Scenario: Gửi lệnh xóa phim với ID ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/movies/99999`. | - Backend ném lỗi `EntityNotFoundException("Không tìm thấy phim với id: 99999")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_008: Tìm kiếm phim không phân biệt chữ hoa thường
| **Test Case ID** | **MOV_MGMT_008** | **Test Case Description** | **Đảm bảo tính năng tìm kiếm phim trả về kết quả khớp không phân biệt chữ hoa hay chữ thường** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Trong DB có bộ phim với tiêu đề `"Lật Mặt 7: Một Điều Ước"`. | 1 | Từ khóa tìm kiếm 1: `"lật mặt"` (chữ thường)<br>Từ khóa tìm kiếm 2: `"LẬT MẶT"` (chữ hoa) |

#### Test Scenario: Tìm kiếm phim bằng các chuỗi ký tự khác kiểu chữ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tìm kiếm `GET /api/movies/search?q=lật mặt`. | Trả về phim `"Lật Mặt 7: Một Điều Ước"` trong danh sách kết quả. | Kết quả như mong đợi | Pass |
| 2 | Gửi request tìm kiếm `GET /api/movies/search?q=LẬT MẶT`. | Vẫn trả về phim `"Lật Mặt 7: Một Điều Ước"`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_009: Phân trang danh sách phim hoạt động chính xác
| **Test Case ID** | **MOV_MGMT_009** | **Test Case Description** | **Kiểm tra phân trang khi tải danh sách phim (kích thước trang và số trang)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Hệ thống đang có tổng cộng `25` bộ phim hoạt động. | 1 | Query params: `page=0`, `size=10` |

#### Test Scenario: Yêu cầu lấy trang đầu tiên với kích thước trang là 10
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/movies?page=0&size=10`. | - Phản hồi trả về `200 OK` chứa đúng 10 bộ phim.<br>- Trường thông tin phân trang ghi nhận: `totalPages = 3`, `totalElements = 25`. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_010: Xem chi tiết phim thành công theo ID
| **Test Case ID** | **MOV_MGMT_010** | **Test Case Description** | **Kiểm tra xem thông tin chi tiết của phim hoạt động bình thường khi ID tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Bộ phim ID = `3` tồn tại trong DB với tên `"Avengers: Endgame"`. | 1 | Movie ID: `3` |

#### Test Scenario: Xem chi tiết bộ phim cụ thể
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/movies/3`. | - Trả về `200 OK` chứa đầy đủ thông tin chi tiết phim: tiêu đề, mô tả, ngày phát hành, posterUrl, danh sách thể loại. | Kết quả như mong đợi | Pass |

---

### MOV_MGMT_011: Xem chi tiết phim thất bại khi ID không tồn tại
| **Test Case ID** | **MOV_MGMT_011** | **Test Case Description** | **Báo lỗi khi yêu cầu xem chi tiết phim với ID không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Hệ thống không có phim nào mang ID `9999`. | 1 | Movie ID: `9999` |

#### Test Scenario: Xem chi tiết phim với ID không tồn tại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/movies/9999`. | - API ném lỗi `EntityNotFoundException`: "Không tìm thấy phim với id: 9999".<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |


---
---

## PHẦN V: PHÂN HỆ QUẢN LÝ THỂ LOẠI (GENRE)

### GENRE_001: Tạo thể loại mới thành công
| **Test Case ID** | **GENRE_001** | **Test Case Description** | **Kiểm tra chức năng tạo thể loại mới thành công với tên hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản ADMIN. Thể loại `"Kinh dị tâm lý"` chưa tồn tại. | 1 | Tên thể loại: `"Kinh dị tâm lý"` |

#### Test Scenario: Tạo thể loại chưa từng có trong hệ thống
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo thể loại `POST /api/genres` với tên "Kinh dị tâm lý". | - Backend kiểm tra thấy tên thể loại độc nhất.<br>- Lưu thành công, trả về `200 OK` kèm đối tượng Genre mới được gán ID. | Kết quả như mong đợi | Pass |

---

### GENRE_002: Tạo thể loại thất bại do trùng tên
| **Test Case ID** | **GENRE_002** | **Test Case Description** | **Ngăn chặn tạo thể loại mới khi tên thể loại trùng lặp với dữ liệu sẵn có** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại `"Hành động"` đã tồn tại trong cơ sở dữ liệu. | 1 | Tên thể loại: `"Hành động"` |

#### Test Scenario: Tạo thể loại trùng tên
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `POST /api/genres` với tên "Hành động". | - Backend kiểm tra `genreRepository.existsByName("Hành động")` trả về true.<br>- Ném ra `IllegalArgumentException("Thể loại đã tồn tại với tên: Hành động")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### GENRE_003: Cập nhật tên thể loại thành công
| **Test Case ID** | **GENRE_003** | **Test Case Description** | **Kiểm tra chức năng cập nhật (đổi tên) thể loại thành công** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = `5` đang có tên là `"Scifi"`. | 1 | Genre ID: `5`<br>Tên mới: `"Khoa học viễn tưởng"` |
| 2 | Tên `"Khoa học viễn tưởng"` chưa tồn tại trong hệ thống. | | |

#### Test Scenario: Cập nhật đổi tên thể loại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/genres/5` với payload tên là "Khoa học viễn tưởng". | - Hệ thống kiểm tra hợp lệ và tiến hành cập nhật.<br>- Trả về `200 OK` kèm Genre đã cập nhật tên mới. | Kết quả như mong đợi | Pass |

---

### GENRE_004: Cập nhật thể loại thất bại do tên mới giống tên cũ
| **Test Case ID** | **GENRE_004** | **Test Case Description** | **Báo lỗi khi thực hiện cập nhật thể loại nhưng tên mới không thay đổi so với tên cũ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = `2` có tên là `"Hài kịch"`. | 1 | Genre ID: `2`<br>Tên cập nhật gửi lên: `"Hài kịch"` |

#### Test Scenario: Cập nhật thể loại giữ nguyên tên cũ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/genres/2` với tên "Hài kịch". | - Backend kiểm tra thấy tên mới trùng tên cũ của Genre ID 2.<br>- Ném ra `RuntimeException("Không có thay đổi nào được thực hiện")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### GENRE_005: Cập nhật thể loại thất bại do tên mới trùng với thể loại khác
| **Test Case ID** | **GENRE_005** | **Test Case Description** | **Không cho phép cập nhật tên thể loại thành một tên đã được sử dụng bởi thể loại khác** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = `2` có tên `"Hài kịch"`. Thể loại ID = `3` có tên `"Hành động"`. | 1 | Genre ID: `2`<br>Tên cập nhật gửi lên: `"Hành động"` |

#### Test Scenario: Đổi tên thể loại này trùng tên thể loại kia
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/genres/2` với tên "Hành động". | - Backend phát hiện tên "Hành động" đã thuộc thể loại khác (Genre ID 3).<br>- Ném ra `IllegalArgumentException("Thể loại đã tồn tại với tên: Hành động")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### GENRE_006: Cập nhật thể loại thất bại do ID không tồn tại
| **Test Case ID** | **GENRE_006** | **Test Case Description** | **Kiểm tra lỗi cập nhật thể loại khi Genre ID không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại thể loại có ID `999`. | 1 | Genre ID: `999`<br>Tên gửi lên: `"Kịch nghệ"` |

#### Test Scenario: Cập nhật thể loại với ID giả lập
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/genres/999` với tên "Kịch nghệ". | - Backend ném lỗi `EntityNotFoundException("Không tìm thấy thể loại với id: 999")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### GENRE_007: Xóa thể loại thành công
| **Test Case ID** | **GENRE_007** | **Test Case Description** | **Kiểm tra xóa thể loại thành công khi thể loại chưa được gán cho bộ phim nào** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = `6` có tên `"Cổ trang"` đang tồn tại. | 1 | Genre ID: `6` |
| 2 | Chưa có phim nào trong DB thuộc thể loại `"Cổ trang"`. | | |

#### Test Scenario: Tiến hành xóa thể loại nhàn rỗi
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/genres/6`. | - Backend kiểm tra sự tồn tại và xóa thành công.<br>- Trả về mã `200 OK`. | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra danh sách thể loại trong DB. | Không còn thể loại ID 6 trong bảng `genre`. | Kết quả như mong đợi | Pass |

---

### GENRE_008: Xóa thể loại thất bại khi đã có Phim liên kết
| **Test Case ID** | **GENRE_008** | **Test Case Description** | **Đảm bảo tính toàn vẹn dữ liệu: Ngăn xóa thể loại khi đang được sử dụng bởi ít nhất một bộ phim** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = `1` ("Hành động") đang được liên kết với phim "Avengers". | 1 | Genre ID: `1` |

#### Test Scenario: Cố gắng xóa thể loại đang hoạt động
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi HTTP DELETE request tới `/api/genres/1`. | - Hệ thống ngăn cản hành động xóa hoặc ném lỗi vi phạm khóa ngoại từ Database.<br>- Trả về mã lỗi `500 Internal Server Error` hoặc `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### GENRE_009: Xóa thể loại thất bại do ID không tồn tại
| **Test Case ID** | **GENRE_009** | **Test Case Description** | **Báo lỗi 404 khi yêu cầu xóa thể loại với ID không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại thể loại có ID `888`. | 1 | Genre ID: `888` |

#### Test Scenario: Xóa thể loại với ID không hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/genres/888`. | - Backend ném `EntityNotFoundException("Không tìm thấy thể loại với id: 888")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### GENRE_010: Tìm kiếm thể loại theo từ khóa
| **Test Case ID** | **GENRE_010** | **Test Case Description** | **Kiểm tra chức năng tìm kiếm thể loại theo từ khóa gần đúng và không phân biệt hoa thường** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Trong DB có thể loại với tên `"Hoạt hình"`. | 1 | Từ khóa tìm kiếm: `"hoạt"` |

#### Test Scenario: Tìm kiếm thể loại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/genres/search?q=hoạt`. | - Trả về `200 OK` chứa danh sách thể loại thỏa mãn, trong đó có thể loại `"Hoạt hình"`. | Kết quả như mong đợi | Pass |


---
---

## PHẦN VI: PHÂN HỆ QUẢN LÝ SUẤT CHIẾU (SHOWTIME)

### SHOWTIME_001: Tạo suất chiếu thành công
| **Test Case ID** | **SHOWTIME_001** | **Test Case Description** | **Kiểm tra tạo mới một suất chiếu thành công với các dữ liệu hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = 1 và Phòng chiếu ID = 1 đang tồn tại. | 1 | Movie ID: `1`, Room ID: `1`, Base Price: `80000.00` |
| 2 | Phòng chiếu số 1 chưa có lịch chiếu nào vào khung giờ dự kiến. | 2 | Giờ chiếu bắt đầu: `"2026-06-25 18:00:00"` |
| | | 3 | Giờ chiếu kết thúc: `"2026-06-25 20:00:00"` (Thời lượng 2 tiếng) |

#### Test Scenario: Thiết lập suất chiếu mới hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo suất chiếu `POST /api/showtimes` kèm payload. | - Backend kiểm tra không trùng lặp và lưu thành công.<br>- Trả về mã `201 Created` kèm thông tin ShowtimeDTO. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_002: Tạo thất bại do Giờ bắt đầu trễ hơn Giờ kết thúc
| **Test Case ID** | **SHOWTIME_002** | **Test Case Description** | **Báo lỗi khi thiết lập giờ bắt đầu sau hoặc bằng giờ kết thúc suất chiếu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = 1 và Phòng ID = 1 tồn tại. | 1 | Giờ bắt đầu: `"2026-06-25 20:00:00"` |
| | | 2 | Giờ kết thúc: `"2026-06-25 18:00:00"` (Sai trình tự thời gian) |

#### Test Scenario: Thiết lập thời gian suất chiếu ngược
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo suất chiếu với thời gian lỗi. | - Backend kiểm thực gọi `validateShowtimeTime` phát hiện `!startTime.isBefore(endTime)`.<br>- Ném ra `RuntimeException("Thời gian bắt đầu phải trước thời gian kết thúc")`. Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_003: Tạo thất bại do Giờ bắt đầu ở quá khứ
| **Test Case ID** | **SHOWTIME_003** | **Test Case Description** | **Báo lỗi khi thiết lập thời gian suất chiếu diễn ra ở quá khứ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thời điểm hiện tại là `2026-06-20 10:00:00`. | 1 | Giờ bắt đầu: `"2026-06-19 10:00:00"` (Đã qua 1 ngày) |
| | | 2 | Giờ kết thúc: `"2026-06-19 12:00:00"` |

#### Test Scenario: Thiết lập lịch chiếu ở quá khứ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo suất chiếu vào quá khứ. | - Backend kiểm tra `startTime.isBefore(LocalDateTime.now())` trả về true.<br>- Ném ra `RuntimeException("Thời gian bắt đầu không được ở quá khứ")`. Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_004: Tạo thất bại do Thời lượng quá ngắn hoặc quá dài
| **Test Case ID** | **SHOWTIME_004** | **Test Case Description** | **Kiểm tra giới hạn thời lượng suất chiếu (từ 30 phút đến 5 tiếng)** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = 1 và Phòng ID = 1 tồn tại. | 1 | Trường hợp 1: Bắt đầu `18:00`, Kết thúc `18:15` (15 phút - quá ngắn) |
| | | 2 | Trường hợp 2: Bắt đầu `18:00`, Kết thúc `23:30` (5.5 tiếng - quá dài) |

#### Test Scenario: Tạo suất chiếu có độ dài thời gian không hợp lý
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo suất chiếu với thời lượng 15 phút. | - Backend phát hiện thời lượng < 30 phút, ném lỗi: "Thời lượng lịch chiếu phải từ 30 phút đến 5 giờ". Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Gửi request tạo suất chiếu với thời lượng 5.5 tiếng. | - Backend phát hiện thời lượng > 300 phút (5h), ném lỗi tương tự. Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_005: Tạo thất bại do Xung đột lịch chiếu trong phòng
| **Test Case ID** | **SHOWTIME_005** | **Test Case Description** | **Không cho phép tạo suất chiếu mới trùng thời gian với suất chiếu sẵn có trong cùng phòng chiếu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng ID = 1 đã có suất chiếu sẵn có lúc `18:00` đến `20:00` ngày `2026-06-25`. | 1 | Giờ bắt đầu suất mới: `"2026-06-25 19:00:00"` |
| | | 2 | Giờ kết thúc suất mới: `"2026-06-25 21:00:00"` (Bị giao thoa 1 tiếng) |

#### Test Scenario: Thiết lập suất chiếu mới đè lên giờ suất chiếu cũ trong cùng phòng
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo suất chiếu trùng giờ. | - Backend tìm kiếm xung đột qua `showtimeRepository.findConflictingShowtimes`. phát hiện ra conflict.<br>- Ném lỗi: "Phòng chiếu đã có lịch chiếu trong thời gian này. Vui lòng chọn thời gian khác." Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_006: Tạo thất bại do Movie ID hoặc Room ID không tồn tại
| **Test Case ID** | **SHOWTIME_006** | **Test Case Description** | **Báo lỗi khi tạo suất chiếu liên kết với phim hoặc phòng chiếu không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không có Movie ID `999` hoặc Room ID `999` trong cơ sở dữ liệu. | 1 | Movie ID: `999`, Room ID: `1` (Trường hợp 1) |
| | | 2 | Movie ID: `1`, Room ID: `999` (Trường hợp 2) |

#### Test Scenario: Tạo suất chiếu với thực thể liên kết không hợp lệ
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request với Movie ID = 999. | - Backend ném lỗi: "Bộ phim không tồn tại với ID: 999". Trả về `400 Bad Request` hoặc `404 Not Found`. | Kết quả như mong đợi | Pass |
| 2 | Gửi request với Room ID = 999. | - Backend ném lỗi: "Phòng chiếu không tồn tại với ID: 999". Trả về `400 Bad Request` hoặc `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_007: Tạo thất bại do giá vé cơ bản không hợp lệ
| **Test Case ID** | **SHOWTIME_007** | **Test Case Description** | **Ngăn chặn tạo suất chiếu khi giá vé cơ bản (basePrice) nhỏ hơn hoặc bằng 0** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = 1 và Phòng ID = 1 tồn tại. | 1 | Base Price: `-50000` hoặc `0` |

#### Test Scenario: Nhập giá vé cơ bản âm
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request với giá vé cơ bản là -50000. | - Request bị chặn ở tầng validate của `@Positive` trên trường `basePrice`. <br>- Trả về lỗi Validation `400 Bad Request` với message: "Giá vé phải là số dương". | Kết quả như mong đợi | Pass |

---

### SHOWTIME_008: Cập nhật suất chiếu thành công
| **Test Case ID** | **SHOWTIME_008** | **Test Case Description** | **Kiểm tra cập nhật thành công thông tin suất chiếu khi không có xung đột** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = `8` đang diễn ra từ `18:00` đến `20:00`. | 1 | Showtime ID: `8`<br>Thời gian mới: Bắt đầu `19:00`, Kết thúc `21:00` |
| 2 | Khung giờ mới của phòng chiếu đó chưa có suất chiếu khác đè lên. | | |

#### Test Scenario: Thay đổi giờ chiếu của một suất chiếu cụ thể
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/showtimes/8` cập nhật thời gian. | - Backend validate thời gian và tìm xung đột (loại trừ ID 8).<br>- Cập nhật thành công và trả về `200 OK` kèm thông tin mới. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_009: Cập nhật suất chiếu đổi chi nhánh thất bại khi đã bán vé
| **Test Case ID** | **SHOWTIME_009** | **Test Case Description** | **Không cho phép đổi phòng chiếu của suất chiếu sang chi nhánh rạp khác khi đã có khách đặt vé** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = `10` tại Phòng chiếu số 1 (Chi nhánh rạp A) đã có vé đặt ở trạng thái `SUCCESS`. | 1 | Showtime ID: `10`<br>Room ID đích: `5` (Thuộc Chi nhánh rạp B) |
| 2 | Người dùng ADMIN muốn điều chuyển suất chiếu này sang Phòng chiếu số 5 (Chi nhánh rạp B). | | |

#### Test Scenario: Điều chuyển suất chiếu đã bán vé sang chi nhánh rạp khác
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/showtimes/10` với Room ID = 5. | - Backend phát hiện target room có cinemaId khác current room cinemaId và suất chiếu đã có booking `PENDING`/`SUCCESS`.<br>- Ném ra lỗi: "Không thể đổi lịch chiếu sang cơ sở khác vì đã có người đặt vé."<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_010: Cập nhật thất bại do xung đột lịch chiếu mới
| **Test Case ID** | **SHOWTIME_010** | **Test Case Description** | **Báo lỗi khi cập nhật thời gian mới cho suất chiếu đè lên một suất chiếu sẵn có khác** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = `8` đang hoạt động. Suất chiếu ID = `9` diễn ra lúc `14:00` đến `16:00`. | 1 | Showtime ID: `8`<br>Thời gian mới: Bắt đầu `14:30`, Kết thúc `16:30` (Trùng giờ với ID 9) |

#### Test Scenario: Cập nhật giờ suất chiếu ID 8 trùng giờ suất chiếu ID 9
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PUT /api/showtimes/8` với thời gian mới. | - Backend phát hiện xung đột thời gian với suất chiếu ID 9 trong phòng chiếu.<br>- Ném lỗi: "Phòng chiếu đã có lịch chiếu trong thời gian này. Vui lòng chọn thời gian khác." Trả về `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### SHOWTIME_011: Xóa suất chiếu thành công
| **Test Case ID** | **SHOWTIME_011** | **Test Case Description** | **Kiểm tra việc xóa suất chiếu thành công khỏi hệ thống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = `12` đang tồn tại trong hệ thống. | 1 | Showtime ID: `12` |

#### Test Scenario: Thực hiện xóa suất chiếu của rạp
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/showtimes/12`. | - Backend xóa bản ghi suất chiếu.<br>- Trả về mã thành công `200 OK` với thông báo "Lịch chiếu xóa thành công". | Kết quả như mong đợi | Pass |

---

### SHOWTIME_012: Xóa suất chiếu thất bại do ID không tồn tại
| **Test Case ID** | **SHOWTIME_012** | **Test Case Description** | **Báo lỗi 404/RuntimeException khi yêu cầu xóa suất chiếu không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại suất chiếu mang ID `9999`. | 1 | Showtime ID: `9999` |

#### Test Scenario: Xóa suất chiếu với ID giả lập
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/showtimes/9999`. | - Backend ném lỗi: "Lịch chiếu không tồn tại với ID: 9999".<br>- Trả về mã lỗi `400 Bad Request` hoặc `404 Not Found`. | Kết quả như mong đợi | Pass |


---
---

## PHẦN VII: PHÂN HỆ QUẢN LÝ PHÒNG CHIẾU (ROOM)

### ROOM_001: Tạo phòng chiếu mới thành công
| **Test Case ID** | **ROOM_001** | **Test Case Description** | **Kiểm tra chức năng tạo phòng chiếu mới thành công với dữ liệu hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh Cinema ID = 1 đang tồn tại trên hệ thống. | 1 | Cinema ID: `1`, Tên phòng chiếu: `"Phòng chiếu số 5"` |

#### Test Scenario: Thêm phòng chiếu mới vào chi nhánh rạp
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request tạo phòng chiếu `POST /api/rooms` kèm payload. | - Backend kiểm tra chi nhánh tồn tại.<br>- Tạo mới thành công phòng chiếu trong DB, trả về mã `201 Created` kèm thông tin phòng. | Kết quả như mong đợi | Pass |

---

### ROOM_002: Tạo phòng chiếu thất bại khi Cinema ID không tồn tại
| **Test Case ID** | **ROOM_002** | **Test Case Description** | **Ngăn tạo phòng chiếu khi ID chi nhánh cinema liên kết không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh rạp ID `999` không tồn tại trong DB. | 1 | Cinema ID: `999`, Tên phòng: `"Phòng chiếu số 5"` |

#### Test Scenario: Tạo phòng chiếu cho chi nhánh ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `POST /api/rooms` với Cinema ID = 999. | - Backend ném lỗi `CinemaNotFoundException("Chi nhánh với ID: 999 không tồn tại")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### ROOM_003: Tạo phòng chiếu thất bại do Tên phòng trống
| **Test Case ID** | **ROOM_003** | **Test Case Description** | **Không cho phép tạo phòng chiếu mới khi để trống Tên phòng** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh Cinema ID = 1 tồn tại. | 1 | Cinema ID: `1`, Tên phòng: `""` (Bỏ trống) |

#### Test Scenario: Thiết lập tên phòng trống
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `POST /api/rooms` với tên phòng trống. | - Hệ thống kiểm thực validate `@NotBlank(message = "Tên phòng không được để trống")`. <br>- Trả về lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |

---

### ROOM_004: Lấy danh sách phòng theo chi nhánh thành công
| **Test Case ID** | **ROOM_004** | **Test Case Description** | **Kiểm tra chức năng tải danh sách các phòng chiếu trực thuộc một chi nhánh** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh Cinema ID = 1 đang có 3 phòng chiếu trong DB. | 1 | Cinema ID: `1` |

#### Test Scenario: Truy xuất danh sách phòng của chi nhánh ID 1
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/rooms?cinemaId=1`. | - Trả về `200 OK` chứa danh sách 3 phòng chiếu thuộc chi nhánh 1 kèm cấu trúc phân trang. | Kết quả như mong đợi | Pass |

---

### ROOM_005: Lấy danh sách phòng thất bại khi Cinema ID không tồn tại
| **Test Case ID** | **ROOM_005** | **Test Case Description** | **Báo lỗi khi yêu cầu danh sách phòng chiếu từ chi nhánh rạp ảo** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh rạp ID `999` không tồn tại. | 1 | Cinema ID: `999` |

#### Test Scenario: Lấy danh sách phòng của chi nhánh không tồn tại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/rooms?cinemaId=999`. | - Backend ném lỗi `CinemaNotFoundException("Chi nhánh với ID: 999 không tồn tại")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### ROOM_006: Xem thông tin chi tiết phòng chiếu thành công
| **Test Case ID** | **ROOM_006** | **Test Case Description** | **Kiểm tra chức năng lấy thông tin chi tiết phòng chiếu theo ID** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = 1 tồn tại trong hệ thống. | 1 | Room ID: `1` |

#### Test Scenario: Xem chi tiết phòng chiếu cụ thể
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/rooms/1`. | - Trả về mã `200 OK` kèm đối tượng RoomDto chứa đầy đủ chi tiết (tên phòng, thông tin chi nhánh liên kết). | Kết quả như mong đợi | Pass |

---

### ROOM_007: Xem thông tin phòng chiếu thất bại khi ID không tồn tại
| **Test Case ID** | **ROOM_007** | **Test Case Description** | **Báo lỗi 404 khi yêu cầu xem phòng chiếu có ID giả lập** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại phòng chiếu mang ID `999`. | 1 | Room ID: `999` |

#### Test Scenario: Xem chi tiết phòng chiếu không tồn tại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `GET /api/rooms/999`. | - Backend ném lỗi `RoomNotFoundException("Phòng chiếu với ID: 999 không tồn tại")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |

---

### ROOM_008: Cập nhật tên phòng chiếu thành công
| **Test Case ID** | **ROOM_008** | **Test Case Description** | **Kiểm tra chức năng thay đổi tên phòng chiếu thành công** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = 1 đang tồn tại và mang tên `"Phòng cũ"`. | 1 | Room ID: `1`, Tên mới: `"Phòng chiếu IMAX"` |

#### Test Scenario: Thực hiện đổi tên phòng chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `PATCH /api/rooms/1` với tên mới "Phòng chiếu IMAX". | - Backend cập nhật thành công.<br>- Trả về mã `200 OK` kèm thông tin phòng có tên mới. | Kết quả như mong đợi | Pass |

---

### ROOM_009: Xóa phòng chiếu thành công
| **Test Case ID** | **ROOM_009** | **Test Case Description** | **Kiểm tra xóa phòng chiếu thành công khi phòng không có lịch chiếu nào sắp tới** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = `3` đang tồn tại trong hệ thống. | 1 | Room ID: `3` |
| 2 | Phòng ID 3 không có bất kỳ suất chiếu sắp tới nào liên kết. | | |

#### Test Scenario: Xóa phòng chiếu nhàn rỗi
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/rooms/3`. | - Backend kiểm tra `hasUpcomingShowtimes(3)` trả về false.<br>- Tiến hành xóa phòng chiếu thành công, trả về `200 OK`. | Kết quả như mong đợi | Pass |

---

### ROOM_010: Xóa phòng chiếu thất bại khi còn suất chiếu sắp tới
| **Test Case ID** | **ROOM_010** | **Test Case Description** | **Ngăn chặn xóa phòng chiếu khi phòng vẫn còn lịch chiếu sắp diễn ra để tránh mất mát dữ liệu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = `1` vẫn đang có các suất chiếu được lên lịch diễn ra vào tuần tới. | 1 | Room ID: `1` |

#### Test Scenario: Xóa phòng chiếu đang hoạt động suất chiếu sắp tới
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/rooms/1`. | - Backend kiểm tra thấy `hasUpcomingShowtimes(1)` là true.<br>- Ném ra `IllegalStateException("Không thể xóa phòng vì còn suất chiếu sắp tới")`.<br>- Trả về mã lỗi `400 Bad Request`. | Kết quả như mong đợi | Pass |
| 2 | Kiểm tra sự tồn tại của phòng chiếu ID 1. | Phòng chiếu ID 1 vẫn tồn tại trong DB, không bị xóa. | Kết quả như mong đợi | Pass |

---

### ROOM_011: Xóa phòng chiếu thất bại khi ID không tồn tại
| **Test Case ID** | **ROOM_011** | **Test Case Description** | **Báo lỗi 404 khi yêu cầu xóa phòng chiếu không có trong DB** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | Pass |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại phòng chiếu mang ID `999`. | 1 | Room ID: `999` |

#### Test Scenario: Gửi lệnh xóa phòng với ID ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail / Not executed / Suspended** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request `DELETE /api/rooms/999`. | - Backend ném lỗi `RoomNotFoundException("Phòng chiếu với ID: 999 không tồn tại")`.<br>- Trả về mã lỗi `404 Not Found`. | Kết quả như mong đợi | Pass |
