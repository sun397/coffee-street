import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { CheckCircle2, Coffee, LayoutDashboard, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section: メッシュグラデーション風の背景 */}
      <section className="relative py-24 px-6 overflow-hidden lg:py-32">
        {/* 装飾用の背景アクセント */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/50 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-linear-to-r from-orange-500 to-amber-600 text-white border-none px-4 py-1 shadow-lg shadow-orange-200">
            <Sparkles className="w-3 h-3 mr-2" />
            New Version 2026
          </Badge>
          
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-8">
            <span className="text-slate-900">Coffee Street</span><br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-purple-600 to-indigo-600">
              Admin Console
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            モノレポで構築された次世代の管理システム。
            <span className="font-bold text-slate-900">shadcn/ui</span> と 
            <span className="font-bold text-slate-900"> Tailwind v4</span> による圧倒的な色彩とパフォーマンスを提供します。
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="px-10 h-14 text-lg font-bold bg-slate-900 hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-200 group">
              今すぐ始める
              <Coffee className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="px-10 h-14 text-lg font-bold border-2 hover:bg-slate-50 transition-colors">
              ドキュメントを読む
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4 italic tracking-tighter">FEATURES</h2>
          <div className="h-1.5 w-20 bg-linear-to-r from-orange-500 to-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<LayoutDashboard className="w-10 h-10" />}
            title="一元管理"
            description="複数のアプリケーションのUIコンポーネントを共通パッケージで集中管理します。"
            color="bg-indigo-50 text-indigo-600"
            borderColor="hover:border-indigo-400"
          />
          <FeatureCard 
            icon={<Zap className="w-10 h-10" />}
            title="高速ビルド"
            description="Turborepo と Turbopack により、巨大なモノレポでも瞬時に開発サーバーが起動します。"
            color="bg-amber-50 text-amber-600"
            borderColor="hover:border-amber-400"
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10" />}
            title="堅牢な設計"
            description="TypeScript と Tailwind v4 の型安全なスタイル定義により、バグの少ない開発が可能です。"
            color="bg-emerald-50 text-emerald-600"
            borderColor="hover:border-emerald-400"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Coffee className="w-6 h-6 text-orange-400" />
            <span className="font-bold tracking-widest text-lg uppercase">Coffee Street</span>
          </div>
          <p className="text-slate-400">© 2026 Coffee Street Project. Built with Passion & Caffeine.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color,
  borderColor 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  color: string,
  borderColor: string
}) {
  return (
    <Card className={`group border-2 border-transparent ${borderColor} bg-white shadow-xl hover:-translate-y-2 transition-all duration-300`}>
      <CardHeader>
        <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600 text-md leading-relaxed">
          {description}
        </CardDescription>
        <div className="mt-6 flex items-center text-slate-400 group-hover:text-orange-500 transition-colors text-sm font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
          Ready to deploy
        </div>
      </CardContent>
    </Card>
  );
}