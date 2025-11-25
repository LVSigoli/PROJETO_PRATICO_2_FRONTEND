// Styles
import styles from "./styles.module.css";

export const CustomerItem = ({ customer, onEditClick, onDeleteClick }) => {
  // Functions
  function handleEditClick() {
    if (onEditClick) onEditClick(customer);
  }

  function handleDeleteClick() {
    if (onDeleteClick) onDeleteClick(customer.id);
  }

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <div className={styles["information-wrapper"]}>
          <p className={styles.label}>Nome:</p>
          {customer?.nome}{" "}
        </div>

        <div className={styles["information-wrapper"]}>
          <p className={styles.label}>e-mal:</p>
          {customer?.email}{" "}
        </div>

        <div className={styles["information-wrapper"]}>
          <p className={styles.label}>telefone:</p>
          {customer?.telefone}{" "}
        </div>
      </div>

      <div className={styles["information-wrapper"]}>
        <button
          type="button"
          className={styles.edit}
          onClick={() => handleEditClick(customer)}
        >
          Editar
        </button>

        <button
          type="button"
          className={styles.delete}
          onClick={handleDeleteClick}
        >
          Remover
        </button>
      </div>
    </div>
  );
};
