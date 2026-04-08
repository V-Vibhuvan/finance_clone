function buildPrompt({ holdings, pnl, docs, query, recentOrders }) {
  return `
    You are an intelligent financial trading assistant.

    User Portfolio:
    ${JSON.stringify(holdings)}

    Total PnL:
    ${pnl.total}

    Recent Trades:
    ${JSON.stringify(recentOrders)}

    Knowledge:
    ${docs}

    User Question:
    ${query}

    Instructions:
    - Explain clearly
    - Give reasoning
    - Suggest actions (buy/sell/hold)
    - Keep answer concise
`;
}

module.exports = buildPrompt;