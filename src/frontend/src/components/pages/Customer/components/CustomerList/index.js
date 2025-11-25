// Components
import { CustomerItem } from "../CustomerItem";
import { Skeleton } from "../../../../utils/Skeleton";

// Styles
import styles from "./styles.module.css";

export const CustomerList = ({ customers, isLoading, onEdit, onDelete }) => {
  //Functions
  function renderCustomers() {
    if (isLoading) return <Skeleton quantity={3} size="md" />;

    return customers.map((customer) => (
      <CustomerItem
        key={customer.id}
        customer={customer}
        onEditClick={onEdit}
        onDeleteClick={onDelete}
      />
    ));
  }

  return (
    <div className={styles.container}>
      <div className={styles["header-container"]}>Lista de Clientes</div>

      {renderCustomers()}
    </div>
  );
};
