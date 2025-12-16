import { useEffect, useState } from "react";
import { Container } from "../../Components/Container";
import { useAuth } from "../../Hook/useAuth";
import { supabase } from "../../lib/supabaseClient";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";

type Movimentacao = {
  drs_id: string;
  drs_valor: number;
  drs_descricao: string;
  is_paid: boolean;
  drs_dt_lancamento: string;
  drs_dt_pagamento?: string | null;
  tipo: "receita" | "despesa";
};

type DBResponse = {
  drs_id: string;
  drs_valor: number;
  drs_descricao: string;
  is_paid: boolean;
  drs_dt_lancamento: string;
  drs_dt_pagamento?: string | null;
  tipo_receita: {
    tpr_tipo: string;
  };
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const anos = Array.from({ length: 11 }, (_, i) => anoAtual - 5 + i);

  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(anoAtual);

  const saldo = receitas - despesas;

  useEffect(() => {
    document.title = "Dashboard - Sistema Financeiro";
    if (user?.id) {
      fetchDashboard(user.id);
    }
  }, [user, mes, ano]);

  async function fetchDashboard(userId: string) {
    const inicioMes = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fimMes = `${ano}-${String(mes).padStart(2, "0")}-${new Date(
      ano,
      mes,
      0
    ).getDate()}`;

    const { data, error } = await supabase
      .from("despesa_receita")
      .select(`
        drs_id,
        drs_valor,
        drs_descricao,
        is_paid,
        drs_dt_lancamento,
        drs_dt_pagamento,
        tipo_receita ( tpr_tipo )
      `)
      .eq("user_id", userId)
      .gte("drs_dt_lancamento", inicioMes)
      .lte("drs_dt_lancamento", fimMes)
      .order("drs_dt_lancamento", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    let totalReceitas = 0;
    let totalDespesas = 0;

    const mapped: Movimentacao[] = (data as DBResponse[]).map((item) => {
      const tipo = item.tipo_receita.tpr_tipo.toLowerCase() as
        | "receita"
        | "despesa";

      if (tipo === "receita") totalReceitas += item.drs_valor;
      else totalDespesas += item.drs_valor;

      return { ...item, tipo };
    });

    setReceitas(totalReceitas);
    setDespesas(totalDespesas);
    setMovimentacoes(mapped);
  }

  function handleEdit(id: string) {
    navigate(`/movimentacao/editar/${id}`);
  }

  async function handleDelete(id: string) {
    if (!user?.id) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta movimentação?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("despesa_receita")
      .delete()
      .eq("drs_id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    // 🔥 Atualiza tudo corretamente
    fetchDashboard(user.id);
  }

  return (
    <Container>
      {/* HEADER */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>Dashboard</h1>
        {user && <p className={styles.userEmail}>Olá, {user.email}</p>}
      </div>

      {/* FILTROS */}
      <div className={styles.filter}>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {anos.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.receita}`}>
          <span>Receitas</span>
          <strong>R$ {receitas.toFixed(2)}</strong>
        </div>

        <div className={`${styles.card} ${styles.despesa}`}>
          <span>Despesas</span>
          <strong>R$ {despesas.toFixed(2)}</strong>
        </div>

        <div className={`${styles.card} ${styles.saldo}`}>
          <span>Saldo</span>
          <strong>R$ {saldo.toFixed(2)}</strong>
        </div>
      </div>

      {/* TABELA */}
      <div className={styles.movimentacoes}>
        <h2>Movimentações</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {movimentacoes.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Nenhuma movimentação encontrada
                  </td>
                </tr>
              )}

              {movimentacoes.map((mov) => (
                <tr key={mov.drs_id}>
                  <td>
                    {new Date(mov.drs_dt_lancamento).toLocaleDateString("pt-BR")}
                  </td>

                  <td
                    className={
                      mov.tipo === "receita"
                        ? styles.receitaText
                        : styles.despesaText
                    }
                  >
                    {mov.tipo}
                  </td>

                  <td>{mov.drs_descricao}</td>
                  <td>R$ {mov.drs_valor.toFixed(2)}</td>
                  <td>{mov.is_paid ? "Pago" : "Pendente"}</td>

                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(mov.drs_id)}>✏️</button>
                    <button onClick={() => handleDelete(mov.drs_id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
