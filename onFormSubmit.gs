/**
 * TRIGGER: KHI CÓ NGƯỜI NỘP FORM → GỬI DỮ LIỆU SANG N8N
 *
 * CÁCH CÀI:
 * 1. Mở Google Form → ⋮ (3 chấm) → Script editor
 * 2. Paste toàn bộ file này vào
 * 3. Sửa N8N_WEBHOOK_URL bên dưới thành URL server n8n thật
 * 4. Vào Triggers (⏰) → Add Trigger:
 *      Function: onFormSubmit
 *      Event source: From form
 *      Event type: On form submit
 * 5. Lưu lại
 *
 * ⚠️ THÔNG TIN CẦN THAY TRƯỚC KHI DÙNG:
 *    - N8N_WEBHOOK_URL: URL webhook n8n của bạn
 */

// =====================
// ⚙️ CẤU HÌNH — SỬA Ở ĐÂY
// =====================
const N8N_WEBHOOK_URL = "https://[NHAP_URL_N8N_CUA_BAN]/webhook/form-khieu-nai";
const FORM_ID         = "1NxfoVbhbA2ZHNoRiMiVbDP-RvK2uDV2gLcf4MjCX3QE";
const SHEET_ID        = "120alc0SaMvMup-AE--Gq1y3gYnK-kTuTjn4b-6mfT2o";

// =====================
// TRIGGER CHÍNH
// =====================
function onFormSubmit(e) {
  try {
    const response = e.response;
    const items    = response.getItemResponses();

    // Dữ liệu gốc
    const formData = {
      timestamp: new Date().toISOString(),
      email:     response.getRespondentEmail() || ""
    };

    // Map từng câu hỏi → tên trường
    items.forEach(function(item) {
      const q = item.getItem().getTitle();
      const a = item.getResponse();

      if      (q.includes("Họ và tên"))                    formData.hoTen           = a;
      else if (q.includes("Số điện thoại"))                formData.sdt             = a;
      else if (q.includes("Link account Facebook"))        formData.facebook        = a;
      else if (q.includes("Tỉnh / Thành phố"))            formData.tinhThanh       = a;
      else if (q.includes("Kênh liên lạc ưu tiên"))       formData.kenhLienLac     = a;
      else if (q.includes("Email liên hệ"))                formData.emailLienHe     = a;
      else if (q.includes("Chi tiết về đơn hàng"))        formData.chiTietDonHang  = a;
      else if (q.includes("Tổng tiền đã mua"))            formData.tongTienThietHai = a;
      else if (q.includes("Mức độ chắc chắn"))            formData.mucDoChacChan   = a;
      else if (q.includes("Ngày mua hàng đầu tiên"))      formData.ngayGdDauTien   = a;
      else if (q.includes("Ngày mua hàng gần nhất"))      formData.ngayGdCuoi      = a;
      else if (q.includes("Tổng tiền hàng muốn khiếu nại")) formData.tongTienKhieuNai = a;
      else if (q.includes("Liệt kê từng sản phẩm"))       formData.sanPhamChinh    = a;
      else if (q.includes("liên hệ shop"))                 formData.daLienHeShop    = a;
      else if (q.includes("còn tin nhắn Messenger"))       formData.coHtmlMessenger = a;
      else if (q.includes("Thông tin bổ sung"))            formData.ghiChuThem      = a;
      else if (q.includes("Bằng chứng chuyển khoản"))     formData.moTaChuyenKhoan = a;
      else if (q.includes("Bằng chứng tin nhắn"))         formData.moTaTinNhan     = a;
      else if (q.includes("Bằng chứng sản phẩm"))         formData.moTaSanPham     = a;
      else if (q.includes("Link video"))                   formData.linkVideo       = a;
      else if (q.includes("Mô tả nội dung video"))        formData.moTaVideo       = a;
      else if (q.includes("Link Google Drive folder"))     formData.linkDriveFolder = a;
      else if (q.includes("Tình trạng bằng chứng"))       formData.tinhTrangBC     = a;
      else if (item.getItem().getType() == FormApp.ItemType.FILE_UPLOAD) {
        const fileIds         = Array.isArray(a) ? a : [a];
        formData.driveFolderId = fileIds.length > 0 ? fileIds[0] : "";
        formData.soFileUpload  = fileIds.length;
      }
    });

    // Gửi sang n8n
    const options = {
      method:           "post",
      contentType:      "application/json",
      payload:          JSON.stringify({ body: formData }),
      muteHttpExceptions: true
    };

    const result = UrlFetchApp.fetch(N8N_WEBHOOK_URL, options);
    Logger.log("✅ Gửi n8n thành công — Status: " + result.getResponseCode());
    Logger.log("Response: " + result.getContentText());

  } catch (error) {
    Logger.log("❌ Lỗi onFormSubmit: " + error.toString());
  }
}
