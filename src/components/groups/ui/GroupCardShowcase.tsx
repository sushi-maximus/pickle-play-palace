
import { GroupCardDesign1 } from "./GroupCardDesign1";
import { GroupCardDesign2 } from "./GroupCardDesign2";
import { GroupCardDesign3 } from "./GroupCardDesign3";

export const GroupCardShowcase = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Group Card Design Options
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Design 1: Image Overlay</h2>
            <GroupCardDesign1 />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Design 2: Clean Minimal</h2>
            <GroupCardDesign2 />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Design 3: Stats & Gradient</h2>
            <GroupCardDesign3 />
          </div>
        </div>
      </div>
    </div>
  );
};
