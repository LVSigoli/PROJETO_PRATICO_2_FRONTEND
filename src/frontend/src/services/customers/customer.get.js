import { API } from "../api";

export async function getCustomers() {
  const url = "/clientes";

  const response = await API.get(url);

  return response?.data;
}
