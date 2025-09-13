import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  trend: string;
  trendType: "up" | "down";
  icon: ReactNode;
  iconColor: string;
}

const StatCard = ({ title, value, unit, trend, trendType, icon, iconColor }: StatCardProps) => {
  return (
    <Card className="hover:border-primary/50 transition-all duration-300 group" data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconColor} rounded-lg group-hover:opacity-80 transition-opacity`}>
            {icon}
          </div>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1" data-testid={`stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <div className={`flex items-center text-sm ${trendType === "up" ? "text-green-400" : "text-red-400"}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            {trendType === "up" ? (
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            ) : (
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            )}
          </svg>
          <span data-testid={`stat-trend-${title.toLowerCase().replace(/\s+/g, '-')}`}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
