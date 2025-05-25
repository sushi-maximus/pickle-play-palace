
import { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, Image, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TextInputComparisonProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

const TextInputComparisonComponent = ({ user }: TextInputComparisonProps) => {
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [content3, setContent3] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-semibold">Text Input Comparison</h2>
      
      {/* Option 1: FacebookCommentForm Style */}
      <Card className="p-4">
        <h3 className="text-md font-medium mb-3">Option 1: FacebookCommentForm Style</h3>
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user.avatar_url || undefined} alt={`${user.first_name} ${user.last_name}`} />
            <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <input
              type="text"
              value={content1}
              onChange={(e) => setContent1(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
            />
          </div>
        </div>
      </Card>

      {/* Option 2: CreatePostForm2 Style */}
      <Card className="p-4">
        <h3 className="text-md font-medium mb-3">Option 2: CreatePostForm2 Style</h3>
        <Input
          value={content2}
          onChange={(e) => setContent2(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full rounded-full border-gray-300"
        />
      </Card>

      {/* Option 3: FacebookCreatePost Style */}
      <Card className="p-4">
        <h3 className="text-md font-medium mb-3">Option 3: FacebookCreatePost Style</h3>
        <div className="space-y-3">
          {/* Create Post Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-left px-4 py-3 rounded-full transition-colors duration-200 text-sm min-h-[44px] touch-manipulation"
              >
                What's on your mind, {user.first_name}?
              </button>
            ) : (
              <div className="flex-1">
                <Textarea
                  value={content3}
                  onChange={(e) => setContent3(e.target.value)}
                  placeholder={`What's on your mind, ${user.first_name}?`}
                  className="w-full border-none bg-transparent resize-none focus:ring-0 focus:border-none p-0 text-sm min-h-[80px] placeholder:text-gray-500"
                />
              </div>
            )}
          </div>

          {/* Expanded Actions */}
          {isExpanded && (
            <div className="space-y-3">
              {/* Media Options */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200 p-2 rounded-lg hover:bg-green-50 min-h-[44px] touch-manipulation">
                    <Image className="h-5 w-5" />
                    <span className="text-sm font-medium hidden sm:inline">Photo</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50 min-h-[44px] touch-manipulation">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm font-medium hidden sm:inline">Camera</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent3("");
                    }}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 min-h-[44px] px-4 touch-manipulation"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    disabled={!content3.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 min-h-[44px] touch-manipulation disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Post</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-4 bg-blue-50">
        <h3 className="text-md font-medium mb-2">Summary</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Option 1:</strong> Simple input with avatar, clean border styling</li>
          <li><strong>Option 2:</strong> Clean rounded input, minimal styling</li>
          <li><strong>Option 3:</strong> Expandable rich text area with actions, most feature-rich</li>
        </ul>
      </Card>
    </div>
  );
};

export const TextInputComparison = memo(TextInputComparisonComponent);
