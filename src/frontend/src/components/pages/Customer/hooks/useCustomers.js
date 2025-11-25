// External Libraries
import { useEffect, useState } from "react";

// Utils
import { makeInitialCustomer } from "./utils";

// Services
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../../../../services";

export function useCustomers() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(makeInitialCustomer);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const response = await getCustomers();
      setCustomers(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(customerId) {
    try {
      await deleteCustomer(customerId);
    } catch (error) {
      console.error(error);
    } finally {
      fetchCustomers();
    }
  }

  async function handleSaveCustomer() {
    try {
      if (customer.id) {
        await updateCustomer(customer.id, customer);
      } else {
        await createCustomer(customer);
      }

      setCustomer(makeInitialCustomer);
    } catch (error) {
      console.error(error);
    } finally {
      fetchCustomers();
    }
  }

  function handleSelectCustomer(customer) {
    setCustomer(customer);
  }

  function handleCustomerChange(field, value) {
    setCustomer({ ...customer, [field]: value });
  }

  return {
    loading,
    customer,
    customers,
    handleDelete,
    handleSaveCustomer,
    handleSelectCustomer,
    handleCustomerChange,
  };
}
