import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Positions() {

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        API.get("/positions").then(res => {
            setPositions(res.data.positions);
        });
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="page-title">Positions</h3>
            <div className="app-card app-shadow">
                <table className="table table-hover table-clean">
                    <thead>
                        <tr>
                        <th>Stock</th>
                        <th>Qty</th>
                        <th>Avg</th>
                        <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((p, i) => (
                        <tr key={i}>
                            <td>{p.name}</td>
                            <td>{p.qty}</td>
                            <td>{p.avg}</td>
                            <td>{p.price}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}