import { cn } from '../../lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

const StatisticCard = ({
  title,
  value,
  icon,
  className,
  isLoading = false,
  change,
}: StatisticCardProps) => {
  return (
    <div className={cn('statistic-card', className)}>
      {isLoading ? (
        <>
          <div className="flex justify-between items-start">
            <div className="h-4 w-24 bg-muted/20 rounded animate-pulse"></div>
            <div className="h-8 w-8 rounded-full bg-muted/20 animate-pulse"></div>
          </div>
          <div className="mt-2 h-8 w-16 bg-muted/20 rounded animate-pulse"></div>
          <div className="mt-2 h-4 w-20 bg-muted/20 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
          </div>
          <div className="mt-2 statistic-value">{value.toLocaleString()}</div>
          {change && (
            <div className="mt-2 flex items-center text-sm">
              {change.type === 'increase' ? (
                <div className="flex items-center text-success-500">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  <span>{change.value}%</span>
                </div>
              ) : (
                <div className="flex items-center text-error-500">
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                  <span>{change.value}%</span>
                </div>
              )}
              <span className="ml-1 text-muted-foreground">from last week</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticCard;