const { storeEmbedding } = require("./rag");
const getEmbedding = require("./embedding");

let loaded = false;

async function loadData() {
    if (loaded) return;

    const docs = [
        "Diversification reduces risk by spreading investments.",
        "Avoid putting all money into a single stock.",
        "Long-term investing generally yields better returns.",
        "Emotional trading leads to losses."
    ];

    for (let i = 0; i < docs.length; i++) {
        const vector = await getEmbedding(docs[i]);

        await storeEmbedding(`doc-${i}`, vector, {
            text: docs[i]
        });
    }

    console.log("Data inserted into Pinecone");

    loaded = true;
}

module.exports = loadData;