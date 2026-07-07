import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/report', async (req, res) => {
  try {
    const { statistics, filters, dataSnapshot } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return res.status(400).json({
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in server/.env'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Bạn là một chuyên gia phân tích nhân sự cấp cao. Dựa trên dữ liệu và thống kê từ dashboard nhân sự dưới đây, hãy tạo một Báo cáo Phân tích Nhân sự toàn diện và chuyên nghiệp bằng tiếng Việt dưới định dạng Markdown.

## Thống kê Dashboard
${JSON.stringify(statistics, null, 2)}

## Các bộ lọc đang áp dụng
${JSON.stringify(filters, null, 2)}

## Dữ liệu mẫu (Snapshot của 50 bản ghi đầu tiên)
${JSON.stringify(dataSnapshot, null, 2)}

---

Vui lòng tạo một Báo cáo Phân tích Nhân sự chi tiết với các mục sau bằng tiếng Việt. Sử dụng các con số thực tế từ dữ liệu được cung cấp. Đưa ra các phân tích định hướng dữ liệu cụ thể chứ không đưa ra nhận xét chung chung. Trình bày báo cáo chuyên nghiệp với tiêu đề rõ ràng, gạch đầu dòng và bôi đậm các chỉ số chính.

# BÁO CÁO PHÂN TÍCH NHÂN SỰ

## 1. Tóm tắt điều hành (Executive Summary)
Cung cấp cái nhìn tổng quan ở cấp độ cao về tình trạng lực lượng lao động, các chỉ số chính và các phát hiện quan trọng. Bao gồm tổng số lượng nhân sự, số lượng đang làm việc vs đã thôi việc, và nêu bật 3 thông tin chuyên sâu quan trọng nhất.

## 2. Tổng quan về lực lượng lao động (Workforce Overview)
Phân tích chi tiết tổng số nhân viên, nhân viên đang làm việc, nhân viên đã nghỉ việc, thâm niên trung bình và cơ cấu lực lượng lao động.

## 3. Nhân khẩu học lực lượng lao động (Workforce Demographics)
Phân tích phân bổ độ tuổi, phân bổ giới tính theo các phòng ban và các chỉ số đa dạng sinh học (nếu có).

## 4. Phân tích mức lương (Salary Analysis)
Phân tích mức lương trung bình, phân bổ lương, lương theo phòng ban, bình đẳng lương theo giới tính và xác định bất kỳ mô hình bất thường hoặc đáng lo ngại nào.

## 5. Phân tích phòng ban (Department Analysis)
So sánh các phòng ban theo số lượng nhân sự, lương trung bình, hiệu suất, mức độ gắn kết và tỷ lệ thôi việc. Xác định các phòng ban hoạt động tốt nhất và kém nhất.

## 6. Hiệu suất của nhân viên (Employee Performance)
Phân tích sự phân bổ điểm hiệu suất, những người có hiệu suất cao nhất, những người hoạt động kém hiệu quả và mối tương quan với các yếu tố khác (đào tạo, thâm niên, lương).

## 7. Phân tích mức độ gắn kết (Engagement Analysis)
Phân tích điểm số gắn kết, xác định các phòng ban có mức độ gắn kết thấp nhất và tương quan với hiệu suất cũng như tỷ lệ thôi việc.

## 8. Phân tích đào tạo (Training Analysis)
Phân tích sự phân bổ giờ đào tạo, mối tương quan với hiệu suất và tỷ lệ hoàn vốn đầu tư (ROI) của việc đào tạo.

## 9. Phân tích thăng tiến (Promotion Analysis)
Phân tích tỷ lệ thăng tiến, thăng tiến theo phòng ban, mối tương quan với hiệu suất và thâm niên làm việc.

## 10. Tỷ lệ nghỉ việc của nhân viên (Employee Turnover)
Tính toán tỷ lệ nghỉ việc, phân tích xu hướng nghỉ việc, xác định các phòng ban có tỷ lệ nghỉ việc cao nhất và nguyên nhân tiềm ẩn.

## 11. Rủi ro & Mối lo ngại (Risks & Concerns)
Xác định các rủi ro nhân sự: các phòng ban có tỷ lệ nghỉ việc cao, nhân viên thiếu gắn kết, bất bình đẳng lương, vấn đề về hiệu suất, khoảng trống trong kế hoạch kế nhiệm.

## 12. Phát hiện chính (Key Findings)
Liệt kê 10 phát hiện quan trọng nhất từ việc phân tích dữ liệu trên.

## 13. Khuyến nghị (Recommendations)
Cung cấp các khuyến nghị cụ thể, có thể thực hiện được dựa trên các phát hiện. Ưu tiên theo mức độ tác động.

## 14. Kế hoạch hành động (Action Plan)
Tạo một kế hoạch hành động theo giai đoạn (30/60/90 ngày) với các nhiệm vụ cụ thể, người chịu trách nhiệm và kết quả mong đợi.

---
QUAN TRỌNG: Sử dụng các con số thực tế từ dữ liệu. Không tự tạo ra số liệu thống kê. Nếu dữ liệu không đủ cho một phần nào đó, hãy ghi chú lại những dữ liệu còn thiếu. Định dạng mọi thứ bằng Markdown rõ ràng.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const report = response.text();

    res.json({ report });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate AI report',
      details: error.message
    });
  }
});

export default router;
