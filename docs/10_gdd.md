# LEXIQUEST GAME DESIGN DOCUMENT (PHASE P1)

## 1. GAME MECHANICS
* **Điều khiển**: Cụm phím WASD / Mũi tên (di chuyển), phím `[E]` / `Space` (tương tác/tiếp tục thoại), phím `[I]` (Sổ Ký Ức), phím `[Q]` (Nhật ký Nhiệm vụ).
* **Đồng hành**: Lex (Companion follower) nối đuôi bước đi sau Kaelen dựa trên thuật toán lịch sử tọa độ `posHistory`.
* **Va chạm**: Axis-Aligned Sliding Collision System giúp nhân vật trượt mượt mà theo mép tường/bờ sông mà không bao giờ bị kẹt.

## 2. DATA-DRIVEN ARCHITECTURE
* Engine tuyệt đối không hard-code nội dung giáo dục.
* Toàn bộ kịch bản, câu hỏi Tiếng Anh (67 Echo Trials) và Lịch Sử Việt Nam (25 Memory Anchors) nằm trong thư mục `src/data/`.
* Mảnh ký ức Lịch sử có đầy đủ phân loại `classification` và trích dẫn nguồn bảo tàng `sourceRefs`.
