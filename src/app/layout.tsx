import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/Chakra";
import Header from "@/components/layout/Header";
import { Box } from "@chakra-ui/react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WorkFound Europe — Поиск работы в Европе",
  description: "Современная платформа для поиска работы в Европе для рабочих специальностей.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>
        <Providers>
          <Box minH="100vh">
            <Header />
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
