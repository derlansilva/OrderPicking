import api from "./api"


const apiServices = {
    getOrder : async (orderNumber) => {
        const response = await api.get(`/order/${orderNumber}`);

        return response;

    } ,

    changeOrderStatus : async (id , status) => {
        const response = await api.put(`/order/${id}/${status}`)

        return response;
    },
   
}

export default apiServices;