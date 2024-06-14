import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "MVG Gang",
    description: "Maxvorstadt Gang",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">


        <body className={inter.className}>{children}
        <Toaster/></body>

        </html>
    );
}
