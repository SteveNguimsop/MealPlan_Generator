import React from "react";

const MealPlanGenerator = ({ calories, meals, setCalories, setMeals }) => {
  const handleCaloriesChange = (e) => setCalories(e.target.value);
  const handleMealsChange = (e) => setMeals(e.target.value);

  return (
    <div>
      <h2>Step 2. Enter your calories</h2>
      <input
        type="number"
        value={calories}
        onChange={handleCaloriesChange}
      />{" "}
      kcal
      <select value={meals} onChange={handleMealsChange}>
        {[1, 2, 3, 4].map((mealCount) => (
          <option key={mealCount} value={mealCount}>
            {mealCount} Meals
          </option>
        ))}
      </select>
    </div>
  );
};

export default MealPlanGenerator;
