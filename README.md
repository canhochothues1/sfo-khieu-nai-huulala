
# sfo-khieu-nai-huulala
Thu thập bằng chứng cho những người mua đồ giả của chị Hữu Là La, đồng chủ nhân với Saigon Factory Outlet, Bông Spa, Emme bar

# 📋 Hệ Thống Thu Thập Hồ Sơ Khiếu Nại — SFO Huu La La

> Dự án này tự động hóa việc thu thập, phân loại và lưu trữ đơn khiếu nại tập thể. Người dùng chỉ cần điền form — mọi thứ còn lại chạy tự động.

---

## 🗺️ Luồng hoạt động tổng quát

```
[Người dùng điền Google Form]
          ↓
[Apps Script tự động kích hoạt]
          ↓
[Gửi dữ liệu đến n8n Webhook]
          ↓
[n8n xử lý → ghi vào Google Sheets]
          ↓
[Dữ liệu sẵn sàng để tổng hợp / phân tích]
```

Không có bước nào cần người ngồi nhập tay.

---

## 📁 Cấu trúc repo này

```
/
├── README.md                    ← File bạn đang đọc
├── form_script/
│   ├── taoFormKhieuNai.gs       ← Script tạo Google Form tự động (chạy 1 lần)
│   └── onFormSubmit.gs          ← Script trigger: khi có người nộp form → gửi đến n8n
├── n8n/
│   └── form_khieu_nai_flow.json ← File workflow n8n (import vào n8n là chạy được)
└── docs/
    └── huong_dan_setup_bang_tay.md  ← Hướng dẫn thêm File Upload vào form (bắt buộc đọc)
```

---

## 🔗 Các tài nguyên đang dùng (cần quyền truy cập)

| Tài nguyên | Link | Ghi chú |
|---|---|---|
| Google Form (người dùng điền) | https://docs.google.com/forms/d/e/1FAIpQLSeyC75a_RRNq0Wz9F1cdu-nE4viwOGFva3IzNeLdAkxcmRbRg/viewform | Link public |
| Google Sheets (lưu dữ liệu) | https://docs.google.com/spreadsheets/d/120alc0SaMvMup-AE--Gq1y3gYnK-kTuTjn4b-6mfT2o | Cần quyền edit |
| Hướng dẫn setup tay | https://docs.google.com/document/d/1vQC6seg57LwZVbKxYEWtFNuqPxkY6RqeEo_SkHAeXJA | Đọc trước khi bắt đầu |

---

## ⚙️ Giải thích từng thành phần

### 1. `taoFormKhieuNai.gs` — Tạo Google Form

**Dùng để làm gì?** Chạy script này một lần duy nhất để tự động tạo toàn bộ Google Form với đầy đủ câu hỏi, validation (kiểm tra định dạng số điện thoại, số tiền...), và cấu trúc 5 phần.

**Lưu ý quan trọng:** Script này **KHÔNG tạo được phần File Upload** vì Google Apps Script không hỗ trợ API này. Sau khi chạy xong, phải vào form thêm tay — xem `docs/huong_dan_setup_bang_tay.md`.

**Khi nào cần dùng lại?** Chỉ khi cần tạo form mới từ đầu. Nếu form cũ vẫn còn → không cần chạy lại.

---

### 2. `onFormSubmit.gs` — Cầu nối Form → n8n

**Dùng để làm gì?** Mỗi khi có người nộp form, script này tự động kích hoạt, gom toàn bộ câu trả lời lại và gửi sang n8n để xử lý.

**Cài vào đâu?** Cài trong Google Form, không phải chạy riêng lẻ. Xem hướng dẫn bên dưới.

**Cần thay gì trước khi dùng:**
```javascript
const N8N_WEBHOOK_URL = "https://[Thay bằng server n8n của bạn]:5678/webhook/form-khieu-nai";
const FORM_ID = "1NxfoVbhbA2ZHNoRiMiVbDP-RvK2uDV2gLcf4MjCX3QE";  // ID form hiện tại
const SHEET_ID = "120alc0SaMvMup-AE--Gq1y3gYnK-kTuTjn4b-6mfT2o"; // ID sheet hiện tại
```

---

### 3. `form_khieu_nai_flow.json` — Workflow n8n

**Dùng để làm gì?** Đây là "đường ống tự động" chạy trên server n8n. Khi nhận dữ liệu từ form, nó:
1. Nhận dữ liệu qua Webhook
2. Parse (đọc và định dạng lại) dữ liệu
3. Ghi vào sheet `RAW_DATA` (dữ liệu thô)
4. Chạy phân tích sơ bộ (hiện tại là mock — cần thay bằng AI thật nếu muốn)
5. Ghi kết quả vào sheet `AI_ANALYSIS`
6. Trả về "success" cho form

**Cần thay gì trước khi dùng:**
- `YOUR_SHEET_ID` → ID của Google Sheets thật
- `YOUR_CREDENTIAL_ID` → ID credential Google Sheets trong n8n của bạn
- Node "AI Analysis (Mock)" → Thay bằng node AI thật (OpenAI, DeepSeek...) nếu cần

---

## 🚀 Hướng dẫn bàn giao — làm theo thứ tự này

### Bước 1: Chuẩn bị server n8n
- Cần có server n8n đang chạy (VPS hoặc cloud)
- Địa chỉ server n8n hiện tại: *(người bàn giao điền vào đây)*

### Bước 2: Import workflow vào n8n
1. Vào n8n → menu trái → **Workflows**
2. Click **Import** → chọn file `n8n/form_khieu_nai_flow.json`
3. Thay `YOUR_SHEET_ID` và `YOUR_CREDENTIAL_ID` theo thực tế
4. **Activate** workflow

### Bước 3: Gắn script vào Google Form
1. Mở Google Form → click **⋮ (3 chấm)** góc trên phải → **Script editor**
2. Paste toàn bộ nội dung `form_script/onFormSubmit.gs`
3. Sửa `N8N_WEBHOOK_URL` thành URL n8n thật
4. Lưu script
5. Vào **Triggers** (⏰) → Add Trigger:
   - Function: `onFormSubmit`
   - Event source: From form
   - Event type: On form submit

### Bước 4: Thêm File Upload vào Form (bắt buộc)
Đọc chi tiết trong `docs/huong_dan_setup_bang_tay.md` hoặc link Google Doc ở trên.

### Bước 5: Test toàn bộ luồng
1. Điền form test → Submit
2. Check Google Sheets → Phải thấy dữ liệu trong sheet `RAW_DATA`
3. Check n8n → Executions → Phải thấy execution thành công

---

## ⚠️ Những thứ chưa hoàn chỉnh (việc cần làm tiếp)

- [ ] Node "AI Analysis" hiện là mock — cần thay bằng AI thật (DeepSeek, OpenAI) để phân tích nội dung khiếu nại
- [ ] Chưa có thông báo tự động (email/Zalo) khi có đơn mới nộp
- [ ] Chưa có dashboard tổng hợp số liệu (tổng tiền, số lượng đơn, tỉnh thành...)
- [ ] File Upload giới hạn 10MB — cần hướng dẫn người dùng dùng Google Drive link nếu file lớn hơn

---

## 🔧 Thông tin kỹ thuật cần biết

| Thứ | Giá trị |
|---|---|
| Form ID | `1NxfoVbhbA2ZHNoRiMiVbDP-RvK2uDV2gLcf4MjCX3QE`(thay thông tin form vừa chạy bằng script ở trên) |
| Sheet ID | `120alc0SaMvMup-AE--Gq1y3gYnK-kTuTjn4b-6mfT2o` (sheet được liên kết với Google Form ở mục Form Settings) |
| n8n Webhook path | `/webhook/form-khieu-nai` |
| Sheet RAW_DATA range | `RAW_DATA!A:D` |
| Sheet AI_ANALYSIS range | `AI_ANALYSIS!A:E` |

---

## 📞 Liên hệ

*An Dư* trong nhóm https://www.facebook.com/share/g/1HGtUn7caX/ Sự thật về Hữu Là La
