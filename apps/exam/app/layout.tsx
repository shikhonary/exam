import type { Metadata } from "next";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "../trpc/client";
import { Navbar } from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shikhonary Exams",
  description: "Take MCQ exams and test your knowledge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TRPCReactProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
