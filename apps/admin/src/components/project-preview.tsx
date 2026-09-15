'use client';

import { JetBrains_Mono, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';

// Same faces the public site uses, loaded here too so the preview isn't
// just laid out right — it actually looks like the real page.
const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--pv-noto',
  display: 'swap',
});
// Korean "Orbit" by Sooun Cho / JAMO — draws Hangul + Latin itself.
const orbit = localFont({
  src: '../fonts/orbit-kr/Orbit-Regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--pv-orbit',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--pv-mono',
  display: 'swap',
});

const INK = '#111111';
const INK_SOFT = '#4a4a4a';
const INK_MUTED = '#8a8a8a';
const LINE = '#e6e6e6';

export interface PreviewMediaItem {
  type: 'IMAGE' | 'VIDEO';
  url: string;
}

export function ProjectPreview({
  titleKo,
  titleEn,
  categoryKo,
  categoryEn,
  descriptionHtml,
  type,
  location,
  sizeLabel,
  involvement,
  completionDate,
  photography,
  media,
}: {
  titleKo: string;
  titleEn: string;
  categoryKo: string;
  categoryEn: string;
  descriptionHtml: string;
  type: string;
  location: string;
  sizeLabel: string;
  involvement: string;
  completionDate: string;
  photography: string;
  media: PreviewMediaItem[];
}) {
  const meta: Array<[string, string]> = (
    [
      ['TYPE', type],
      ['LOCATION', location],
      ['SIZE', sizeLabel],
      ['INVOLVEMENT', involvement],
      ['DATE OF COMPLETION', completionDate],
      ['PHOTOGRAPHY', photography],
    ] as Array<[string, string]>
  ).filter(([, v]) => v.trim());

  return (
    <div
      className={`${noto.variable} ${orbit.variable} ${mono.variable} overflow-hidden rounded-lg border border-neutral-200 bg-white`}
      style={{ fontFamily: 'var(--pv-orbit), var(--pv-noto), system-ui, sans-serif', color: INK }}
    >
      {/* mini site header — decorative, mirrors the real nav */}
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: LINE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="h-4 w-auto" />
        <nav className="hidden items-center gap-4 sm:flex">
          {['WORK', 'STIIO', 'CONTACT', 'ABOUT'].map((n) => (
            <span
              key={n}
              className="text-[0.6rem] uppercase tracking-[0.14em]"
              style={{ fontFamily: 'var(--pv-mono)', color: INK_MUTED }}
            >
              {n}
            </span>
          ))}
          <span
            className="text-[0.6rem] uppercase tracking-[0.14em]"
            style={{ fontFamily: 'var(--pv-mono)', color: INK }}
          >
            KO / EN
          </span>
        </nav>
      </div>

      <div className="p-5">
        <p
          className="text-[0.65rem] uppercase tracking-[0.14em]"
          style={{ fontFamily: 'var(--pv-mono)', color: INK_MUTED }}
        >
          ← WORK
        </p>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1
            className="text-base uppercase tracking-[0.14em]"
            style={{ fontFamily: 'var(--pv-mono)' }}
          >
            {titleEn.trim() || 'TITLE (EN)'}
          </h1>
          <p className="text-xs" style={{ color: INK_MUTED }}>
            {titleKo.trim() || '제목 (KO)'}
            {categoryKo ? ` · ${categoryKo || categoryEn}` : ''}
          </p>
        </div>

        {descriptionHtml.trim() ? (
          <div
            className="preview-rich mt-4 max-w-none text-xs leading-relaxed"
            style={{ color: INK_SOFT }}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        ) : null}

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_11rem]">
          {/* Images/video always fill the column width, natural height — no
              cropping, matching how the real WORK detail page shows them. */}
          <div className="space-y-3">
            {media.length > 0 ? (
              media.map((m, i) =>
                m.type === 'IMAGE' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={m.url}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="block w-full bg-white"
                  />
                ) : (
                  <video
                    key={i}
                    src={m.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="block w-full bg-white"
                  />
                ),
              )
            ) : (
              <div
                className="flex aspect-[4/5] w-full items-center justify-center text-center text-[0.65rem]"
                style={{ background: '#ffffff', border: `1px dashed ${LINE}`, color: INK_MUTED }}
              >
                이미지를 추가하면
                <br />
                여기 표시됩니다
              </div>
            )}
          </div>

          <dl className="h-max border-t text-[0.65rem]" style={{ borderColor: LINE }}>
            {meta.length > 0 ? (
              meta.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-2 border-b py-1.5"
                  style={{ borderColor: LINE }}
                >
                  <dt
                    className="shrink-0 uppercase tracking-[0.1em]"
                    style={{ fontFamily: 'var(--pv-mono)', color: INK_MUTED }}
                  >
                    {k}
                  </dt>
                  <dd className="text-right" style={{ color: INK_SOFT }}>
                    {v}
                  </dd>
                </div>
              ))
            ) : (
              <p className="py-2" style={{ color: INK_MUTED }}>
                TYPE / LOCATION 등을 입력하면 여기 표시됩니다.
              </p>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
