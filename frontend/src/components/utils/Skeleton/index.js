// Styles
import styles from "./styles.module.css";

export const Skeleton = ({ quantity = 1, size = "bg" }) => {
  return (
    <>
      {Array.from({ length: quantity }).map((_, index) => (
        <div className={styles.container}>
          <div key={index} className={`${styles.line} ${styles[size]}`}></div>
        </div>
      ))}
    </>
  );
};
