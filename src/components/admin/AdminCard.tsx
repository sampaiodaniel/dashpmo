import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function AdminCard({ icon: Icon, title, description, onClick }: AdminCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pmo-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-pmo-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-pmo-primary">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-pmo-gray">
          {description}
        </p>
      </CardContent>
    </Card>
  );
} 