import fs from 'node:fs';
let readme=fs.readFileSync('README.md','utf8');
readme=readme.replace('thiết lập giảm chuyển động của hệ điều hành luôn được ưu tiên','thiết lập giảm chuyển động của hệ điều hành quyết định trạng thái mặc định; người dùng luôn có thể bấm nút để bật/tắt và lưu lựa chọn riêng');
readme+='\nBản nền tối dùng premium.css: nền aurora bốn lớp, lưới chuyển động và hạt sáng, bảng kính màu navy, ánh sáng tím/cyan. Trang ẩn sẽ tạm dừng hoạt ảnh nền. Nút hiệu ứng có nhãn trạng thái, không còn bị disabled bởi prefers-reduced-motion. Khi bật rõ ràng, lựa chọn người dùng được ưu tiên; khi chưa chọn, vẫn theo thiết bị. Kiểm tra trường hợp thiết bị giảm chuyển động, bật/tắt thủ công, tải lại lựa chọn và storage bị chặn bằng check-motion.mjs.\n';
fs.writeFileSync('README.md',readme);
const offline=fs.readFileSync('dashboard.html','utf8');
if(/<script\b[^>]*\bsrc=|<link\b[^>]*rel="stylesheet"/i.test(offline))throw Error('Standalone HTML still contains external code files');
for(const file of ['dist/premium.css','dist/motion.css']){const css=fs.readFileSync(file,'utf8');let balance=0;for(const c of css){if(c==='{')balance++;if(c==='}')balance--;if(balance<0)throw Error('CSS braces unbalanced: '+file);}if(balance)throw Error('CSS braces unbalanced: '+file);}
console.log('PASS: standalone HTML includes all scripts/styles locally; both motion stylesheets have balanced blocks.');
