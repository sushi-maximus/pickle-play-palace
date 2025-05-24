
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PrivacySettingsCard = () => {
  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Show phone number</Label>
                <p className="text-xs text-gray-600">Allow group members to see your phone number</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Show birthday</Label>
                <p className="text-xs text-gray-600">Allow others to see your birthday</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Show DUPR rating</Label>
                <p className="text-xs text-gray-600">Display your DUPR rating on your profile</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Group Discovery */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900">Group Discovery</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-normal">Who can find you</Label>
              <Select defaultValue="everyone">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="friends">Friends only</SelectItem>
                  <SelectItem value="nobody">Nobody</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">Control who can discover and invite you to groups</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Auto-join public groups</Label>
                <p className="text-xs text-gray-600">Automatically join groups that match your skill level</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
