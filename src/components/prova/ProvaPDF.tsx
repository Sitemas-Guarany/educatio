"use client";

import jsPDF from "jspdf";
import type { Prova } from "@/types";
import { useAuth } from "@/lib/auth";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

export function gerarProvaPDF(prova: Prova, escolaNome: string, professorNome: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxW = pageW - margin * 2;
  let y = 15;

  const addPage = () => { doc.addPage(); y = 15; };
  const checkSpace = (needed: number) => { if (y + needed > 280) addPage(); };

  // Header
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Educatio — Recomposição da Aprendizagem · BNCC & DCRC", pageW / 2, y, { align: "center" });
  y += 6;

  doc.setDrawColor(0, 104, 71); // ceara-verde
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // Escola
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(escolaNome, pageW / 2, y, { align: "center" });
  y += 6;

  // Título da prova
  doc.setFontSize(14);
  doc.text(prova.titulo, pageW / 2, y, { align: "center" });
  y += 7;

  // Metadados
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  const meta = [
    `Professor(a): ${professorNome}`,
    `Matéria: ${prova.materia}`,
    `Série: ${prova.serie}º ano`,
    prova.sala ? `Sala: ${prova.sala}` : "",
    prova.dataAplicacao ? `Data: ${prova.dataAplicacao}` : "",
  ].filter(Boolean).join("   |   ");
  doc.text(meta, pageW / 2, y, { align: "center" });
  y += 5;

  // Pontuação total
  const totalPontos = prova.questoes.reduce((s, q) => s + q.pontos, 0);
  doc.text(`Total: ${prova.questoes.length} questões · ${totalPontos} pontos`, pageW / 2, y, { align: "center" });
  y += 4;

  doc.setDrawColor(0, 48, 130); // ceara-azul
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 3;

  // Instruções
  if (prova.descricao) {
    checkSpace(15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    const instrLines = doc.splitTextToSize(prova.descricao, maxW);
    doc.text(instrLines, margin, y);
    y += instrLines.length * 3.5 + 3;
  }

  // Aluno / Data (campos em branco para preencher)
  checkSpace(14);
  y += 2;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text("Nome do aluno: _________________________________________________________", margin, y);
  y += 5;
  doc.text("Matrícula: _____________________   Data: ___/___/______   Nota: _____/", margin, y);
  doc.text(`${totalPontos}`, margin + 130, y);
  y += 8;

  // Questões
  prova.questoes.forEach((q, i) => {
    const tipoLabel = q.tipo === "multipla_escolha" ? "Múltipla escolha" : q.tipo === "calculo" ? "Cálculo" : "Dissertativa";

    checkSpace(30);

    // Número + pontos
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 104, 71);
    doc.text(`Questão ${i + 1}`, margin, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`(${q.pontos} pts · ${tipoLabel})`, margin + 25, y);
    y += 5;

    // Enunciado
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    const enunciadoText = stripHtml(q.enunciado);
    const enuncLines = doc.splitTextToSize(enunciadoText, maxW);
    checkSpace(enuncLines.length * 4.5 + 10);
    doc.text(enuncLines, margin, y);
    y += enuncLines.length * 4.5 + 2;

    // Alternativas (múltipla escolha)
    if (q.tipo === "multipla_escolha" && q.alternativas) {
      q.alternativas.forEach((alt, j) => {
        checkSpace(6);
        doc.setFontSize(9);
        doc.text(`(   ) ${String.fromCharCode(65 + j)}) ${alt}`, margin + 4, y);
        y += 5;
      });
      y += 3;
    }

    // Espaço para resposta (dissertativa/cálculo)
    if (q.tipo === "dissertativa") {
      checkSpace(30);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Resposta:", margin, y);
      y += 4;
      // Linhas em branco
      for (let l = 0; l < 6; l++) {
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageW - margin, y);
        y += 5;
      }
      y += 3;
    }

    if (q.tipo === "calculo") {
      if (q.descricaoCalculo) {
        checkSpace(8);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(120);
        const instrCalc = doc.splitTextToSize(q.descricaoCalculo, maxW);
        doc.text(instrCalc, margin, y);
        y += instrCalc.length * 3.5 + 2;
      }
      checkSpace(40);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.setFont("helvetica", "normal");
      doc.text("Cálculos / raciocínio:", margin, y);
      y += 4;
      for (let l = 0; l < 8; l++) {
        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(margin, y, pageW - margin, y);
        y += 5;
      }
      y += 2;
      doc.setTextColor(0);
      doc.text("Resposta final: ___________________________________________________", margin, y);
      y += 8;
    }
  });

  // Footer
  checkSpace(12);
  y += 3;
  doc.setDrawColor(245, 200, 0); // ceara-amarelo
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text("Gerado por Educatio (educatio.digital) — Sistemas Guarany", pageW / 2, y, { align: "center" });

  // Salvar
  const filename = `prova_${prova.materia.toLowerCase().replace(/\s+/g, "_")}_${prova.serie}ano${prova.sala ? `_sala${prova.sala}` : ""}.pdf`;
  doc.save(filename);
}

interface ProvaPDFButtonProps {
  prova: Prova;
  className?: string;
}

export default function ProvaPDFButton({ prova, className }: ProvaPDFButtonProps) {
  const { user, escolas } = useAuth();

  const handleClick = () => {
    const escolasList = escolas();
    const escola = escolasList.find((e) => e.id === prova.escolaId);
    const escolaNome = escola?.nome || "Escola";
    const profNome = user?.nomeCompleto || user?.nome || "Professor";
    gerarProvaPDF(prova, escolaNome, profNome);
  };

  return (
    <button onClick={handleClick} className={`text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors ${className || ""}`}>
      📄 PDF
    </button>
  );
}
