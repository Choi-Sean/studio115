// Root not-found: rendered outside the [locale] layout, so it owns <html>/<body>.
export default function RootNotFound() {
  return (
    <html lang="ko">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100dvh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          background: '#f6f4f0',
          color: '#1a1a1a',
        }}
      >
        <p style={{ fontSize: '2rem', margin: 0 }}>404</p>
        <p style={{ color: '#767676', margin: 0 }}>Page not found.</p>
        <a href="/" style={{ color: '#b1543a' }}>
          Studio115 →
        </a>
      </body>
    </html>
  );
}
