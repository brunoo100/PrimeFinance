// import { Header } from "../../Components/Header";
import styles from "./home.module.css";
import { Container } from "../../Components/Container";

export default function Home() {
 return (
<main className={styles.main}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <div className={styles.heroContent}>
            <h1>Controle suas finanças com facilidade</h1>
            <p>Organize gastos, receitas e metas em um só lugar</p>
            <button className={styles.cta}>Começar agora</button>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <Container>
        <section className={styles.about}>
          <h2>Bem-vindo ao PrimeFinance</h2>
          <p>
            Sua solução completa para gerenciamento financeiro pessoal.
            Acompanhe despesas, receitas e investimentos de forma simples
            e eficiente.
          </p>
        </section>
      </Container>
    </main>
 );
}