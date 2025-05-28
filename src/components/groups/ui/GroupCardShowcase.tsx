
import { GroupCardDesign1 } from "./GroupCardDesign1";
import { GroupCardDesign2 } from "./GroupCardDesign2";
import { GroupCardDesign3 } from "./GroupCardDesign3";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";
import { GroupCardHybrid2 } from "./GroupCardHybrid2";
import { GroupCardHybrid3 } from "./GroupCardHybrid3";

export const GroupCardShowcase = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Group Card Design Options
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Original Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Design 1: Image Overlay</h3>
              <GroupCardDesign1 />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Design 2: Clean Minimal</h3>
              <GroupCardDesign2 />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Design 3: Stats & Gradient</h3>
              <GroupCardDesign3 />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hybrid Designs</h2>
          <p className="text-gray-600 mb-6">Combining image overlay from Design 1 with stats from Design 3</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Hybrid 1: Stats on Image</h3>
              <GroupCardHybrid1 />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Hybrid 2: Split Layout</h3>
              <GroupCardHybrid2 />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Hybrid 3: Horizontal Stats</h3>
              <GroupCardHybrid3 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
