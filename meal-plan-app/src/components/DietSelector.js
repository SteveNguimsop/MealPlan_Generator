import React from "react";

const DietSelector = ({ selectedDiet, handleDietChange }) => {
  const diets = [
    "Anything",
    "Gluten-free",
    "Paleo",
    "Vegetarian",
    "Vegan",
    "Ketogenic",
  ];

  return (
    <div className="diet-options">
      {diets.map((diet) => (
        <button
          key={diet}
          className={selectedDiet === diet ? "selected" : ""}
          onClick={() => handleDietChange(diet)}
        >
          {diet}
        </button>
      ))}
    </div>
  );
};

export default DietSelector;
