import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
	authors: siteConfig.authors,
	creator: siteConfig.creator,
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Header />
				<main className="px-4">{children}</main>
				{/* <Footer /> */}
				<Toaster theme="light" richColors />
			</body>
		</html>
	);
}
