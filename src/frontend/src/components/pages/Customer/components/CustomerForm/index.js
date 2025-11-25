// Styles
import styles from "./styles.module.css";

export const CustomerForm = ({ customer, onChange, onSave }) => {
  function handleSubmit(event) {
    event.preventDefault();
    onSave();
  }

  const isEdit = Boolean(customer.id);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles["header-container"]}>
        {isEdit ? "Editar Cliente" : "Novo Cliente"}
      </div>

      <input
        placeholder="Nome"
        value={customer.nome}
        className={styles.input}
        onChange={(e) => onChange("nome", e.target.value)}
      />

      <input
        placeholder="Email"
        value={customer.email}
        className={styles.input}
        onChange={(e) => onChange("email", e.target.value)}
      />

      <input
        placeholder="Telefone"
        className={styles.input}
        value={customer.telefone}
        onChange={(e) => onChange("telefone", e.target.value)}
      />

      <button className={styles.submit} type="submit">
        {isEdit ? "Salvar alterações" : "Criar"}
      </button>
    </form>
  );
};
