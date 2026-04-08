const axios = require("axios");

async function callGroq(prompt) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        // Updated to the current standard Llama 3.1 8B model on Groq
        model: "llama-3.1-8b-instant", 
        messages: [
          {
            role: "user",
            content: String(prompt)
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    return res.data.choices[0].message.content;
    
  } catch (error) {
    // This will catch the 400 error and print Groq's EXACT rejection reason
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error("❌ Groq API Error:", errorMessage);
    
    // Optional: Throw the error again if you want the parent function to handle it
    throw new Error(`Groq API failed: ${errorMessage}`);
  }
}

module.exports = callGroq;