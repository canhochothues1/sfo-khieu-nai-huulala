/**
 * SCRIPT TẠO GOOGLE FORM KHIẾU NẠI — SFO HUU LA LA
 * 
 * CÁCH DÙNG:
 * 1. Mở Google Apps Script (script.google.com)
 * 2. Paste toàn bộ file này vào
 * 3. Chạy hàm taoFormKhieuNai()
 * 4. Sau khi chạy xong: vào form, thêm File Upload bằng tay (xem docs/)
 * 
 * LƯU Ý: Apps Script không có API addFileUploadItem()
 * → Phần upload phải thêm thủ công qua Google Forms UI
 */

function taoFormKhieuNai() {

  var form = FormApp.create('Hồ Sơ Khiếu Nại — SFO Huu La La')
    .setDescription(
      'Đây là nỗ lực tập thể nhằm thống kê thiệt hại thực tế để làm việc với báo chí và cơ quan pháp luật.\n\n' +
      '⚠️ Thông tin của bạn được bảo mật. Chúng tôi chỉ dùng con số tổng hợp để chứng minh quy mô vụ việc.\n' +
      '⚠️ Mọi thông tin sai lệch sẽ ảnh hưởng đến tiến trình chung của cả nhóm.\n\n' +
      '📌 Đọc kỹ hướng dẫn từng câu trước khi điền.'
    )
    .setCollectEmail(true)
    .setLimitOneResponsePerUser(true)
    .setAllowResponseEdits(true);

  // =====================
  // PHẦN 1 — THÔNG TIN CÁ NHÂN
  // =====================
  form.addSectionHeaderItem()
    .setTitle('PHẦN 1 — THÔNG TIN CÁ NHÂN')
    .setHelpText('Thông tin này chỉ dùng để đối chiếu nội bộ, không công bố công khai.');

  form.addTextItem()
    .setTitle('Họ và tên')
    .setHelpText('Ghi đầy đủ họ tên thật để đối chiếu với hóa đơn/chuyển khoản.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Số điện thoại (Zalo)')
    .setHelpText('Nhập 10 chữ số, không có dấu cách. Ví dụ: 0901234567')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Phải là 10 chữ số, bắt đầu bằng 0')
      .requireTextMatchesPattern('^0[0-9]{9}$')
      .build());

  form.addTextItem()
    .setTitle('Link account Facebook (không bắt buộc)')
    .setRequired(false);

  form.addListItem()
    .setTitle('Tỉnh / Thành phố')
    .setChoiceValues(['An Giang','Bà Rịa - Vũng Tàu','Bạc Liêu','Bắc Giang','Bắc Kạn','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cần Thơ','Cao Bằng','Đà Nẵng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lạng Sơn','Lào Cai','Lâm Đồng','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên','Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','TP. Hồ Chí Minh','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Kênh liên lạc ưu tiên')
    .setChoiceValues([
      'Zalo (số điện thoại đã điền ở trên)',
      'Facebook Messenger (link FB đã điền ở trên)',
      'Email (điền địa chỉ email ở ô bên dưới)'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email liên hệ (không bắt buộc)')
    .setRequired(false);

  // =====================
  // PHẦN 2 — GIAO DỊCH TỔNG
  // =====================
  form.addPageBreakItem()
    .setTitle('PHẦN 2 — THÔNG TIN GIAO DỊCH TỔNG')
    .setHelpText('Tổng hợp TOÀN BỘ số tiền bạn đã mua tại shop, kể cả hàng không có vấn đề.');

  form.addParagraphTextItem()
    .setTitle('Chi tiết về đơn hàng tổng - Số tài khoản bạn đã chuyển tiền đến (STK bên bán)')
    .setHelpText('Ví dụ:\nlần 1: áo dài, khăn nến - 26tr - 2/4/2023 - STK XXXX Vietcombank Nguyen Thi Hue\nlần 2: nón, giày - 1.5tr - 15/5/2023 - STK YYYY Techcombank Nguyen Thi Hoa')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Tổng tiền đã mua tại shop — toàn bộ đơn hàng (VNĐ)')
    .setHelpText('Chỉ nhập số. Ví dụ: 2500000')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Phải là số')
      .requireNumber()
      .requireNumberGreaterThanOrEqualTo(0)
      .build());

  form.addMultipleChoiceItem()
    .setTitle('Mức độ chắc chắn về con số tổng tiền đã mua')
    .setChoiceValues([
      'Chắc chắn — có lịch sử ngân hàng',
      'Khá chắc — nhớ rõ ±10%',
      'Ước tính — nhớ mang máng',
      'Không nhớ'
    ])
    .setRequired(true);

  form.addDateItem()
    .setTitle('Ngày mua hàng đầu tiên tại shop')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Ngày mua hàng gần nhất tại shop')
    .setRequired(true);

  // =====================
  // PHẦN 3 — SẢN PHẨM KHIẾU NẠI
  // =====================
  form.addPageBreakItem()
    .setTitle('PHẦN 3 — CHI TIẾT SẢN PHẨM KHIẾU NẠI')
    .setHelpText('Chỉ liệt kê những sản phẩm CÓ VẤN ĐỀ. Ghi càng chi tiết càng tốt.');

  form.addTextItem()
    .setTitle('Tổng tiền hàng muốn khiếu nại (VNĐ)')
    .setHelpText('Chỉ nhập số. Ví dụ: 1800000')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireNumber()
      .requireNumberGreaterThanOrEqualTo(0)
      .build());

  form.addParagraphTextItem()
    .setTitle('Liệt kê từng sản phẩm muốn khiếu nại')
    .setHelpText('Mỗi sản phẩm 1 dòng: Tên — Giá — Ngày — Vấn đề\n\nVí dụ:\nÁo RL — 350.000đ — 15/03/2024 — Nhãn mác in mờ\nDép Crocs — 450.000đ — 02/05/2024 — Hộp bị tráo')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Bạn đã liên hệ shop yêu cầu đổi trả chưa?')
    .setChoiceValues([
      'Có — shop từ chối',
      'Có — shop không phản hồi',
      'Có — shop mất liên lạc',
      'Có — shop block',
      'Chưa — shop đã xóa',
      'Chưa — lý do khác'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Bạn còn tin nhắn Messenger với shop không?')
    .setChoiceValues([
      'Có — đầy đủ',
      'Có — một phần',
      'Không — shop xóa',
      'Không dùng Messenger'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Thông tin bổ sung hữu ích cho điều tra (không bắt buộc)')
    .setRequired(false);

  // =====================
  // PHẦN 4 — BẰNG CHỨNG
  // =====================
  form.addPageBreakItem()
    .setTitle('PHẦN 4 — BẰNG CHỨNG');

  form.addParagraphTextItem()
    .setTitle('Bằng chứng chuyển khoản — mô tả')
    .setHelpText('Ví dụ: 3 ảnh lịch sử VCB, tổng 1.8tr cho STK 0123456789 Nguyen Van A')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Bằng chứng tin nhắn / Messenger — mô tả')
    .setHelpText('Ví dụ: File HTML Facebook, chat 3/2024-5/2024')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Bằng chứng sản phẩm — mô tả')
    .setHelpText('Ví dụ: 4 ảnh khăn - nhãn mờ, so sánh hàng thật')
    .setRequired(true);

  // --- PLACEHOLDER FILE UPLOAD (thêm tay sau) ---
  form.addSectionHeaderItem()
    .setTitle('📎 UPLOAD FILE — THÊM BẰNG TAY')
    .setHelpText('⚠️ Admin: Xóa câu placeholder bên dưới và thêm 4 câu File Upload (xem docs/huong_dan_setup_bang_tay.md)');

  form.addParagraphTextItem()
    .setTitle('[PLACEHOLDER] Thay bằng 4 câu File Upload: CK / Tin nhắn / SP / Bổ sung')
    .setHelpText('Hướng dẫn:\n1. Edit form → Xóa câu này\n2. Thêm File Upload question × 4\n3. Settings mỗi câu: 10MB, 10 files, JPG/PNG/PDF/HTML')
    .setRequired(false);

  // --- VIDEO & DRIVE LINK ---
  form.addSectionHeaderItem()
    .setTitle('📹 VIDEO & DRIVE LINK');

  form.addTextItem()
    .setTitle('Link video Google Drive (nếu có)')
    .setHelpText('Set quyền "Anyone with the link can view"')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^https?://.*')
      .build());

  form.addParagraphTextItem()
    .setTitle('Mô tả nội dung video')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Link Google Drive folder chứa toàn bộ bằng chứng')
    .setHelpText('Tạo folder trên Drive → Upload file → Share "Anyone with link can view" → Copy link dán vào đây')
    .setRequired(false)
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^https?://.*')
      .build());

  // =====================
  // PHẦN 5 — XÁC NHẬN
  // =====================
  form.addPageBreakItem()
    .setTitle('PHẦN 5 — XÁC NHẬN');

  form.addMultipleChoiceItem()
    .setTitle('Tình trạng bằng chứng của bạn')
    .setChoiceValues([
      'Đầy đủ — có CK + chat + ảnh SP',
      'Khá đủ — có CK + ảnh SP',
      'Cơ bản — chỉ có CK',
      'Cần hỗ trợ'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Đồng ý sử dụng thông tin')
    .setChoiceValues(['Tôi đồng ý cho phép nhóm sử dụng thông tin và bằng chứng tôi cung cấp vào mục đích khiếu nại, tố cáo tập thể gửi cơ quan công an, quản lý thị trường, và/hoặc báo chí theo quy định pháp luật Việt Nam.'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Xác nhận thông tin trung thực')
    .setChoiceValues(['Tôi xác nhận toàn bộ thông tin trên là trung thực. Tôi hiểu rằng cung cấp thông tin sai lệch sẽ ảnh hưởng đến toàn bộ nhóm và có thể bị xử lý theo quy định pháp luật.'])
    .setRequired(true);

  form.setConfirmationMessage('✅ Cảm ơn bạn đã gửi hồ sơ!\n\nChúng tôi sẽ liên hệ qua kênh bạn đã chọn nếu cần bổ sung thông tin.');

  // =====================
  // GỬI EMAIL KẾT QUẢ
  // =====================
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: '✅ Form đã tạo - CẦN THÊM FILE UPLOAD BẰNG TAY',
    htmlBody:
      '<h2>✅ Form cơ bản đã tạo xong!</h2>' +
      '<p><strong>Link form (public):</strong><br><a href="' + formUrl + '">' + formUrl + '</a></p>' +
      '<p><strong>Link edit (giữ riêng):</strong><br><a href="' + editUrl + '">' + editUrl + '</a></p>' +
      '<hr>' +
      '<h3>⚠️ BƯỚC TIẾP THEO — BẮT BUỘC:</h3>' +
      '<ol>' +
      '<li>Mở link edit ở trên</li>' +
      '<li>Tìm câu <strong>[PLACEHOLDER]</strong> trong Phần 4</li>' +
      '<li>Xóa câu placeholder</li>' +
      '<li>Thêm 4 câu <strong>File Upload</strong>: CK / Tin nhắn / SP / Bổ sung</li>' +
      '<li>Mỗi câu: 10MB/file, 10 files, JPG/PNG/PDF/HTML</li>' +
      '</ol>'
  });

  Logger.log('✅ Form URL: ' + formUrl);
  Logger.log('✅ Edit URL: ' + editUrl);
  Logger.log('⚠️ Nhớ thêm 4 câu File Upload bằng tay!');

  return formUrl;
}
