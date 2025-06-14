
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-pmo-gray">
          {title}
        </CardTitle>
        <div className="p-2 bg-pmo-primary/10 rounded-lg">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-pmo-primary">{value}</div>
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-pmo-success" : "text-pmo-danger"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-pmo-gray mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
