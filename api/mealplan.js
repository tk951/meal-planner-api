const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Use the OpenAI API key stored in environment variables
  })
);

// CORS configuration to allow requests from your website
const allowedOrigins = ["https://your-website.com", "https://www.your-website.com"];

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS method (pre-flight requests for CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle POST method (to process meal plan request)
  if (req.method === "POST") {
    try {
      // Destructure the request body to get the prompt
      const { adults, children, specificNeeds, cookingSkill, budget, timeAvailable, email } = req.body;

      // Create a prompt based on form data (you can modify the structure to your needs)
      const prompt = `Generate a weekly meal plan for:
        Adults: ${adults}
        Children: ${children}
        Specific Needs: ${specificNeeds.join(", ")}
        Cooking Skill: ${cookingSkill}
        Budget: ${budget}
        Time Available: ${timeAvailable}`;

      // Call OpenAI API with the generated prompt
      const response = await openai.createCompletion({
        model: "text-davinci-003",  // Use the model you're working with
        prompt: prompt,
        max_tokens: 1000, // Set the response length, adjust if necessary
        temperature: 0.7, // Adjust creativity level (higher = more creative)
      });

      // Send the generated meal plan back to the frontend
      const mealPlan = response.data.choices[0].text;

      // Optionally, you can integrate email sending logic here using a service like SendGrid or Nodemailer

      // Respond with the meal plan
      res.status(200).json({ mealPlan, email });
    } catch (error) {
      // Handle errors (API issues, etc.)
      console.error("Error generating meal plan:", error);
      res.status(500).json({ error: "Failed to generate meal plan. Please try again later." });
    }
  } else {
    // Handle any non-POST methods (e.g., GET)
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
