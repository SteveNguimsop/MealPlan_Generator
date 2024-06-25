import React, { useState } from "react";
import "./App.css";
import DietSelector from "./components/DietSelector";
import MealPlanGenerator from "./components/MealPlanGenerator";
import MealPlanDisplay from "./components/MealPlanDisplay";

function App() {
  const [calories, setCalories] = useState(1500);
  const [meals, setMeals] = useState(4);
  const [diet, setDiet] = useState("Anything");
  const [mealPlan, setMealPlan] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [warning, setWarning] = useState(""); // Add warning state

  const handleDietChange = (dietType) => setDiet(dietType);

  const fetchOpenAiResponse = async (input) => {
    const url = "https://open-ai21.p.rapidapi.com/conversationpalm2";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "934f571cd1mshb52995ad5f48e52p14f3edjsn0b4eb04433c0",
        "x-rapidapi-host": "open-ai21.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text(); // Get response as text
      return result;
    } catch (error) {
      console.error("Error fetching response:", error);
      return JSON.stringify({ message: "Error fetching response" });
    }
  };

  const highlightKeywords = (text) => {
    const keywords = ["Breakfast", "Lunch", "Dinner", "Snacks", "Snack"];
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`,
    );
  };

  const generateMealPlan = async () => {
    // Validate calorie input
    if (calories > 5000) {
      setWarning(
        "High calories (e.g., 5,000+ calories daily) can lead to significant health problems over time. Please enter a more reasonable calorie number.",
      );
      return;
    }

    setLoading(true); // Set loading to true when the request starts
    setMealPlan(null); // Clear previous meal plan
    setResponseMessage(""); // Clear previous response message
    setWarning(""); // Clear warning message

    // Construct the input message for OpenAI
    const openAiInput = `Please provide a meal plan for a ${diet} diet with ${calories} calories, split into ${meals} meals. Please be really short and straight to the point. Do not add no additional explanations just the meals with the calories next to it base of the Diet`;
    // Fetch response from OpenAI
    const openAiResponse = await fetchOpenAiResponse(openAiInput);

    // Handle the response
    console.log("OpenAI Response:", openAiResponse);

    try {
      // Try to parse the response assuming it's JSON
      const parsedResponse = JSON.parse(openAiResponse);

      // Extract the meal plan from the response
      if (parsedResponse.BOT) {
        const mealPlanWithHighlights = parsedResponse.BOT.split("\n").map(
          (meal) => highlightKeywords(meal),
        );
        setMealPlan(mealPlanWithHighlights);
        setResponseMessage("Meal plan generated successfully");
      } else if (parsedResponse.message) {
        // Handle specific message from API
        console.error("OpenAI response error:", parsedResponse.message);
        setResponseMessage(parsedResponse.message);
        setMealPlan([]);
      } else {
        console.error("Unexpected OpenAI response:", parsedResponse);
        setResponseMessage("Unexpected response format");
        setMealPlan([]);
      }
    } catch (error) {
      // If parsing fails, log the error and handle accordingly
      console.error("Error parsing OpenAI response:", error);
      setMealPlan([]);
      setResponseMessage(`Error parsing response: ${openAiResponse}`);
    }

    setLoading(false); // Set loading to false when the request completes
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Upgrade your Diet</h1>
        <p>With Personalized Meal Plans</p>
      </header>
      <main>
        <section className="step">
          <h2>Step 1. Select a diet</h2>
          <DietSelector
            selectedDiet={diet}
            handleDietChange={handleDietChange}
          />
        </section>
        <section className="step">
          <MealPlanGenerator
            calories={calories}
            meals={meals}
            setCalories={setCalories}
            setMeals={setMeals}
          />
        </section>
        {warning && <p className="warning">{warning}</p>}
        <button onClick={generateMealPlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Meal Plan"}
        </button>
        {loading && <p>Loading...</p>}
        {mealPlan && mealPlan.length > 0 ? (
          <div>
            <h2>Generated Meal Plan:</h2>
            <ul>
              {mealPlan.map((meal, index) => (
                <li
                  key={index}
                  style={
                    index === 0
                      ? { fontWeight: "bold", fontSize: "1.2em" }
                      : index === mealPlan.length - 1
                        ? { fontSize: "0.8em" }
                        : {}
                  }
                >
                  {index === 0 ? (
                    <strong dangerouslySetInnerHTML={{ __html: meal }}></strong>
                  ) : index === mealPlan.length - 1 ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: `NB: ${meal}` }}
                    ></span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: meal }}></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No meal plan generated.</p>
        )}
        <p>Response: {responseMessage}</p>
        <div>
          <h3>Raw Response:</h3>
          <pre>{responseMessage}</pre>
        </div>
      </main>
    </div>
  );
}

export default App;
