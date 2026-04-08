import {io} from "socket.io-client";

export const createSocket = () => {
    return io("https://finance-clone-4azm.onrender.com", {
        auth: {
            token: localStorage.getItem("token"),
        },
    });
};