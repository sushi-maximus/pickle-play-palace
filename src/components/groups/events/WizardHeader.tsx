
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export const WizardHeader = ({ currentStep, totalSteps, title }: WizardHeaderProps) => {
  const navigate = useNavigate();
  const { id: groupId } = useParams<{ id: string }>();

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(`/groups/${groupId}`);
    } else {
      // Back button will be handled by parent component
      window.history.back();
    }
  };

  const handleCancel = () => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-60 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-gray-900">
              Step {currentStep} of {totalSteps}: {title}
            </h1>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100"
          aria-label="Cancel"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
