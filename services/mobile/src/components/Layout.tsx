import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-auto pb-16">{children}</main>
      <BottomNav />
      <Footer />
    </>
  )
}
