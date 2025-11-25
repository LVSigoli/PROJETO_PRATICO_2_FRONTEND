// Components
import { CustomerForm } from "./components/CustomerForm";
import { CustomerList } from "./components/CustomerList";

// Hooks
import { useCustomers } from "./hooks/useCustomers";

//Styles
import styles from "./styles.module.css";

export const Customers = () => {
  // Hooks
  const {
    isLoading,
    customer,
    customers,
    handleDelete,
    handleSaveCustomer,
    handleCustomerChange,
    handleSelectCustomer,
  } = useCustomers();

  return (
    <div className={styles.container}>
      <div className={styles["header-container"]}>Clientes</div>

      <div className={styles.content}>
        <CustomerList
          isLoading={isLoading}
          customers={customers}
          onDelete={handleDelete}
          onEdit={handleSelectCustomer}
        />

        <CustomerForm
          customer={customer}
          onChange={handleCustomerChange}
          onSave={handleSaveCustomer}
        />
      </div>
    </div>
  );
};
