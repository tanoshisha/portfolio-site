import type { Metadata } from "next";
import Link from "next/link";

// 写真の利用について（画像検索の「ライセンス」表示のリンク先。構造化データの license がこのページ）
export const metadata: Metadata = {
  title: "写真の利用について（ライセンス）",
  description: "Hayato Naoe（直江勇人）が撮影した写真の著作権と、利用・掲載を希望される場合のご案内です。",
  alternates: { canonical: "/license" },
};

export default function License() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] px-6 py-24 text-neutral-200 md:px-10 md:py-32">
      <div className="mx-auto max-w-[720px]">
        <Link href="/" className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 hover:text-white">
          ← Hayato Naoe
        </Link>
        <p className="mt-12 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.3em] text-neutral-500">LICENSE</p>
        <h1 className="mt-4 text-[26px] font-light leading-[1.6] tracking-[0.04em] text-white md:text-[34px]">写真の利用について</h1>
        <div className="mt-10 space-y-6 text-[14px] leading-[2.05] tracking-[0.04em] text-neutral-400 md:text-[15px]">
          <p>
            このサイトと
            <a href="https://tokyo-photowalk.com/" className="text-neutral-200 underline underline-offset-4">東京フォトウォークサークル</a>
            のサイトに掲載している写真の著作権は、撮影者の直江勇人（Hayato Naoe）に帰属します。
          </p>
          <p>無断での転載・加工・商用利用はご遠慮ください。</p>
          <p>
            Webサイト・SNS・印刷物などで写真を使いたい場合や、同じような写真の撮影をご希望の場合は、
            <Link href="/#contact" className="text-neutral-200 underline underline-offset-4">お問い合わせフォーム</Link>
            からご連絡ください。用途に合わせてご案内します。
          </p>
          <p>写っている方の肖像権にも配慮が必要なため、人物が写っている写真は内容によってお受けできない場合があります。</p>
        </div>
        <p className="mt-14 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.2em] text-neutral-500">© Hayato Naoe</p>
      </div>
    </main>
  );
}
