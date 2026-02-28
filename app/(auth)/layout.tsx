export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 safe-top safe-bottom">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
