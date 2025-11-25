import { API } from "../api";

export async function createCustomer(customer) {
  const url = "/clientes";

  const response = await API.post(url, customer);

  return response?.status;
}
