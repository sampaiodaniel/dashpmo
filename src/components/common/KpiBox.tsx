
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiBoxProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'red' | 'yellow' | 'green';
  className?: string;
}

export function KpiBox({ title, value, icon, color, className }: KpiBoxProps) {
  const colorStyles = {
    red: {
      border: 'border-l-red-500',
      text: 'text-red-500',
      iconBg: 'text-red-500'
    },
    yellow: {
      border: 'border-l-yellow-500',
      text: 'text-yellow-600',
      iconBg: 'text-yellow-600'
    },
    green: {
      border: 'border-l-green-500',
      text: 'text-green-600',
      iconBg: 'text-green-600'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative",
      styles.border,
      "border-l-4 p-6",
      className
    )}>
      <div className="absolute top-4 right-4">
        <div className={cn("w-5 h-5", styles.iconBg)}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className={cn("text-3xl font-bold mb-1", styles.text)}>
          {value}
        </div>
        <div className="text-sm text-gray-600 font-normal">
          {title}
        </div>
      </div>
    </div>
  );
}
