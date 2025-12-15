import styles from "./editarMovimentacao.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useAuth } from "../../Hook/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

type TipoReceita = {
  tpr_id: string;
  tpr_tipo: string;
};

/* =========================
   Schema
========================= */
const editarSchema = z
  .object({
    descricao: z.string().min(1, "Descrição obrigatória"),
    valor: z.coerce.number().positive("Valor deve ser maior que zero"),
    tpr_id: z.string().uuid(),
    is_paid: z.boolean(),
    drs_dt_lancamento: z.string().min(1, "Data de lançamento obrigatória"),
    drs_dt_pagamento: z.string().optional(),
  })
  .refine(
    (data) => !data.is_paid || !!data.drs_dt_pagamento,
    {
      message: "Informe a data de pagamento",
      path: ["drs_dt_pagamento"],
    }
  );

type EditarData = z.infer<typeof editarSchema>;

export default function Editar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tipo, setTipo] = useState<TipoReceita | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarData>({
    resolver: zodResolver(editarSchema),
  });

  const isPaid = watch("is_paid");

  useEffect(() => {
    async function fetchMovimentacao() {
      const { data, error } = await supabase
        .from("despesa_receita")
        .select(`
          drs_descricao,
          drs_valor,
          is_paid,
          drs_dt_lancamento,
          drs_dt_pagamento,
          tpr_id,
          tipo_receita (
            tpr_id,
            tpr_tipo
          )
        `)
        .eq("drs_id", id)
        .single();

      if (error || !data) {
        alert("Erro ao carregar registro");
        return;
      }

      setTipo(data.tipo_receita);

      reset({
        descricao: data.drs_descricao,
        valor: data.drs_valor,
        is_paid: data.is_paid,
        drs_dt_lancamento: data.drs_dt_lancamento.slice(0, 10),
        drs_dt_pagamento: data.drs_dt_pagamento
          ? data.drs_dt_pagamento.slice(0, 10)
          : undefined,
        tpr_id: data.tpr_id,
      });

      setLoading(false);
    }

    if (id) fetchMovimentacao();
  }, [id, reset]);

  async function onSubmit(data: EditarData) {
    if (!user || !id) {
      alert("Usuário ou ID inválido");
      return;
    }

    const { data: updated, error } = await supabase
      .from("despesa_receita")
      .update({
        drs_descricao: data.descricao,
        drs_valor: data.valor,
        drs_dt_lancamento: data.drs_dt_lancamento, // ✅ NOVO CAMPO
        is_paid: data.is_paid,
        drs_dt_pagamento: data.is_paid
          ? data.drs_dt_pagamento
          : null,
      })
      .eq("drs_id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (!updated || updated.length === 0) {
      alert("Registro não encontrado ou sem permissão");
      return;
    }

    alert("Registro atualizado com sucesso!");
    navigate("/dashboard");
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Editar Receita / Despesa</h1>

        <div className={styles.field}>
          <label>Descrição</label>
          <input {...register("descricao")} />
          {errors.descricao && <span className={styles.error}>{errors.descricao.message}</span>}
        </div>

        <div className={styles.field}>
          <label>Valor</label>
          <input type="number" step="0.01" {...register("valor")} />
          {errors.valor && <span className={styles.error}>{errors.valor.message}</span>}
        </div>

        {/* DATA DE LANÇAMENTO */}
        <div className={styles.field}>
          <label>Data de lançamento</label>
          <input type="date" {...register("drs_dt_lancamento")} />
          {errors.drs_dt_lancamento && (
            <span className={styles.error}>{errors.drs_dt_lancamento.message}</span>
          )}
        </div>

        {/* TIPO BLOQUEADO */}
        <div className={styles.field}>
          <label>Tipo</label>
          <select disabled {...register("tpr_id")}>
            <option value={tipo?.tpr_id}>{tipo?.tpr_tipo}</option>
          </select>
        </div>

        <div className={styles.fieldCheckbox}>
          <input type="checkbox" {...register("is_paid")} />
          <label>Pago</label>
        </div>

        {isPaid && (
          <div className={styles.field}>
            <label>Data do pagamento</label>
            <input type="date" {...register("drs_dt_pagamento")} />
            {errors.drs_dt_pagamento && (
              <span className={styles.error}>{errors.drs_dt_pagamento.message}</span>
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
