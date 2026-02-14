# Thêm sản phẩm hàng loạt (Bulk Import Products)

Schema sản phẩm đã được đồng bộ với thẻ chi tiết sản phẩm trên website (tên, giá, mô tả, ảnh lớn, và toàn bộ thông số kỹ thuật). Dưới đây là các cách để thêm/cập nhật thông tin sản phẩm hàng loạt.

## 1. Cấu trúc dữ liệu sản phẩm (đồng bộ với ảnh chi tiết)

- **Thông tin cơ bản:** `title`, `description`, `price`, `priceUnit`, `images`
- **Thông số kỹ thuật (structured):** Species, W, T, L, Prefinished, Surface, Stain, Color, Cut, Grade, Edge, Traffic, Application, Installation, Pattern, Source, Eco, Janka Rate, Radiant heat rated, Air moisture, Trim & moulding, Stock, Delivery time, Sft/box, Weight/box, Box dimensions
- **Bổ sung:** `specs` (mảng key-value) cho các thuộc tính tùy chỉnh không nằm trong danh sách trên.

## 2. Cách thêm sản phẩm hàng loạt

### Cách A: Sanity Studio (từng sản phẩm hoặc vài sản phẩm)

1. Vào **Sanity Studio** (admin) → **Product**.
2. Tạo document mới, điền **Product specifications** (khối thông số) và các trường còn lại.
3. Phù hợp khi số lượng ít hoặc cần chỉnh từng sản phẩm.

### Cách B: CSV + script import (khuyến nghị cho hàng loạt)

1. **Chuẩn bị file CSV** theo template `scripts/products-bulk-template.csv`:
   - Cột: `title`, `slug`, `description`, `price`, `priceUnit`, `categoryId`, `species`, `width`, `thickness`, … (đúng tên cột trong template).
   - Một dòng = một sản phẩm; để trống nếu không có giá trị.
2. **Chạy script import** (cần implement script đọc CSV và gọi Sanity API với `createOrReplace` hoặc `create`), ví dụ:
   ```bash
   npx ts-node scripts/import-products-from-csv.ts scripts/products-bulk.csv
   ```
3. **Category:** trong CSV dùng `categoryId` = `_id` của category trong Sanity (ví dụ `category-hardwood`). Tạo sẵn category trong Studio hoặc trong seed.

### Cách C: Mở rộng seed (scripts/seed.ts)

- Thêm nhiều block `client.createOrReplace({ _type: 'product', ... })` với đầy đủ `specifications` (và `specs` nếu cần).
- Chạy:
  ```bash
  npx ts-node scripts/seed.ts
  ```
- Phù hợp khi dữ liệu nằm trong code và cần deploy/seed lại môi trường.

### Cách D: Sanity CLI / API từ Excel hoặc Google Sheet

1. Xuất dữ liệu từ Excel/Google Sheet ra **CSV** (cột trùng với template).
2. Dùng script tương tự Cách B để đọc CSV và gửi lên Sanity qua API (token ghi trong `.env.local`).

## 3. Template CSV

File mẫu: **`scripts/products-bulk-template.csv`**. Các cột tương ứng với schema:

- `title`, `slug`, `description`, `price`, `priceUnit`, `categoryId`
- `species`, `width`, `thickness`, `length`, `prefinished`, `surface`, `stain`, `color`, `cut`, `grade`, `edge`, `traffic`, `application`, `installation`, `pattern`, `source`, `eco`, `jankaRate`, `radiantHeatRated`, `airMoisture`, `trimMoulding`, `stock`, `deliveryTime`, `sftPerBox`, `weightPerBox`, `boxDimensions`
- `visibility` (public | wholesale | hidden), `isFeatured` (true | false)

Ảnh sản phẩm vẫn cần upload trong Sanity Studio (hoặc qua Asset API) rồi gắn vào document; CSV chỉ nên chứa URL hoặc path nếu script của bạn hỗ trợ upload từ URL.

## 4. Lưu ý

- **Slug:** mỗi sản phẩm cần `slug` duy nhất (thường từ `title`).
- **Category:** phải tồn tại trong dataset (tạo trước bằng Studio hoặc seed).
- **Token:** script ghi dữ liệu cần `SANITY_API_WRITE_TOKEN` trong `.env.local`.

Sau khi import, trang chi tiết sản phẩm sẽ hiển thị đúng **Product specifications** và **Additional specifications** (specs) như trên thẻ chi tiết đã đồng bộ.
