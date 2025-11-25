import { API } from "../api";

export async function deleteCustomer(customerId) {
  const url = `/clientes/${customerId}`;

  const response = await API.delete(url);

  return response?.status;
}
