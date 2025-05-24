
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { threeLevelStrategyData, strategySummary } from "@/lib/constants/three-level-strategy";

interface ThreeLevelStrategyTabsProps {
  isCollapsible?: boolean;
  headerText?: string;
}

export const ThreeLevelStrategyTabs = ({ 
  isCollapsible = false, 
  headerText = "Practice these focus areas by playing with three levels of players" 
}: ThreeLevelStrategyTabsProps) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);

  const TabsContentComponent = () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="keypoints">Key Points</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="space-y-3">
          {threeLevelStrategyData.map((strategy, index) => (
            <div key={index} className="flex items-start gap-3">
              <strategy.icon className={`h-4 w-4 ${strategy.iconColor} mt-1 flex-shrink-0`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{strategy.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-200 pt-3">
          <p className="text-xs text-blue-800 italic leading-relaxed">
            {strategySummary}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="keypoints" className="space-y-4">
        <div className="space-y-4">
          {threeLevelStrategyData.map((strategy, index) => (
            <div key={index} className="flex items-start gap-3">
              <strategy.icon className={`h-4 w-4 ${strategy.iconColor} mt-1 flex-shrink-0`} />
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">{strategy.title}</p>
                <ul className="space-y-1">
                  {strategy.bulletPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-200 pt-3">
          <p className="text-xs text-blue-800 italic leading-relaxed">
            {strategySummary}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );

  if (isCollapsible) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-start gap-3 w-full text-left hover:bg-blue-100/50 -m-2 p-2 rounded transition-colors"
        >
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              {headerText}
            </h4>
            {!isExpanded && (
              <p className="text-xs text-blue-700">Click to learn more about this strategy</p>
            )}
          </div>
          <div className="mt-0.5">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-blue-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-600" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="mt-4 ml-8">
            <TabsContentComponent />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            {headerText}
          </h4>
        </div>
      </div>
      
      <div className="ml-8">
        <TabsContentComponent />
      </div>
    </div>
  );
};
