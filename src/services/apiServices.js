import api from "./api"


const apiServices = {
    getOrder : async (orderNumber) => {
        const response = await api.get(`/order/${orderNumber}`);

        return response;

    } ,

    changeOrderConfered : async (id) => {
        const response = await api.put(`/order/${id}`)

        return response;
    },
    changeOrderFinish : async (id) => {
        const response = await api.put(`/order/completed/${id}`)

        return response;
    }
}

export default apiServices;