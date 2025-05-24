
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PreferencesCard = () => {
  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Display</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-normal">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-normal">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Activity Preferences */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900">Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Auto-refresh feeds</Label>
                <p className="text-xs text-gray-600">Automatically update group feeds</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Sound notifications</Label>
                <p className="text-xs text-gray-600">Play sounds for new messages and activity</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-normal">Default post visibility</Label>
              <Select defaultValue="group">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group members only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
