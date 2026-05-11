import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "焕贞 AI 面试",
  description: "焕贞医美 AI 智能面试系统",
  openGraph: {
    title: "焕贞 AI 面试",
    description: "焕贞医美 AI 智能面试系统",
    siteName: "焕贞医美",
    images: [
      {
        url: "/brand/huanzhen-logo-square.jpg",
        width: 800,
        height: 800,
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/browser-user-icon.ico" />
      </head>
      <body className={inter.className}>
        <ClerkProvider dynamic>
          <Providers>
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-white border-2 border-indigo-400",
                  title: "text-black",
                  description: "text-red-400",
                  actionButton: "bg-indigo-400",
                  cancelButton: "bg-orange-400",
                  closeButton: "bg-lime-400",
                },
              }}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
