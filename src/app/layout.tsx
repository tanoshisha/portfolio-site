import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import photos from "@/data/photos.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 日本語の書体。英字は Geist、日本語はこの書体で表示（細め〜中くらいの太さだけ読み込む）
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hayatonaoe.com"),
  title: {
    default: "Hayato Naoe｜東京のフォトグラファー（ポートレート・店舗/飲食店撮影）",
    template: "%s｜Hayato Naoe",
  },
  description:
    "東京を拠点に活動するフォトグラファー Hayato Naoe のポートフォリオ。ポートレート、飲食店・店舗の内装/メニュー・ドリンク撮影（食べログ・Googleマップ・Instagram用）に対応。さらにWebサイト制作（ホームページ・LP）、撮影とセットのサイト制作も承ります。打ち合わせを重ね、その人・その場の“空気”ごと残す一枚を。撮影・制作のご依頼・料金はサイトから。",
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
    "Webサイト制作",
    "ホームページ制作",
    "LP制作",
    "Hayato Naoe",
    "hayato_naoe",
  ],
  authors: [{ name: "Hayato Naoe" }],
  creator: "Hayato Naoe",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://hayatonaoe.com/",
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
  alternateName: "直江勇人",
  url: "https://hayatonaoe.com/",
  jobTitle: "Photographer",
  image: "https://hayatonaoe.com/images/featured.jpg",
  sameAs: ["https://instagram.com/hayato_naoe"],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Tokyo",
    addressCountry: "JP",
  },
  knowsAbout: ["ポートレート撮影", "飲食店撮影", "店舗撮影", "スナップ写真"],
  // 主宰している写真サークル（同じ人のサイト同士として検索エンジンに伝える）
  memberOf: {
    "@type": "Organization",
    name: "東京フォトウォークサークル",
    url: "https://tokyo-photowalk.com/",
  },
};

// 作品写真の一覧（撮影者・クレジット・ライセンス付き）。Google画像検索で撮影者名やライセンス表示が出るように
const SITE = "https://hayatonaoe.com";
const absImg = (src: string) => `${SITE}${src.includes("/") ? src : `/images/gallery/${src}.jpg`}`;
const creator = { "@type": "Person", name: "Hayato Naoe（直江勇人）", url: `${SITE}/` };
const imageObj = (p: { src: string; title?: string; category?: string }, genre: string) => ({
  "@type": "ImageObject",
  contentUrl: absImg(p.src),
  name: p.title ? `${p.title}｜${genre}` : genre,
  caption: p.title ? `${p.title}｜${genre}（フォトグラファー Hayato Naoe）` : `${genre}（フォトグラファー Hayato Naoe）`,
  creator,
  creditText: "Hayato Naoe",
  copyrightNotice: "© Hayato Naoe",
  license: `${SITE}/license`,
  acquireLicensePage: `${SITE}/#contact`,
});
const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Hayato Naoe の作品（ポートレート・飲食店撮影・東京のスナップ）",
  url: `${SITE}/`,
  author: creator,
  image: [
    ...photos.works.map((p) => imageObj(p, p.category === "shop" ? "東京の飲食店・店舗撮影" : "東京のポートレート撮影")),
    ...photos.personal.map((p) => imageObj(p, "東京の街のスナップ写真")),
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hayato Naoe",
  alternateName: "直江勇人",
  url: "https://hayatonaoe.com/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${zenKaku.variable} h-full antialiased`}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
