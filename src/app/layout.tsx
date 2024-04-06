import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../../public/fontawesome/css/fontawesome.min.css";
import "../../public/fontawesome/css/brands.min.css";
import "../../public/fontawesome/css/solid.min.css";
import ReduxStoreProvider from "./redux-store-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F3F5" },
    { media: "(prefers-color-scheme: dark)", color: "#181818" }
  ]
};

export const metadata: Metadata = {
  title: "PDF Toolkit",
  description: "Various tools for manipulating PDF files.",
  icons: {
    shortcut: "/favicon.ico",
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180"
    },
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" }
    ]
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary",
    site: "https://next-pdftoolkit.subhamk.com",
    title: "PDF Toolkit",
    description: "Various tools for manipulating PDF files.",
    images: [{ url: "https://next-pdftoolkit.subhamk.com/android-chrome-192x192.png" }],
    creator: "@SubhamK108"
  },
  openGraph: {
    type: "website",
    title: "PDF Toolkit",
    description: "Various tools for manipulating PDF files.",
    siteName: "PDF Toolkit",
    url: "https://next-pdftoolkit.subhamk.com",
    images: [{ url: "https://next-pdftoolkit.subhamk.com/android-chrome-192x192.png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxStoreProvider>
      <html className="max-w-[100vw] overflow-x-hidden" lang="en">
        {/* <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>PDF Toolkit</title>
        <meta name="description" content="Various tools for manipulating PDF files." />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://next-pdftoolkit.subhamk.com" />
        <meta name="twitter:title" content="PDF Toolkit" />
        <meta name="twitter:description" content="Various tools for manipulating PDF files." />
        <meta name="twitter:image" content="https://next-pdftoolkit.subhamk.com/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@SubhamK108" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PDF Toolkit" />
        <meta property="og:description" content="Various tools for manipulating PDF files." />
        <meta property="og:site_name" content="PDF Toolkit" />
        <meta property="og:url" content="https://next-pdftoolkit.subhamk.com" />
        <meta property="og:image" content="https://next-pdftoolkit.subhamk.com/android-chrome-192x192.png" />
      </head> */}

        <body className="max-w-[100vw] overflow-x-hidden bg-[#F2F3F5] dark:bg-[#181818] text-[#404756] dark:text-[#ffffffa6]">
          {children}
        </body>
      </html>
    </ReduxStoreProvider>
  );
}
