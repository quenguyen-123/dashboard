import React from 'react';
import { Users, UserCheck, UserMinus, Clock, DollarSign, Award, Heart, BookOpen, Calendar, TrendingUp } from 'lucide-react';

export default function KPICards({ kpis }) {
  const cards = [
    { title: 'Tổng Nhân sự', value: kpis.totalEmployees, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Đang làm việc', value: kpis.activeEmployees, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Đã nghỉ việc', value: kpis.terminatedEmployees, icon: UserMinus, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Tuổi trung bình', value: kpis.avgAge, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', suffix: ' tuổi' },
    { title: 'Lương trung bình', value: kpis.avgSalary, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-500/10', prefix: '$' },
    { title: 'Hiệu suất TB', value: kpis.avgPerformance, icon: Award, color: 'text-violet-500', bg: 'bg-violet-500/10', suffix: '/10' },
    { title: 'Mức độ Gắn kết', value: kpis.avgEngagement, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10', suffix: '/5' },
    { title: 'Giờ Đào tạo TB', value: kpis.avgTraining, icon: BookOpen, color: 'text-cyan-500', bg: 'bg-cyan-500/10', suffix: 'h' },
    { title: 'Số ngày Vắng TB', value: kpis.avgAbsence, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10', suffix: ' ngày' },
    { title: 'Tỷ lệ Thăng tiến', value: kpis.promotionRate, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-500/10', suffix: '%' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
        >
          <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
            <h3 className="text-2xl font-bold tracking-tight">
              {card.prefix}{card.value.toLocaleString('vi-VN')}{card.suffix}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
