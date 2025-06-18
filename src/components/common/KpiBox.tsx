
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
      "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
      styles.border,
      "border-l-4 p-4 h-20",
      className
    )}>
      <div className="flex items-center gap-3 h-full">
        <div className={cn("flex-shrink-0", styles.iconBg)}>
          {icon}
        </div>
        <div className="flex flex-col justify-center">
          <div className={cn("text-2xl font-bold leading-none mb-1", styles.text)}>
            {value}
          </div>
          <div className="text-sm text-gray-600 font-normal leading-none">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
