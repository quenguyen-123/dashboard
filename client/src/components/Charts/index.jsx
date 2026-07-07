import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, LineChart, Line, AreaChart, Area
} from 'recharts';

// Beautiful, harmonious palette
const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#84cc16'  // Lime
];

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`bg-card p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col hover:shadow-md transition-shadow ${className}`}>
    <h3 className="font-semibold text-base mb-4 text-foreground/80">{title}</h3>
    <div className="flex-1 min-h-[250px] w-full">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-3 rounded-lg border shadow-xl text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('vi-VN') : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DepartmentDistribution({ data }) {
  return (
    <ChartCard title="Nhân sự theo phòng ban">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--foreground))" opacity={0.8} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="value" name="Nhân viên" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GenderDistribution({ data }) {
  const vnData = data.map(d => ({
    ...d,
    name: d.name === 'Male' ? 'Nam' : d.name === 'Female' ? 'Nữ' : 'Khác'
  }));
  return (
    <ChartCard title="Tỷ lệ Giới tính">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={vnData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {vnData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AgeDistribution({ data }) {
  return (
    <ChartCard title="Phân bổ Độ tuổi">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="range" angle={-45} textAnchor="end" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="count" name="Nhân viên" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SalaryDistribution({ data }) {
  return (
    <ChartCard title="Phân bổ Mức lương">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="range" angle={-45} textAnchor="end" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="count" name="Nhân viên" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SalaryByDepartment({ data }) {
  return (
    <ChartCard title="Lương trung bình theo phòng">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis dataKey="department" type="category" width={80} stroke="hsl(var(--foreground))" opacity={0.8} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="avgSalary" name="Lương TB ($)" fill={COLORS[3]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PerformanceDistribution({ data }) {
  return (
    <ChartCard title="Điểm Hiệu suất">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="score" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="count" name="Nhân viên" fill={COLORS[4]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function EngagementDistribution({ data }) {
  return (
    <ChartCard title="Điểm Gắn kết">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="score" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="count" name="Nhân viên" fill={COLORS[5]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TrainingVsPerformance({ data }) {
  return (
    <ChartCard title="Giờ Đào tạo vs Hiệu suất">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
          <CartesianGrid stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" dataKey="training" name="Giờ Đào tạo" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis type="number" dataKey="performance" name="Hiệu suất" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Nhân viên" data={data} fill={COLORS[6]} opacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SalaryVsPerformance({ data }) {
  return (
    <ChartCard title="Mức lương vs Hiệu suất">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" dataKey="salary" name="Lương ($)" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis type="number" dataKey="performance" name="Hiệu suất" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Nhân viên" data={data} fill={COLORS[7]} opacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PromotionByDepartment({ data }) {
  return (
    <ChartCard title="Tỷ lệ Thăng tiến theo phòng">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis dataKey="department" type="category" width={80} stroke="hsl(var(--foreground))" opacity={0.8} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="rate" name="Tỷ lệ Thăng tiến (%)" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HiringTrend({ data }) {
  return (
    <ChartCard title="Xu hướng Tuyển dụng">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="month" angle={-45} textAnchor="end" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="hires" name="Tuyển dụng mới" stroke={COLORS[1]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function LeavingTrend({ data }) {
  return (
    <ChartCard title="Xu hướng Nghỉ việc">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="month" angle={-45} textAnchor="end" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="terminations" name="Nghỉ việc" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TurnoverRate({ data, className }) {
  return (
    <ChartCard title="Tỷ lệ Biến động nhân sự (Turnover)" className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTurnover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="year" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="turnoverRate" name="Tỷ lệ Nghỉ việc (%)" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTurnover)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopSalaryEmployees({ data }) {
  return (
    <ChartCard title="Nhân viên lương cao nhất">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--foreground))" opacity={0.8} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="salary" name="Lương ($)" fill={COLORS[4]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopEngagementDepts({ data }) {
  return (
    <ChartCard title="Phòng ban Gắn kết nhất">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--foreground))" opacity={0.5} fontSize={12} />
          <YAxis dataKey="department" type="category" width={80} stroke="hsl(var(--foreground))" opacity={0.8} fontSize={12} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
          <Bar dataKey="avgEngagement" name="Điểm TB" fill={COLORS[5]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
