// ===== 1. KHAI BÁO DỮ LIỆU VÀ PHẦN TỬ GIAO DIỆN =====

// khai báo khóa dùng để lưu dữ liệu trong localStorage của trình duyệt
const KHOA_LUU = "todoListV02";

// khai báo biến danhSachViec, có giá trị là mảng các việc, mỗi việc có dạng { id, noiDung, hoanThanh }
// lấy dữ liệu đã lưu từ lần trước, nếu chưa có thì bắt đầu bằng mảng rỗng
let danhSachViec = taiDuLieu();

// khai báo biến idDangSua, lưu id của việc đang được sửa, null nghĩa là không sửa việc nào
let idDangSua = null;

// truy vào form thêm việc thông qua id
const formThem = document.getElementById("formThem");
// truy vào ô nhập nội dung việc mới
const oNhap = document.getElementById("oNhap");
// truy vào thẻ ul sẽ chứa các dòng công việc
const danhSach = document.getElementById("danhSach");
// truy vào dòng thông báo khi danh sách rỗng
const thongBaoRong = document.getElementById("thongBaoRong");

// ===== 2. CÁC HÀM LƯU / TẢI DỮ LIỆU =====

// khai báo hàm taiDuLieu
// hàm này xử lý việc đọc danh sách đã lưu trong localStorage
// truy vào localStorage bằng khóa KHOA_LUU
// trả về mảng các việc (hoặc mảng rỗng nếu chưa có / dữ liệu lỗi)
function taiDuLieu() {
  // thử thực hiện, nếu dữ liệu hỏng thì nhảy xuống catch
  try {
    // khai báo hằng số chuoi, có giá trị là chuỗi JSON đã lưu (hoặc null nếu chưa lưu)
    const chuoi = localStorage.getItem(KHOA_LUU);
    // nếu chưa lưu gì thì trả về mảng rỗng
    if (!chuoi) return [];
    // đổi chuỗi JSON thành mảng và trả về
    return JSON.parse(chuoi);
  } catch (loi) {
    // nếu đọc lỗi thì trả về mảng rỗng để ứng dụng vẫn chạy
    return [];
  }
}

// khai báo hàm luuDuLieu
// hàm này xử lý việc ghi danhSachViec vào localStorage
// gọi lại mỗi khi danh sách thay đổi (thêm, sửa, đánh dấu, xóa)
function luuDuLieu() {
  // đổi mảng thành chuỗi JSON rồi lưu vào localStorage
  localStorage.setItem(KHOA_LUU, JSON.stringify(danhSachViec));
}

// ===== 3. CÁC HÀM XỬ LÝ DỮ LIỆU (THÊM - SỬA - ĐÁNH DẤU - XÓA) =====

// khai báo hàm themViec(noiDung)
// hàm này xử lý thêm một việc mới vào cuối danh sách
// trả về true nếu thêm thành công, false nếu nội dung rỗng
function themViec(noiDung) {
  // khai báo hằng số noiDungSach, có giá trị là noiDung đã cắt khoảng trắng 2 đầu
  const noiDungSach = noiDung.trim();
  // kiểm tra: nếu noiDungSach rỗng thì trả về kết quả false
  if (!noiDungSach) return false;

  // tạo việc mới với id duy nhất (dùng thời gian hiện tại tính bằng mili giây)
  const viecMoi = { id: Date.now(), noiDung: noiDungSach, hoanThanh: false };
  // đẩy việc mới vào cuối mảng danhSachViec
  danhSachViec.push(viecMoi);

  // trả về true
  return true;
}

// khai báo hàm suaViec(id, noiDungMoi)
// hàm này xử lý đổi nội dung của việc có id truyền vào
// trả về true nếu sửa thành công, false nếu không tìm thấy việc hoặc nội dung rỗng
function suaViec(id, noiDungMoi) {
  // khai báo hằng số viec, có giá trị là phần tử có id trùng với id truyền vào
  const viec = danhSachViec.find((v) => v.id === id);
  // kiểm tra biến viec: nếu không tìm thấy thì trả về kết quả false
  if (!viec) return false;

  // khai báo hằng số noiDungSach, có giá trị là noiDungMoi đã cắt khoảng trắng 2 đầu
  const noiDungSach = noiDungMoi.trim();
  // kiểm tra: nếu nội dung mới rỗng thì không cho sửa, trả về false
  if (!noiDungSach) return false;

  // nếu hợp lệ: gán giá trị viec.noiDung là nội dung mới (viec.hoanThanh giữ nguyên)
  viec.noiDung = noiDungSach;

  // trả về true
  return true;
}

// khai báo hàm danhDauViec(id)
// hàm này xử lý đảo trạng thái hoàn thành của việc: chưa xong <-> đã xong
// trả về true nếu đổi trạng thái thành công, false nếu không tìm thấy việc
function danhDauViec(id) {
  // khai báo hằng số viec, có giá trị là phần tử có id trùng với id truyền vào
  const viec = danhSachViec.find((v) => v.id === id); // object | undefined

  // kiểm tra biến viec: nếu không tìm thấy thì trả về kết quả false
  if (!viec) return false;

  // nếu tìm thấy: đảo ngược giá trị viec.hoanThanh (true thành false, false thành true)
  viec.hoanThanh = !viec.hoanThanh;

  // trả về true
  return true;
}

// khai báo hàm xoaViec(id)
// hàm này xử lý xóa đúng việc có id truyền vào khỏi danh sách
// trả về true nếu xóa thành công, false nếu không tìm thấy việc
function xoaViec(id) {
  // khai báo hằng số soLuongCu, có giá trị là số việc trước khi xóa
  const soLuongCu = danhSachViec.length;

  // giữ lại tất cả việc có id khác id truyền vào (nghĩa là loại bỏ việc cần xóa)
  danhSachViec = danhSachViec.filter((v) => v.id !== id);

  // nếu đang sửa đúng việc vừa bị xóa thì thoát chế độ sửa
  if (idDangSua === id) idDangSua = null;

  // trả về true nếu số lượng giảm đi (đã xóa được), ngược lại trả về false
  return danhSachViec.length < soLuongCu;
}

// ===== 4. CÁC HÀM HIỂN THỊ GIAO DIỆN =====

// khai báo hàm taoNut(chu, lop, hanhDong)
// hàm này xử lý tạo ra một thẻ button để dùng lại nhiều lần (Sửa, Xóa, Lưu, Hủy)
// trả về thẻ button đã cấu hình xong
function taoNut(chu, lop, hanhDong) {
  // tạo thẻ button
  const nut = document.createElement("button");
  // đặt type="button" để không bị hiểu nhầm là nút gửi form
  nut.type = "button";
  // gán class để CSS tạo kiểu cho nút
  nut.className = "nut " + lop;
  // gán chữ hiển thị trên nút
  nut.textContent = chu;
  // gán hành động vào data-hanh-dong, lúc click sẽ đọc lại để biết nút này làm gì
  nut.dataset.hanhDong = hanhDong;
  // trả về thẻ button
  return nut;
}

// khai báo hàm taoDongViec(viec)
// hàm này xử lý tạo ra một thẻ li hiển thị cho 1 việc
// trả về thẻ li (chế độ bình thường hoặc chế độ sửa, tùy idDangSua)
function taoDongViec(viec) {
  // tạo thẻ li cho dòng công việc
  const li = document.createElement("li");
  // gán class "viec", nếu đã hoàn thành thì thêm class "daXong" để CSS gạch ngang
  li.className = "viec" + (viec.hoanThanh ? " daXong" : "");
  // lưu id vào data-id để lúc click biết đang thao tác trên việc nào
  li.dataset.id = viec.id;

  // kiểm tra: nếu việc này đang được sửa thì vẽ giao diện sửa
  if (viec.id === idDangSua) {
    // tạo ô nhập, có sẵn nội dung cũ để người dùng sửa tiếp
    const oSua = document.createElement("input");
    // đặt kiểu text
    oSua.type = "text";
    // gán class để dùng chung kiểu với ô thêm
    oSua.className = "oNhap oSua";
    // gán nội dung hiện tại của việc vào ô sửa
    oSua.value = viec.noiDung;
    // thêm ô sửa, nút Lưu, nút Hủy vào dòng li
    li.append(oSua, taoNut("Lưu", "nutThem", "luu"), taoNut("Hủy", "", "huy"));
    // trả về dòng li ở chế độ sửa
    return li;
  }

  // tạo checkbox để đánh dấu hoàn thành
  const checkbox = document.createElement("input");
  // đặt kiểu checkbox
  checkbox.type = "checkbox";
  // gán class để CSS phóng to checkbox
  checkbox.className = "checkbox";
  // tick sẵn nếu việc đã hoàn thành
  checkbox.checked = viec.hoanThanh;
  // gán hành động "danhDau" để lúc click biết cần gọi hàm nào
  checkbox.dataset.hanhDong = "danhDau";
  // gán nhãn đọc cho người dùng trình đọc màn hình
  checkbox.setAttribute("aria-label", "Đánh dấu hoàn thành: " + viec.noiDung);

  // tạo thẻ span chứa nội dung việc
  const noiDung = document.createElement("span");
  // gán class để CSS gạch ngang khi đã xong
  noiDung.className = "noiDung";
  // dùng textContent (không dùng innerHTML) để tránh lỗi chèn mã độc hại
  noiDung.textContent = viec.noiDung;

  // tạo khung chứa nhóm nút Sửa và Xóa
  const hanhDong = document.createElement("div");
  // gán class để CSS xếp các nút nằm ngang
  hanhDong.className = "hanhDong";
  // thêm nút Sửa và nút Xóa vào khung
  hanhDong.append(taoNut("Sửa", "", "sua"), taoNut("Xóa", "nutXoa", "xoa"));

  // gộp checkbox, nội dung, nhóm nút vào dòng li
  li.append(checkbox, noiDung, hanhDong);
  // trả về dòng li ở chế độ bình thường
  return li;
}

// khai báo hàm hienThi
// hàm này xử lý vẽ lại toàn bộ danh sách theo dữ liệu danhSachViec hiện tại
// gọi sau mỗi lần dữ liệu thay đổi
function hienThi() {
  // xóa sạch các dòng cũ trước khi vẽ lại
  danhSach.innerHTML = "";

  // duyệt qua từng việc trong mảng
  danhSachViec.forEach((viec) => {
    // tạo dòng li cho việc và đưa vào danh sách
    danhSach.appendChild(taoDongViec(viec));
  });

  // nếu danh sách không có việc nào thì hiện thông báo rỗng, ngược lại ẩn đi
  thongBaoRong.hidden = danhSachViec.length > 0;

  // lưu dữ liệu mới nhất vào localStorage
  luuDuLieu();
}

// ===== 5. XỬ LÝ SỰ KIỆN NGƯỜI DÙNG =====

// thực hiện themViec, khi mà user bấm nút Thêm hoặc nhấn Enter trong ô nhập
formThem.addEventListener("submit", (suKien) => {
  // chặn hành vi mặc định của form (tải lại trang)
  suKien.preventDefault();
  // khai báo biến ketQua, có giá trị là kết quả trả về của themViec
  const ketQua = themViec(oNhap.value);
  // nếu thêm thành công thì xóa trắng ô nhập và vẽ lại danh sách
  if (ketQua) {
    // xóa trắng ô nhập để nhập việc tiếp theo
    oNhap.value = "";
    // vẽ lại giao diện
    hienThi();
  }
  // đưa con trỏ về ô nhập để nhập tiếp (kể cả khi nhập rỗng)
  oNhap.focus();
});

// thực hiện các hành động trên danh sách, khi mà user click vào checkbox / nút Sửa / Xóa / Lưu / Hủy
// dùng 1 bộ lắng nghe duy nhất trên thẻ ul (event delegation) thay vì gắn cho từng nút
danhSach.addEventListener("click", (suKien) => {
  // khai báo hằng số hanhDong, có giá trị là data-hanh-dong của phần tử vừa click
  const hanhDong = suKien.target.dataset.hanhDong;
  // nếu click vào chỗ không phải nút hành động thì bỏ qua
  if (!hanhDong) return;

  // tìm thẻ li cha gần nhất của phần tử vừa click
  const li = suKien.target.closest("li");
  // khai báo hằng số id, có giá trị là data-id của li, đổi từ chuỗi sang số
  const id = Number(li.dataset.id);

  // nếu hành động là danhDau: user tick / bỏ tick checkbox
  if (hanhDong === "danhDau") danhDauViec(id);

  // nếu hành động là xoa: user bấm nút Xóa
  if (hanhDong === "xoa") xoaViec(id);

  // nếu hành động là sua: vào chế độ sửa, ghi nhớ id việc đang sửa
  if (hanhDong === "sua") idDangSua = id;

  // nếu hành động là huy: thoát chế độ sửa, không lưu thay đổi
  if (hanhDong === "huy") idDangSua = null;

  // nếu hành động là luu: lấy nội dung ô sửa, gọi suaViec, thành công thì thoát chế độ sửa
  if (hanhDong === "luu") {
    // truy vào ô sửa nằm trong dòng li hiện tại
    const oSua = li.querySelector(".oSua");
    // khai báo biến ketQua, có giá trị là kết quả trả về của suaViec
    const ketQua = suaViec(id, oSua.value);
    // nếu sửa thành công thì thoát chế độ sửa, nếu thất bại (rỗng) thì giữ nguyên ô sửa
    if (ketQua) idDangSua = null;
  }

  // vẽ lại giao diện sau khi dữ liệu thay đổi
  hienThi();

  // nếu vừa vào chế độ sửa thì đưa con trỏ vào ô sửa cho tiện gõ
  if (hanhDong === "sua") {
    // truy vào ô sửa vừa được vẽ ra
    const oSua = danhSach.querySelector(".oSua");
    // chọn sẵn ô sửa
    oSua.focus();
  }
});

// thực hiện lưu / hủy nhanh, khi mà user nhấn phím trong ô sửa
danhSach.addEventListener("keydown", (suKien) => {
  // nếu phần tử đang gõ không phải ô sửa thì bỏ qua
  if (!suKien.target.classList.contains("oSua")) return;

  // nếu nhấn Enter: giả lập bấm nút Lưu
  if (suKien.key === "Enter") {
    // tìm nút Lưu trong cùng dòng và bấm
    suKien.target.closest("li").querySelector('[data-hanh-dong="luu"]').click();
  }

  // nếu nhấn Escape: giả lập bấm nút Hủy
  if (suKien.key === "Escape") {
    // tìm nút Hủy trong cùng dòng và bấm
    suKien.target.closest("li").querySelector('[data-hanh-dong="huy"]').click();
  }
});

// ===== 6. KHỞI ĐỘNG ỨNG DỤNG =====

// vẽ danh sách lần đầu khi trang vừa mở (hiện việc đã lưu hoặc thông báo rỗng)
hienThi();