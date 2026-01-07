export default function DaisyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ここで data-theme を指定すると、この配下だけそのテーマになる
    // "light", "dark", "cupcake", "retro" などが選べます
    <section
      data-theme="light"
      className="min-h-screen bg-base-100 text-base-content"
    >
      <div className="p-4 bg-primary text-primary-content">
        daisyUI プレビューモード
      </div>
      {children}
    </section>
  );
}
