import React from "react";

const MealPlanDisplay = ({ mealPlan, caloriesPerMeal }) => {
  return (
    <div className="generated-meal-plan">
      <h2>Generated Meal Plan</h2>
      <div className="meal-plan-content">
        {mealPlan
          ? mealPlan.map((plan, index) => (
              <div key={index}>
                <h3>
                  {plan.meal} - {caloriesPerMeal} kcal
                </h3>
                <ul>
                  {plan.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))
          : "Nothing generated yet"}
      </div>
    </div>
  );
};

export default MealPlanDisplay;
