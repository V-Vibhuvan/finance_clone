import {io} from "socket.io-client";

export const createSocket = () => {
    return io("http://localhost:3002", {
        auth: {
            token: localStorage.getItem("token"),
        },
    });
};