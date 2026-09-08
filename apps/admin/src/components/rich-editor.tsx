'use client';

import { useCallback, useEffect, useRef } from 'react';
import { uploadMedia } from '@/lib/upload';
import { cn } from '@/lib/utils';

// Lightweight contentEditable editor (no deps). document.execCommand is
// deprecated but works in every current browser and is fine for an internal
// admin tool. Stores HTML; the public site sanitizes on render.

const exec = (cmd: string, val?: string) => document.execCommand(cmd, false, val);

export function RichEditor({
  value,
  onChange,
  prefix = 'pages',
  minHeight = '10rem',
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  prefix?: string;
  minHeight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uploading = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== (value || '')) el.innerHTML = value || '';
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML ?? '');

  const insertHtml = (html: string) => {
    ref.current?.focus();
    exec('insertHTML', html);
    emit();
  };

  const onFile = useCallback(
    async (file: File) => {
      if (uploading.current) return;
      uploading.current = true;
      try {
        const m = await uploadMedia(file, prefix);
        insertHtml(
          m.type === 'VIDEO'
            ? `<p><video controls playsinline src="${m.url}" style="width:100%"></video></p><p><br></p>`
            : `<p><img src="${m.url}" alt="" style="max-width:100%" /></p><p><br></p>`,
        );
      } catch (e) {
        alert(e instanceof Error ? e.message : '업로드 실패');
      } finally {
        uploading.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefix],
  );

  const B = 'rounded px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100';
  const mdown =
    (fn: () => void) => (e: React.MouseEvent) => {
      e.preventDefault();
      fn();
    };

  return (
    <div
      className={cn('rounded-md border border-neutral-300 bg-white', className)}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 p-1">
        <button type="button" className={B} onMouseDown={mdown(() => { exec('bold'); emit(); })}><b>B</b></button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('italic'); emit(); })}><i>I</i></button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('formatBlock', '<h2>'); emit(); })}>H2</button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('formatBlock', '<h3>'); emit(); })}>H3</button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('formatBlock', '<p>'); emit(); })}>P</button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('insertUnorderedList'); emit(); })}>• List</button>
        <button type="button" className={B} onMouseDown={mdown(() => { exec('insertOrderedList'); emit(); })}>1. List</button>
        <button type="button" className={B} onMouseDown={mdown(() => { const u = prompt('링크 URL'); if (u) exec('createLink', u); emit(); })}>Link</button>
        <label className={cn(B, 'cursor-pointer')}>
          이미지 / 영상
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.currentTarget.value = '';
              if (f) void onFile(f);
            }}
          />
        </label>
        <button type="button" className={B} onMouseDown={mdown(() => insertHtml('<hr/>'))}>―</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        style={{ minHeight }}
        className="rich-edit p-3 text-sm leading-relaxed outline-none"
      />
    </div>
  );
}
