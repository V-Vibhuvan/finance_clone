const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

async function getEmbedding(text, isQuery = false) {
  if (!text) throw new Error("No text provided for embedding");

  const response = await pc.inference.embed({
    model: "llama-text-embed-v2",
    parameters: {
      // Dynamically switch based on the context
      input_type: isQuery ? "query" : "passage", 
    },
    inputs: [String(text)] 
  });
  
  return response.data[0].values;
}

// async function getEmbedding(text) {
//   if (!text) {
//     throw new Error("❌ No text provided for embedding");
//   }

//   const response = await pc.inference.embed({
//     model: "llama-text-embed-v2",
//     parameters: {
//       input_type: "passage",
//     },
//     inputs: [String(text)] 
//   });
//   console.log("EMBED RESPONSE:", response);
//   return response.data[0].values;
// }

module.exports = getEmbedding;