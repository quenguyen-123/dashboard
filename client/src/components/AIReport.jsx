import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bot, Sparkles, AlertCircle, FileText, Download, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { exportPDF, exportWord, exportMarkdown } from '../services/exportService';

export default function AIReport({ kpis, filters, dataSnapshot }) {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/gemini/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statistics: kpis,
          filters: filters,
          dataSnapshot: dataSnapshot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Tải báo cáo thất bại');
      }

      setReport(data.report);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {!report && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border shadow-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Báo cáo Phân tích bằng Trí tuệ Nhân tạo (AI)</h2>
          <p className="text-muted-foreground max-w-lg mb-8 text-sm leading-relaxed">
            Tạo một báo cáo phân tích nhân sự chuyên nghiệp dựa trên dữ liệu hiện tại của bạn. AI sẽ phân tích cơ cấu, mức lương, hiệu suất công việc, mức độ gắn kết và cảnh báo các rủi ro nhân sự tiềm ẩn.
          </p>
          <Button size="lg" onClick={generateReport} className="gap-2 h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Sparkles className="w-5 h-5" />
            Tạo Báo cáo bằng AI
          </Button>
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2 max-w-lg w-full text-left text-sm animate-in shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-card rounded-2xl border shadow-sm space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Bot className="w-12 h-12 text-primary relative z-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Đang phân tích dữ liệu nhân sự...</h3>
            <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Mô hình Gemini đang biên soạn báo cáo phân tích cho bạn
            </p>
          </div>
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/2 rounded-full animate-[shimmer_1.5s_infinite]" 
                 style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', backgroundSize: '200% 100%' }} />
          </div>
        </div>
      )}

      {report && !isLoading && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm sticky top-20 z-30">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" /> Báo cáo đã hoàn thành!
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Dựa trên dữ liệu đang hiển thị trên Dashboard</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => exportPDF(report, 'Báo cáo Nhân sự')} className="gap-2">
                <FileText className="w-4 h-4 text-rose-500" /> Xuất file PDF
              </Button>
              <Button variant="outline" onClick={() => exportWord(report, 'Báo cáo Nhân sự')} className="gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Xuất file Word
              </Button>
              <Button variant="outline" onClick={() => exportMarkdown(report, 'Báo cáo Nhân sự')} className="gap-2">
                <Download className="w-4 h-4 text-slate-500" /> Tải file MD
              </Button>
              <Button variant="secondary" onClick={generateReport} className="gap-2 ml-auto sm:ml-2">
                <RotateCcw className="w-4 h-4" /> Tạo lại báo cáo
              </Button>
            </div>
          </div>

          <div className="bg-card p-8 md:p-12 rounded-2xl border shadow-sm prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold tracking-tight mb-8 text-primary border-b pb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground flex items-center gap-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
                ul: ({node, ...props}) => <ul className="my-4 space-y-2 list-disc list-outside ml-4" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                p: ({node, ...props}) => <p className="leading-7 [&:not(:first-child)]:mt-4 text-muted-foreground text-sm" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
              }}
            >
              {report}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
