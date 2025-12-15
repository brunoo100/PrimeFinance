import styles from"./container.module.css"
import type { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
}

export  function Container( { children }: ContainerProps) {
 return (
   <div className={styles.container}>
     {children}
   </div>
 );
}