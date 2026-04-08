import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../index.css";

export default function Holdings() {

    const [holdings, setHoldings] = useState([]);

    const fetchHoldings = async () => {
        const res = await API.get("/holdings");
        setHoldings(res.data.holdings);
    };

    useEffect(() => {
        fetchHoldings();
    }, []);

    const handleDelete = async (id) => {
        await API.delete(`/holdings/${id}`);
        fetchHoldings();
    };

    return (
        <div className="container mt-4">
            <h3 className="page-title">Holdings</h3>
            <div className="app-card app-shadow">
                <table className="table table-hover table-clean">
                    <thead>
                        <tr>
                        <th>Stock</th>
                        <th>Qty</th>
                        <th>Avg</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((h) => (
                        <tr key={h._id}>
                            <td>{h.name}</td>
                            <td>{h.qty}</td>
                            <td>{h.avg}</td>
                            <td>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(h._id)}
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}