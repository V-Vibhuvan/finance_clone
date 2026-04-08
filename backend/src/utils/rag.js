const index = require("./pinecone");
const axios = require("axios");

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST; 

async function storeEmbedding(id, vector, metadata) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("❌ Invalid vector");
  }

  const payload = {
    vectors: [
      {
        id: String(id),
        values: vector,
        metadata: metadata || {}
      }
    ]
  };

  console.log("UPSERT PAYLOAD:", payload.vectors.length);

  await axios.post(
    `https://${PINECONE_HOST}/vectors/upsert`,
    payload,
    {
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  console.log("✅ UPSERT DONE");
}

// rag.js
// async function storeEmbedding(id, vector, metadata) {
//   if (!id) throw new Error("storeEmbedding Error: 'id' is missing.");
//   if (!vector || !Array.isArray(vector)) throw new Error("storeEmbedding Error: 'vector' is invalid.");

//   try {
//     await index.namespace("").upsert([
//       {
//         id: String(id),
//         values: vector,
//         metadata: metadata || {}
//       }
//     ]);

//     console.log(`UPSERT DONE for ID: ${id}`);
//   } catch (error) {
//     console.error("Pinecone SDK Upsert failed:", error.message);
//     throw error;
//   }
// }

async function queryRAG(vector) {
  const result = await index.query({
    vector,
    topK: 3,
    includeMetadata: true
  });

  if (!result.matches || result.matches.length === 0) return "";

  return result.matches
    .map(m => m.metadata?.text || "")
    .join("\n");
}

module.exports = { storeEmbedding, queryRAG };

// const {ChromaClient} = require("chromadb");

// const client = new ChromaClient();

// let collections;

// async function initRAG(){
//     collections = await client.getOrCreateCollection({
//         name:"finance_docs"
//     });
// }

// async function queryRAG(queryEmbedding){
//     const results = await collections.query({
//         queryEmbeddings: [queryEmbedding],
//         nResults: 3
//     });
//     return results.documents.flat().join("\n");
// }

// module.exports = {initRAG, queryRAG};
