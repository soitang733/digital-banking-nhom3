import fs from 'node:fs';
const path='dist/visuals.js';
let source=fs.readFileSync(path,'utf8');
source=source.replace('data-photo-alt="\'+esc(p.alt)+\'"','data-photo-alt="\'+esc(p.alt)+\'" data-photo-source="\'+esc(p.source)+\'"');
source=source.replace('<div class="photo-credit">','<div class="photo-credit" data-photo-credit="\'+esc(b.name)+\'">');
source=source.replace('photo.alt=el.dataset.photoAlt;','photo.alt=el.dataset.photoAlt;const credit=visual.parentElement.querySelector(\'[data-photo-credit] a\');if(credit)credit.href=el.dataset.photoSource;');
fs.writeFileSync(path,source);
fs.appendFileSync('README.md','\nGiao diện động: logo và ảnh minh họa của 5 ngân hàng được lưu tại dist/assets/banks; nguồn từng ảnh nằm trong bank-media.json. Ảnh không được dùng làm bằng chứng chấm điểm. Chọn logo để đổi hồ sơ ngân hàng, chọn chấm bên ảnh để đổi ảnh. Nút ✦ trên thanh đầu bật/tắt hiệu ứng và lưu lựa chọn trong trình duyệt; thiết lập giảm chuyển động của hệ điều hành luôn được ưu tiên. Các hiệu ứng gồm chuyển trang, biểu đồ hiện dần, số đếm về đúng điểm thực, ảnh nghiêng theo chuột và phản hồi nút bấm. Bản dashboard.html nhúng cả ảnh để dùng ngoại tuyến.\n\nSau khi thay bank-media.json chạy node prepare-media.mjs. Kiểm tra logic bằng node check-dashboard.mjs và node check-motion.mjs, rồi tạo lại bản độc lập bằng node package-local.mjs.\n');
