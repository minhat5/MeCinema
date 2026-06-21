# DANH SÁCH 20 TEST CASE TIÊU BIỂU (Bao gồm Pass & Fail)
## Dự án: Hệ thống quản lý đặt vé MeCinema

Tài liệu này chứa 20 kịch bản kiểm thử tiêu biểu cho 4 phân hệ chính:
1. **Quản lý phim (Movie Management)**
2. **Quản lý thể loại (Genre Management)**
3. **Quản lý suất chiếu (Showtime Management)**
4. **Quản lý phòng chiếu (Room Management)**

Mỗi phân hệ gồm 5 testcase tiêu biểu, bao gồm cả các trường hợp **Pass** (hệ thống hoạt động đúng đặc tả) và **Fail** (hệ thống phát hiện lỗi thực tế so với thiết kế).

---

## MỤC LỤC
- [I. PHÂN HỆ QUẢN LÝ PHIM (MOVIE MANAGEMENT)](#i-phân-hệ-quản-lý-phim-movie-management)
  - [TC_MOV_001 (Pass): Tạo phim mới thành công](#tc_mov_001-pass---tạo-phim-mới-thành-công)
  - [TC_MOV_002 (Fail): Tạo phim bị treo hệ thống khi URL Poster quá dài](#tc_mov_002-fail---tạo-phim-bị-treo-hệ-thống-khi-url-poster-quá-dài)
  - [TC_MOV_003 (Pass): Xóa phim nhàn rỗi thành công](#tc_mov_003-pass---xóa-phim-nhàn-rỗi-thành-công)
  - [TC_MOV_004 (Pass): Ngăn chặn xóa phim khi đã có suất chiếu](#tc_mov_004-pass---ngăn-chặn-xóa-phim-khi-đã-có-suất-chiếu)
  - [TC_MOV_005 (Pass): Tìm kiếm phim không phân biệt chữ hoa thường](#tc_mov_005-pass---tìm-kiếm-phim-không-phân-biệt-chữ-hoa-thường)
- [II. PHÂN HỆ QUẢN LÝ THỂ LOẠI (GENRE MANAGEMENT)](#ii-phân-hệ-quản-lý-thể-loại-genre-management)
  - [TC_GEN_001 (Pass): Tạo thể loại mới thành công](#tc_gen_001-pass---tạo-thể-loại-mới-thành-công)
  - [TC_GEN_002 (Pass): Chặn tạo thể loại trùng tên](#tc_gen_002-pass---chặn-tạo-thể-loại-trùng-tên)
  - [TC_GEN_003 (Fail): Cập nhật thể loại không có thay đổi vẫn báo thành công ở UI](#tc_gen_003-fail---cập-nhật-thể-loại-không-có-thay-đổi-vẫn-báo-cập-nhật-thành-công-ở-ui)
  - [TC_GEN_004 (Pass): Cập nhật đổi tên thể loại thành công](#tc_gen_004-pass---cập-nhật-đổi-tên-thể-loại-thành-công)
  - [TC_GEN_005 (Pass): Chặn xóa thể loại đã gán cho Phim](#tc_gen_005-pass---chặn-xóa-thể-loại-đã-gán-cho-phim)
- [III. PHÂN HỆ QUẢN LÝ SUẤT CHIẾU (SHOWTIME MANAGEMENT)](#iii-phân-hệ-quản-lý-suất-chiếu-showtime-management)
  - [TC_SHO_001 (Pass): Tạo suất chiếu mới thành công](#tc_sho_001-pass---tạo-suất-chiếu-mới-thành-công)
  - [TC_SHO_002 (Pass): Chặn tạo suất chiếu trùng giờ](#tc_sho_002-pass---chặn-tạo-suất-chiếu-trùng-giờ)
  - [TC_SHO_003 (Fail): Tạo suất chiếu không đồng bộ với thời lượng thực tế của phim](#tc_sho_003-fail---tạo-suất-chiếu-không-đồng-bộ-với-thời-lượng-thực-tế-của-phim)
  - [TC_SHO_004 (Pass): Chặn cập nhật phòng chiếu khác chi nhánh khi đã bán vé](#tc_sho_004-pass---chặn-cập-nhật-phòng-chiếu-khác-chi-nhánh-khi-đã-bán-vé)
  - [TC_SHO_005 (Pass): Xóa suất chiếu thành công](#tc_sho_005-pass---xóa-suất-chiếu-thành-công)
- [IV. PHÂN HỆ QUẢN LÝ PHÒNG CHIẾU (ROOM MANAGEMENT)](#iv-phân-hệ-quản-lý-phòng-chiếu-room-management)
  - [TC_ROO_001 (Pass): Tạo phòng chiếu mới thành công](#tc_roo_001-pass---tạo-phòng-chiếu-mới-thành-công)
  - [TC_ROO_002 (Pass): Báo lỗi khi Cinema ID không tồn tại](#tc_roo_002-pass---báo-lỗi-khi-cinema-id-không-tồn-tại)
  - [TC_ROO_003 (Pass): Cập nhật tên phòng chiếu thành công](#tc_roo_003-pass---cập-nhật-tên-phòng-chiếu-thành-công)
  - [TC_ROO_004 (Pass): Chặn xóa phòng chiếu khi còn suất chiếu sắp tới](#tc_roo_004-pass---chặn-xóa-phòng-chiếu-khi-còn-suất-chiếu-sắp-tới)
  - [TC_ROO_005 (Fail): Xóa phòng chiếu thành công nhưng không giải phóng ghế](#tc_roo_005-fail---xóa-phòng-chiếu-thành-công-nhưng-không-giải-phóng-ghế)

---

## I. PHÂN HỆ QUẢN LÝ PHIM (MOVIE MANAGEMENT)

### TC_MOV_001 (Pass): Tạo phim mới thành công
| **Test Case ID** | **TC_MOV_001** | **Test Case Description** | **Kiểm tra chức năng tạo phim mới với đầy đủ thông tin hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đăng nhập tài khoản ADMIN. | 1 | Tên phim: "Spider-Man: No Way Home", Mô tả: "Hành trình đa vũ trụ..." |
| 2 | Các thể loại phim "Hành động", "Viễn tưởng" đã có sẵn trong DB. | 2 | Thời lượng: 148, Ngày khởi chiếu: "2026-06-20", Trạng thái: "UPCOMING" |

#### Test Scenario: Thêm bộ phim mới vào danh sách phim sắp chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Truy cập vào màn hình "Thêm phim mới". | Giao diện form thêm phim hiển thị đầy đủ các trường nhập liệu. | Đúng như mong đợi | Pass |
| 2 | Nhập đầy đủ thông tin hợp lệ ở phần dữ liệu test và nhấn "Tạo mới". | Hệ thống lưu phim thành công, trả về API 200 OK. Hiển thị thông báo "Đã tạo phim mới." | Kết quả như mong đợi | Pass |

---

### TC_MOV_002 (Fail): Tạo phim bị treo hệ thống khi URL Poster quá dài
| **Test Case ID** | **TC_MOV_002** | **Test Case Description** | **Kiểm tra tạo phim khi trường URL Poster vượt quá độ dài giới hạn của Database** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Fail** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Người dùng đăng nhập tài khoản ADMIN. | 1 | Tên phim: "Batman", URL Poster: Chuỗi dài 1000 ký tự. |

#### Test Scenario: Kiểm tra giới hạn độ dài ký tự của URL Poster
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Điền đầy đủ thông tin phim, nhập URL Poster cực dài (1000 ký tự) và nhấn "Tạo mới". | Hệ thống hiển thị thông báo lỗi kiểm thực: "Đường dẫn Poster không hợp lệ hoặc quá dài". | Hệ thống không báo lỗi ở UI mà gửi API lên Server. Server trả về lỗi SQL Exception (Data truncation) dẫn đến crash trang trắng. | **Fail** |

---

### TC_MOV_003 (Pass): Xóa phim nhàn rỗi thành công
| **Test Case ID** | **TC_MOV_003** | **Test Case Description** | **Kiểm tra chức năng xóa một phim khi phim này chưa được lên lịch suất chiếu nào** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. Phim ID = 10 đang tồn tại trong hệ thống. | 1 | Movie ID: `10` |
| 2 | Phim ID 10 chưa được gán lịch chiếu. | | |

#### Test Scenario: Thực hiện xóa phim từ danh sách quản lý
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhấn nút "Xóa" tại bộ phim ID 10 và bấm xác nhận trên hộp thoại. | Hệ thống gửi request DELETE thành công. Phim biến mất khỏi danh sách quản lý. | Kết quả như mong đợi | Pass |

---

### TC_MOV_004 (Pass): Ngăn chặn xóa phim khi đã có suất chiếu
| **Test Case ID** | **TC_MOV_004** | **Test Case Description** | **Kiểm tra ràng buộc dữ liệu: Không cho phép xóa phim khi phim đã được lên lịch chiếu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Tài khoản ADMIN đăng nhập. | 1 | Movie ID: `2` (Phim đã có 3 suất chiếu) |
| 2 | Phim ID = 2 đang có suất chiếu liên kết. | | |

#### Test Scenario: Xóa bộ phim đang hoạt động lịch chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Cố tình gửi lệnh xóa phim ID 2. | Backend phát hiện phim đã có suất chiếu liên kết, từ chối xóa và ném lỗi SQL/Constraint Error. | Hệ thống báo lỗi đúng đặc tả, phim không bị xóa. | Pass |

---

### TC_MOV_005 (Pass): Tìm kiếm phim không phân biệt chữ hoa thường
| **Test Case ID** | **TC_MOV_005** | **Test Case Description** | **Kiểm tra chức năng tìm kiếm phim hoạt động chính xác không phân biệt hoa thường** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Bộ phim "Dune: Part Two" đang tồn tại trong hệ thống. | 1 | Từ khóa: `"dune"` hoặc `"DUNE"` |

#### Test Scenario: Thực hiện tìm kiếm phim bằng nhiều kiểu gõ chữ khác nhau
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gõ "dune" vào ô tìm kiếm và nhấn Enter. | Kết quả hiển thị phim "Dune: Part Two". | Kết quả như mong đợi | Pass |
| 2 | Gõ "DUNE" vào ô tìm kiếm và nhấn Enter. | Kết quả vẫn hiển thị chính xác phim "Dune: Part Two". | Kết quả như mong đợi | Pass |


---

## II. PHÂN HỆ QUẢN LÝ THỂ LOẠI (GENRE MANAGEMENT)

### TC_GEN_001 (Pass): Tạo thể loại mới thành công
| **Test Case ID** | **TC_GEN_001** | **Test Case Description** | **Kiểm tra chức năng tạo thể loại mới thành công với tên hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Đăng nhập tài khoản ADMIN. Thể loại `"Kịch tính"` chưa tồn tại. | 1 | Tên thể loại: `"Kịch tính"` |

#### Test Scenario: Tạo thể loại phim mới chưa có trên hệ thống
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập "Kịch tính" vào ô tên thể loại và click "Tạo". | Hệ thống lưu thể loại thành công, trả về trạng thái 200 OK và danh sách cập nhật thêm thể loại mới. | Kết quả như mong đợi | Pass |

---

### TC_GEN_002 (Pass): Chặn tạo thể loại trùng tên
| **Test Case ID** | **TC_GEN_002** | **Test Case Description** | **Ngăn chặn tạo thể loại mới khi tên thể loại đã tồn tại sẵn trong cơ sở dữ liệu** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại `"Hành động"` đã tồn tại trong DB từ trước. | 1 | Tên thể loại: `"Hành động"` |

#### Test Scenario: Trùng tên thể loại khi tạo mới
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập "Hành động" và nhấn tạo thể loại. | API ném lỗi `IllegalArgumentException`. Hệ thống hiển thị thông báo: "Thể loại đã tồn tại với tên: Hành động". | Kết quả như mong đợi | Pass |

---

### TC_GEN_003 (Fail): Cập nhật thể loại không có thay đổi vẫn báo thành công ở UI
| **Test Case ID** | **TC_GEN_003** | **Test Case Description** | **Kiểm tra khi cập nhật tên thể loại nhưng tên mới giống hệt tên cũ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Fail** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = 2 đang có tên là `"Hài kịch"`. | 1 | Genre ID: `2`, Tên cập nhật: `"Hài kịch"` |

#### Test Scenario: Cập nhật thể loại không thay đổi nội dung tên
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhấn sửa thể loại ID 2, giữ nguyên chữ "Hài kịch", nhấn "Lưu". | - Backend ném lỗi `RuntimeException` ("Không có thay đổi nào được thực hiện") và trả về HTTP 400 Bad Request.<br>- Frontend nhận lỗi và thông báo cho người dùng. | - Backend trả về lỗi 400 như thiết kế.<br>- Frontend xử lý lỗi kém, vẫn hiện Toast thông báo "Cập nhật thành công!" khiến người dùng nhầm lẫn. | **Fail** |

---

### TC_GEN_004 (Pass): Cập nhật đổi tên thể loại thành công
| **Test Case ID** | **TC_GEN_004** | **Test Case Description** | **Kiểm tra chức năng sửa và cập nhật tên thể loại thành tên mới hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = 5 đang có tên `"Scifi"`. | 1 | Genre ID: `5`, Tên mới: `"Khoa học viễn tưởng"` |
| 2 | Tên `"Khoa học viễn tưởng"` chưa tồn tại trong hệ thống. | | |

#### Test Scenario: Chỉnh sửa thể loại sang tên hợp lệ khác
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập tên mới vào ô chỉnh sửa thể loại ID 5 và click "Lưu". | Hệ thống cập nhật thành công, lưu tên mới vào DB và phản hồi `200 OK`. | Kết quả như mong đợi | Pass |

---

### TC_GEN_005 (Pass): Chặn xóa thể loại đã gán cho Phim
| **Test Case ID** | **TC_GEN_005** | **Test Case Description** | **Kiểm tra việc ngăn chặn xóa thể loại khi đang liên kết với bộ phim** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Thể loại ID = 1 ("Hành động") đang được gán cho phim "Avengers". | 1 | Genre ID: `1` |

#### Test Scenario: Xóa thể loại đang có ràng buộc khóa ngoại
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Click chọn nút xóa thể loại ID 1. | Hệ thống từ chối xóa, hiển thị lỗi ràng buộc và giữ nguyên thể loại. | Kết quả như mong đợi | Pass |


---

## III. PHÂN HỆ QUẢN LÝ SUẤT CHIẾU (SHOWTIME MANAGEMENT)

### TC_SHO_001 (Pass): Tạo suất chiếu mới thành công
| **Test Case ID** | **TC_SHO_001** | **Test Case Description** | **Kiểm tra chức năng tạo suất chiếu mới thành công ở khung giờ trống** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phim ID = 1 và Phòng ID = 1 tồn tại trong DB. | 1 | Movie ID: 1, Room ID: 1, Base Price: 90,000 |
| 2 | Phòng ID 1 chưa có lịch chiếu nào vào ngày 25-June-2026. | 2 | Bắt đầu: "2026-06-25 18:00:00", Kết thúc: "2026-06-25 20:00:00" |

#### Test Scenario: Thêm lịch chiếu mới cho phim
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập các tham số thời gian và click nút "Tạo lịch chiếu". | Lịch chiếu được lưu thành công, trả về trạng thái 201 Created. | Kết quả như mong đợi | Pass |

---

### TC_SHO_002 (Pass): Chặn tạo suất chiếu trùng giờ
| **Test Case ID** | **TC_SHO_002** | **Test Case Description** | **Kiểm tra cơ chế phát hiện và ngăn chặn lịch chiếu bị trùng giờ trong cùng phòng** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng ID = 1 đã có lịch chiếu từ 18:00 đến 20:00 ngày 25-June-2026. | 1 | Bắt đầu: "2026-06-25 19:00:00", Kết thúc: "2026-06-25 21:00:00" |

#### Test Scenario: Thiết lập lịch chiếu đè lên giờ chiếu của suất chiếu khác
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập thời gian trùng lặp và tiến hành click nút Tạo. | Backend phát hiện xung đột thời gian, chặn và ném thông báo: "Phòng chiếu đã có lịch chiếu trong thời gian này..." | Kết quả như mong đợi | Pass |

---

### TC_SHO_003 (Fail): Tạo suất chiếu không đồng bộ với thời lượng thực tế của phim
| **Test Case ID** | **TC_SHO_003** | **Test Case Description** | **Kiểm tra khi khoảng cách giờ chiếu ngắn hơn thời lượng thực tế của bộ phim** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Fail** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Bộ phim ID = 1 có thời lượng thực tế là `150` phút (2.5 tiếng). | 1 | Bắt đầu: "2026-06-25 18:00:00", Kết thúc: "2026-06-25 19:30:00" (Chỉ cho phép chiếu 90 phút) |

#### Test Scenario: Tạo suất chiếu thiếu thời gian so với độ dài phim
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Thiết lập khoảng thời gian chiếu ngắn hơn thời lượng phim (90 < 150 phút) và nhấn tạo. | Hệ thống kiểm tra thời lượng phim và chặn lại, yêu cầu điều chỉnh thời gian kết thúc phù hợp. | Hệ thống vẫn cho phép tạo suất chiếu thành công, dẫn đến tình trạng phim chiếu bị thiếu giờ trên thực tế. | **Fail** |

---

### TC_SHO_004 (Pass): Chặn cập nhật phòng chiếu khác chi nhánh khi đã bán vé
| **Test Case ID** | **TC_SHO_004** | **Test Case Description** | **Kiểm tra việc ngăn chặn di dời suất chiếu sang rạp ở chi nhánh khác khi đã có người mua vé** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = 10 tại Rạp Chi Nhánh A đã bán được 2 vé SUCCESS. | 1 | Đổi phòng chiếu đích: Room ID 5 (Thuộc Rạp Chi Nhánh B) |

#### Test Scenario: Di chuyển suất chiếu sang cơ sở rạp khác
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Sửa suất chiếu ID 10, chọn phòng chiếu số 5 (chi nhánh B) và nhấn Lưu. | Backend từ chối cập nhật, ném lỗi: "Không thể đổi lịch chiếu sang cơ sở khác vì đã có người đặt vé." | Kết quả như mong đợi | Pass |

---

### TC_SHO_005 (Pass): Xóa suất chiếu thành công
| **Test Case ID** | **TC_SHO_005** | **Test Case Description** | **Kiểm tra chức năng xóa bỏ suất chiếu chưa diễn ra** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Suất chiếu ID = 12 đang tồn tại trong hệ thống. | 1 | Showtime ID: `12` |

#### Test Scenario: Xóa suất chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi lệnh xóa suất chiếu ID 12. | Suất chiếu bị xóa hoàn toàn khỏi cơ sở dữ liệu, hiển thị thông báo thành công. | Kết quả như mong đợi | Pass |


---

## IV. PHÂN HỆ QUẢN LÝ PHÒNG CHIẾU (ROOM MANAGEMENT)

### TC_ROO_001 (Pass): Tạo phòng chiếu mới thành công
| **Test Case ID** | **TC_ROO_001** | **Test Case Description** | **Kiểm tra chức năng tạo phòng chiếu mới thành công với dữ liệu hợp lệ** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Chi nhánh rạp Cinema ID = 1 đang tồn tại trên hệ thống. | 1 | Cinema ID: `1`, Tên phòng chiếu: `"Phòng chiếu số 5"` |

#### Test Scenario: Tạo phòng chiếu mới tại chi nhánh rạp
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập tên phòng mới và click nút "Tạo phòng". | Phòng được thêm thành công vào chi nhánh rạp 1. API trả về mã 201 Created. | Kết quả như mong đợi | Pass |

---

### TC_ROO_002 (Pass): Báo lỗi khi Cinema ID không tồn tại
| **Test Case ID** | **TC_ROO_002** | **Test Case Description** | **Báo lỗi khi tạo phòng chiếu liên kết với chi nhánh rạp không tồn tại** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Không tồn tại chi nhánh Cinema ID = 999 trong DB. | 1 | Cinema ID: `999`, Tên phòng: `"Phòng 5"` |

#### Test Scenario: Tạo phòng chiếu cho chi nhánh ảo
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi request API tạo phòng chiếu với Cinema ID = 999. | Backend chặn lại và ném lỗi `CinemaNotFoundException("Chi nhánh với ID: 999 không tồn tại")`. Trả về 404 Not Found. | Kết quả như mong đợi | Pass |

---

### TC_ROO_003 (Pass): Cập nhật tên phòng chiếu thành công
| **Test Case ID** | **TC_ROO_003** | **Test Case Description** | **Kiểm tra việc cập nhật tên phòng chiếu hoạt động bình thường** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = 1 đang tồn tại và mang tên cũ là `"Phòng số 1"`. | 1 | Room ID: `1`, Tên mới: `"Phòng chiếu IMAX 3D"` |

#### Test Scenario: Cập nhật sửa tên phòng chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nhập tên mới và bấm Lưu chỉnh sửa phòng ID 1. | Hệ thống lưu tên phòng mới vào DB. Trả về mã 200 OK. | Kết quả như mong đợi | Pass |

---

### TC_ROO_004 (Pass): Chặn xóa phòng chiếu khi còn suất chiếu sắp tới
| **Test Case ID** | **TC_ROO_004** | **Test Case Description** | **Kiểm tra ràng buộc nghiệp vụ: Không cho xóa phòng chiếu khi phòng vẫn còn lịch chiếu sắp diễn ra** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Pass** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = 1 đang có các suất chiếu được lên lịch diễn ra vào tuần sau. | 1 | Room ID: `1` |

#### Test Scenario: Xóa phòng chiếu đang hoạt động lịch chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi yêu cầu xóa phòng ID 1. | Backend kiểm tra thấy phòng có suất chiếu sắp tới, từ chối xóa và ném lỗi `IllegalStateException`. | Kết quả như mong đợi | Pass |

---

### TC_ROO_005 (Fail): Xóa phòng chiếu thành công nhưng không giải phóng ghế
| **Test Case ID** | **TC_ROO_005** | **Test Case Description** | **Kiểm tra tính toàn vẹn dữ liệu: Khi xóa phòng chiếu, các ghế thuộc phòng đó phải được xóa tự động** |
| :--- | :--- | :--- | :--- |
| **Created By** | Thái | **Reviewed By** | Minh |
| **Version** | 1.0 | **Date Tested** | 20-June-2026 |
| **Tester Name** | Thái | **Test Status** | **Fail** |

#### Prerequisites & Test Data
| **S #** | **Prerequisites (Điều kiện tiên quyết)** | **S #** | **Test Data (Dữ liệu kiểm thử)** |
| :--- | :--- | :--- | :--- |
| 1 | Phòng chiếu ID = 3 không có suất chiếu sắp tới. Phòng đang có 50 ghế trong bảng `seat`. | 1 | Room ID: `3` |

#### Test Scenario: Kiểm tra dọn dẹp dữ liệu ghế khi xóa phòng chiếu
| **Step #** | **Step Details (Chi tiết các bước)** | **Expected Results (Kết quả mong đợi)** | **Actual Results (Kết quả thực tế)** | **Pass / Fail** |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Gửi lệnh xóa phòng chiếu ID 3. | Phòng chiếu bị xóa thành công. Toàn bộ 50 ghế liên kết với phòng ID 3 trong bảng `seat` cũng phải bị xóa (Cascade Delete). | Phòng chiếu bị xóa thành công, nhưng các ghế thuộc phòng ID 3 vẫn tồn tại trong DB với `room_id = null` (hoặc gây ra lỗi mồ côi dữ liệu), không được dọn dẹp sạch sẽ. | **Fail** |
