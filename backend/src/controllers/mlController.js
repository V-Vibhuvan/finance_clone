const axios = require("axios");

const stockMap = {
  TCS: "TCS.NS",
  INFY: "INFY.NS",
  HDFC: "HDFCBANK.NS",
  ICICI: "ICICIBANK.NS",
  SBIN: "SBIN.NS",
  RELIANCE: "RELIANCE.NS",
  WIPRO: "WIPRO.NS",
  HCL: "HCLTECH.NS",
  AXIS: "AXISBANK.NS",
  KOTAK: "KOTAKBANK.NS",
  ITC: "ITC.NS",
  LT: "LT.NS",
  MARUTI: "MARUTI.NS",
  TITAN: "TITAN.NS",
  BAJAJ: "BAJFINANCE.NS",
  ADANI: "ADANIENT.NS",
  ONGC: "ONGC.NS",
  NTPC: "NTPC.NS",
  POWERGRID: "POWERGRID.NS",
  COALINDIA: "COALINDIA.NS"
};

const getRisk = async (req, res) => {
  try {
    const { stock } = req.body;

    const ticker = stockMap[stock];

    const response = await axios.post("http://127.0.0.1:5000/predict", {
      ticker
    });

    res.json({
      stock,
      risk: response.data.risk
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "ML API failed" });
  }
};

module.exports = { getRisk };