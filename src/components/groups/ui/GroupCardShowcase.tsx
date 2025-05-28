
import { GroupCardDesign1 } from "./GroupCardDesign1";
import { GroupCardDesign2 } from "./GroupCardDesign2";
import { GroupCardDesign3 } from "./GroupCardDesign3";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";
import { GroupCardHybrid2 } from "./GroupCardHybrid2";
import { GroupCardHybrid3 } from "./GroupCardHybrid3";
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "../members/types";

// Mock data for showcase components
type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

const mockGroups: Group[] = [
  {
    id: "mock-1",
    name: "Downtown Tennis Club",
    description: "A competitive tennis group for intermediate to advanced players",
    location: "Downtown Sports Center",
    is_private: false,
    avatar_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop",
    created_by: "mock-user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    max_members: 20,
    member_count: 15,
    skill_level_min: "3.0",
    skill_level_max: "4.5"
  },
  {
    id: "mock-2",
    name: "Beginner's Paddle Club",
    description: "Friendly group for new players to learn and improve",
    location: "Riverside Park",
    is_private: true,
    avatar_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    created_by: "mock-user-2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    max_members: 12,
    member_count: 8,
    skill_level_min: "1.0",
    skill_level_max: "2.5"
  },
  {
    id: "mock-3",
    name: "Elite Competitive League",
    description: "High-level competitive play for advanced players",
    location: "Elite Sports Complex",
    is_private: true,
    avatar_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
    created_by: "mock-user-3",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    max_members: 16,
    member_count: 12,
    skill_level_min: "4.0",
    skill_level_max: "5.0"
  }
];

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
              <GroupCardHybrid1 group={mockGroups[0]} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Hybrid 2: Split Layout</h3>
              <GroupCardHybrid2 group={mockGroups[1]} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Hybrid 3: Horizontal Stats</h3>
              <GroupCardHybrid3 group={mockGroups[2]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
