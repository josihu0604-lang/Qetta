export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">
          QETTA
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          채무조정 자동화 플랫폼
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            로그인
          </a>
          <a
            href="/auth/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
          >
            회원가입
          </a>
        </div>
      </div>
    </main>
  );
}
