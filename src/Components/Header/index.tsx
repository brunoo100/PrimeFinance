import { Link } from "react-router-dom";
import { useState, useEffect} from "react";
import styles from "./header.module.css";
import { useAuth } from "../../Hook/useAuth";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/Context/AuthContext";

export function Header() {
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

async function Sair() {
await logout();
navigate("/");
  // placeholder logout function
//   console.log("Logging out...");
}

  return (
    <>
      <header className={styles.header}>
        <div className={styles.herocontainer}>
          <Link to={user ? "/dashboard" : "/"} className={styles.logo}>
            PrimeFinance
          </Link>

          {/* NAVBAR — DESKTOP */}
          {user && (
            <nav className={styles.nav}>
              <Link to="/dashboard">Home</Link>
              <Link to="/inserir">Inserir  Receitas Despesas</Link>
              <Link to="/contact">Contato</Link>
            </nav>
          )}

          {/* DESKTOP → BOTÃO SAIR */}
          {user && (
            <div className={styles.authDesktop}>
              <button onClick={logout}>Sair</button>
            </div>
          )}

          {/* NÃO LOGADO */}
          {!user && (
            <div className={styles.auth}>
              <Link to="/login">Login</Link>
              <Link to="/register">Registrar</Link>
            </div>
          )}

          {/* MOBILE → HAMBÚRGUER */}
          {user && (
            <button
              className={`${styles.hamburger} ${
                menuOpen ? styles.active : ""
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </header>

      {/* OVERLAY + DRAWER (MOBILE) */}
      {user && (
        <>
          <div
            className={`${styles.overlay} ${
              menuOpen ? styles.show : ""
            }`}
            onClick={() => setMenuOpen(false)}
          />

          <aside
            className={`${styles.drawer} ${
              menuOpen ? styles.open : ""
            }`}
          >
            <nav className={styles.drawerNav}>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/inserir" onClick={() => setMenuOpen(false)}>Inserir  Receitas Despesas</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contato</Link>
            </nav>

            <div className={styles.drawerAuth}>
              <button onClick={Sair}>Sair</button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}