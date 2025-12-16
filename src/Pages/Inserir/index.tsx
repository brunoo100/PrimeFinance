import styles from "./inserir.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useAuth } from "../../Hook/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

type TipoReceita = {
  tpr_id: string;
  tpr_tipo: string;
};

/* =======================
   Schema Zod
======================= */
const inserirSchema = z
  .object({
    descricao: z.string().min(1, "Descrição obrigatória"),
    valor: z.coerce.number().positive("Valor deve ser maior que zero").pipe(z.number()),
    tpr_id: z.string().uuid("Selecione um tipo"),
    is_paid: z.boolean(),
    drs_dt_lancamento: z.string().min(1, "Informe a data de lançamento"),
    drs_dt_pagamento: z.string().optional(),
  })
  .refine(
    (data) => !data.is_paid || (data.is_paid && !!data.drs_dt_pagamento),
    {
      message: "Informe a data de pagamento",
      path: ["drs_dt_pagamento"],
    }
  );

type InserirData = z.infer<typeof inserirSchema>;
type InserirInput = z.input<typeof inserirSchema>;

export default function Inserir() {
  const { user } = useAuth();
  const [tipoRecDesp, setTipoRecDesp] = useState<TipoReceita[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InserirInput, any, InserirData>({
    resolver: zodResolver(inserirSchema),
    defaultValues: { is_paid: false },
  });

  const isPaid = watch("is_paid");

  // Busca tipos de receita/despesa
  useEffect(() => {
    document.title = "Inserir - Sistema Financeiro";

    async function fetchTipos() {
      const { data, error } = await supabase
        .from("tipo_receita")
        .select("tpr_id, tpr_tipo")
        .order("tpr_tipo");

      if (error) {
        console.error(error);
        return;
      }

      setTipoRecDesp(data ?? []);
    }

    fetchTipos();
  }, []);

  // Submit do formulário
  const onSubmit = handleSubmit(async (data) => {
    if (!user) {
      alert("Usuário não autenticado");
      return;
    }

    const { error } = await supabase.from("despesa_receita").insert({
      drs_descricao: data.descricao,
      drs_valor: data.valor,
      tpr_id: data.tpr_id,
      is_paid: data.is_paid,
      drs_dt_lancamento: data.drs_dt_lancamento,
      drs_dt_pagamento: data.is_paid ? data.drs_dt_pagamento : null,
      user_id: user.id,
    });

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    reset(); // Limpa o formulário
    alert("Registro salvo com sucesso!");
  });

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h1>Inserir Receita / Despesa</h1>

        {/* DESCRIÇÃO */}
        <div className={styles.field}>
          <label>Descrição</label>
          <input {...register("descricao")} />
          {errors.descricao && (
            <span className={styles.error}>{errors.descricao.message}</span>
          )}
        </div>

        {/* VALOR */}
        <div className={styles.field}>
          <label>Valor</label>
          <input type="number" step="0.01" {...register("valor")} />
          {errors.valor && (
            <span className={styles.error}>{errors.valor.message}</span>
          )}
        </div>

        {/* TIPO */}
        <div className={styles.field}>
          <label>Tipo</label>
          <select {...register("tpr_id")}>
            <option value="">Selecione</option>
            {tipoRecDesp.map((tipo) => (
              <option key={tipo.tpr_id} value={tipo.tpr_id}>
                {tipo.tpr_tipo}
              </option>
            ))}
          </select>
          {errors.tpr_id && (
            <span className={styles.error}>{errors.tpr_id.message}</span>
          )}
        </div>

        {/* DATA DE LANÇAMENTO */}
        <div className={styles.field}>
          <label>Data de lançamento</label>
          <input type="date" {...register("drs_dt_lancamento")} />
          {errors.drs_dt_lancamento && (
            <span className={styles.error}>
              {errors.drs_dt_lancamento.message}
            </span>
          )}
        </div>

        {/* PAGO */}
        <div className={styles.fieldCheckbox}>
          <input type="checkbox" {...register("is_paid")} id="isPaid" />
          <label htmlFor="isPaid">Pago</label>
        </div>

        {/* DATA DE PAGAMENTO */}
        {isPaid && (
          <div className={styles.field}>
            <label>Data do pagamento</label>
            <input type="date" {...register("drs_dt_pagamento")} />
            {errors.drs_dt_pagamento && (
              <span className={styles.error}>
                {errors.drs_dt_pagamento.message}
              </span>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
