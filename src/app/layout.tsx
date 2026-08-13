import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hayatonaoe.vercel.app"),
  title: {
    default: "Hayato Naoe｜東京のフォトグラファー（ポートレート・店舗/飲食店撮影）",
    template: "%s｜Hayato Naoe",
  },
  description:
    "東京を拠点に活動するフォトグラファー Hayato Naoe のポートフォリオ。ポートレート、飲食店・店舗の内装/メニュー・ドリンク撮影（食べログ・Googleマップ・Instagram用）に対応。打ち合わせを重ね、その人・その場の“空気”ごと残す一枚を。撮影のご依頼・料金はサイトから。",
  keywords: [
    "フォトグラファー",
    "カメラマン",
    "東京",
    "出張撮影",
    "ポートレート撮影",
    "飲食店撮影",
    "店舗撮影",
    "メニュー撮影",
    "スナップ写真",
    "Hayato Naoe",
    "hayato_naoe",
  ],
  authors: [{ name: "Hayato Naoe" }],
  creator: "Hayato Naoe",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://hayatonaoe.vercel.app/",
    siteName: "Hayato Naoe",
    title: "Hayato Naoe｜東京のフォトグラファー",
    description:
      "東京のフォトグラファー Hayato Naoe のポートフォリオ。ポートレート・飲食店/店舗撮影に対応。その瞬間の“空気”ごと残す一枚を。",
    locale: "ja_JP",
    images: [{ url: "/images/featured.jpg", alt: "Hayato Naoe の作品" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hayato Naoe｜東京のフォトグラファー",
    description:
      "東京のフォトグラファー Hayato Naoe のポートフォリオ。ポートレート・飲食店/店舗撮影に対応。",
    images: ["/images/featured.jpg"],
  },
  robots: { index: true, follow: true },
  verification: { google: "yHw49Oh3xa4ER6VAuLYSrEQEC_1ayuFpPh2McUjbbWU" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hayato Naoe",
  url: "https://hayatonaoe.vercel.app/",
  jobTitle: "Photographer",
  image: "https://hayatonaoe.vercel.app/images/featured.jpg",
  sameAs: ["https://instagram.com/hayato_naoe"],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Tokyo",
    addressCountry: "JP",
  },
  knowsAbout: ["ポートレート撮影", "飲食店撮影", "店舗撮影", "スナップ写真"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.addEventListener('load',function(){if(!location.hash){window.scrollTo(0,0);}});",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
