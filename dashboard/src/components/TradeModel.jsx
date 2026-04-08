import React, { useEffect, useState } from "react";
import API from "../api/api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

export default function TradeModal({ open, onClose, stock }) {
  const [mode, setMode] = useState("BUY");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (stock?.price) {
      setPrice(stock.price);
    }
  }, [stock]);

  const handleTrade = async () => {
    try {
      await API.post("/orders", {
        name: stock.name,
        qty: Number(qty),
        price: Number(price),
        mode
      });

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">

      <DialogTitle className="fw-semibold">
        Trade {stock?.name}
      </DialogTitle>

      <DialogContent>

        {/* BUY / SELL */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <ToggleButton value="BUY" color="success">
            BUY
          </ToggleButton>
          <ToggleButton value="SELL" color="error">
            SELL
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Quantity */}
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="dense"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* Price */}
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="dense"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          color={mode === "BUY" ? "success" : "error"}
          onClick={handleTrade}
        >
          {mode}
        </Button>
      </DialogActions>

    </Dialog>
  );
}