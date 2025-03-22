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
    "Personalization": "#bbcfd0",
    "Labeling": "#d1f7d9",
    "Fortune-Telling": "#e9def8",
    "Magnification": "#e8c4dd",
    "Mind Reading": "#d1cfe3",
    "All-Or-Nothing Thinking": "#d2bcca",
    "Overgeneralizationt": "#e8c7ba",
    "Mental Filter": "#d4c7e5",
    "Emotional Reasoning": "#e3c2f4",
    "Should Statements": "#f7d4b9",
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
