import { API } from "../api";

export async function updateCustomer(customerId, customer) {
  const url = `clientes/${customerId}`;

  const response = await API.put(url, customer);

  return response?.status;
}
