
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Group, MemberWithProfile } from "@/types/group";
import { GroupAboutTab } from "./GroupAboutTab";
import { GroupMembersTab } from "./GroupMembersTab";
import { GroupSettingsTab } from "./GroupSettingsTab";

interface GroupDetailTabsProps {
  group: Group;
  members: MemberWithProfile[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  isCurrentUser: (userId: string) => boolean;
}

export function GroupDetailTabs({
  group,
  members,
  activeTab,
  setActiveTab,
  isAdmin,
  isCurrentUser
}: GroupDetailTabsProps) {
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
      </Tabs>

      <TabsContent value="about" className="pt-4">
        <GroupAboutTab group={group} />
      </TabsContent>
      
      <TabsContent value="members" className="pt-4">
        <GroupMembersTab members={members} isAdmin={isAdmin} isCurrentUser={isCurrentUser} />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="settings" className="pt-4">
          <GroupSettingsTab group={group} />
        </TabsContent>
      )}
    </>
  );
}
