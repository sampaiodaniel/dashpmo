import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-pmo-primary text-left">{title}</h1>
        <p className="text-pmo-gray mt-2 text-left">{subtitle}</p>
      </div>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
} 