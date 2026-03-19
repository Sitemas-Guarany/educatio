import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Educatio | Recomposição da Aprendizagem — Ceará",
  description:
    "Plataforma lúdica de recomposição da aprendizagem para alunos do 6º ao 9º ano, alinhada à BNCC e DCRC do Ceará.",
  keywords: ["BNCC", "DCRC", "Ceará", "recomposição da aprendizagem", "ensino fundamental", "educação"],
  authors: [{ name: "Educatio" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Educatio",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Educatio",
    description: "Educatio — Recomposição da aprendizagem 6º ao 9º ano — BNCC & DCRC Ceará",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#006847",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
