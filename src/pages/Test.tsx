
import React from 'react';
import { Button } from '@/components/ui/button';

const Test = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <Button 
        onClick={handleClick}
        data-testid="test-button"
      >
        Test Button
      </Button>
    </div>
  );
};

export default Test;
