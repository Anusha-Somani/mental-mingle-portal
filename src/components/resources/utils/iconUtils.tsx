
import React from 'react';

// Helper function to create JSX elements from Lucide icons
export const createIconElement = (IconComponent: any, color: string = "currentColor") => {
  return <IconComponent color={color} />;
};
