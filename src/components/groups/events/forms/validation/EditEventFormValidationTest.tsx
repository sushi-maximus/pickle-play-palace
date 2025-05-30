
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "../types/eventFormTypes";

interface EditEventFormValidationTestProps {
  event: Event;
}

export const EditEventFormValidationTest = ({ event }: EditEventFormValidationTestProps) => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runValidationTests = () => {
    console.log('=== EDIT EVENT FORM DATE VALIDATION TESTS ===');
    
    // Test 1: Raw database value
    addTestResult(`✓ Raw database event_date: "${event.event_date}"`);
    
    // Test 2: EventDateField conversion logic
    const convertDatabaseDateToInputFormat = (dbDate: string): string => {
      if (!dbDate || typeof dbDate !== 'string') return '';
      
      console.log('Converting database date:', dbDate);
      
      // Handle "MM-DD-YY" format (e.g., "5-30-25")
      const parts = dbDate.split('-');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        const fullYear = year.length === 2 ? `20${year}` : year;
        const paddedMonth = month.padStart(2, '0');
        const paddedDay = day.padStart(2, '0');
        const result = `${fullYear}-${paddedMonth}-${paddedDay}`;
        console.log('Converted to input format:', result);
        return result;
      }
      
      // If already in YYYY-MM-DD format, return as is
      if (dbDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dbDate;
      }
      
      console.log('Unable to parse date format:', dbDate);
      return '';
    };

    const convertedDate = convertDatabaseDateToInputFormat(event.event_date);
    addTestResult(`✓ Converted for HTML input: "${convertedDate}"`);
    
    // Test 3: Check if conversion is working correctly
    if (event.event_date === "5-30-25") {
      const expectedConversion = "2025-05-30";
      const isCorrect = convertedDate === expectedConversion;
      addTestResult(`✓ Expected: "${expectedConversion}", Got: "${convertedDate}", Correct: ${isCorrect}`);
    }
    
    // Test 4: Test reverse conversion
    const convertInputFormatToDatabaseFormat = (inputDate: string): string => {
      if (!inputDate) return '';
      
      console.log('Converting input date to database format:', inputDate);
      
      const [year, month, day] = inputDate.split('-');
      const shortYear = year.slice(2); // Convert 2025 to 25
      const result = `${parseInt(month)}-${parseInt(day)}-${shortYear}`;
      console.log('Converted to database format:', result);
      return result;
    };

    const backToDbFormat = convertInputFormatToDatabaseFormat(convertedDate);
    addTestResult(`✓ Back to DB format: "${backToDbFormat}"`);
    
    // Test 5: Check if round-trip works
    const isRoundTripCorrect = backToDbFormat === event.event_date;
    addTestResult(`✓ Round-trip correct: ${isRoundTripCorrect}`);
    
    // Test 6: Test HTML date input display
    const testInput = document.createElement('input');
    testInput.type = 'date';
    testInput.value = convertedDate;
    addTestResult(`✓ HTML input value: "${testInput.value}"`);
    addTestResult(`✓ HTML input display should show: May 30, 2025`);
    
    console.log('=== VALIDATION TESTS COMPLETE ===');
  };

  return (
    <Card className="p-6 m-4">
      <h3 className="text-lg font-semibold mb-4">EditEventForm Date Validation Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Current Event Data:</h4>
          <div className="space-y-2">
            <Badge variant="outline">
              Event Title: {event.event_title}
            </Badge>
            <Badge variant="outline">
              Raw Date: {event.event_date}
            </Badge>
            <Badge variant="outline">
              Time: {event.event_time}
            </Badge>
          </div>
        </div>

        <Button onClick={runValidationTests} className="w-full">
          Run Date Conversion Tests
        </Button>

        {testResults.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm space-y-1 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-xs">{result}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
