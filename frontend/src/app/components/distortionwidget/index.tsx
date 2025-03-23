"use client";
import React from "react";

export type DistortionTrait = {
  name: string;
  active: boolean;
};

interface DistortionWidgetProps {
  distortionTraits: DistortionTrait[];
}

const DistortionWidget: React.FC<DistortionWidgetProps> = ({ distortionTraits }) => {
    //10 cognitive distortions
  const colorMap: Record<string, string> = {
    "Personalization": "#D3CEFF",
    "Labeling": "#ACC5F4",
    "Fortune-telling": "#96E0E4",
    "Magnification": "#AEC8B2",
    "Mind Reading": "#C8DC77",
    "All-or-nothing thinking": "#FDB745",
    "Overgeneralization": "#FFD1A0",
    "Mental filter": "#FF8747",
    "Emotional Reasoning": "#FF6B5B",
    "Should statements": "#FF8190",
  };

  // Filter out "No Distortion" and limit to 10 traits
  const filteredTraits = distortionTraits
    .filter(trait => trait.name !== "No Distortion")
    .slice(0, 10);

  // Split into two equal rows of 5
  const firstRow = filteredTraits.slice(0, 5);
  const secondRow = filteredTraits.slice(5, 10);

  // Function to get background color
  const getBackgroundColor = (traitName: string) => {
    console.log(`Trait: ${traitName}, Color: ${colorMap[traitName] || "#d9d9d9"}`);
    return colorMap[traitName] || "#d9d9d9";
  };

  return (
    <div className="w-full p-1 bg-transparent">

      {/* First Row */}
      <div className="flex justify-end w-full mt-15 gap-1.5">
        {firstRow.map((trait, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: getBackgroundColor(trait.name),
              opacity: trait.active ? 1 : 0.4,
            }}
            title={trait.name}
          ></div>
        ))}
      </div>

      {/* Second Row */}
      <div className="flex justify-end w-full my-2 gap-1.5">
        {secondRow.map((trait, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: getBackgroundColor(trait.name),
              opacity: trait.active ? 1 : 0.4,
            }}
            title={trait.name}>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistortionWidget;
