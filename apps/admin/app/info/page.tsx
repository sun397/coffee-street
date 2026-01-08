import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Smartphone,
  Star,
  Store,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* --- ナビゲーション --- */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-700" />
          <span className="text-xl font-bold tracking-tight">
            Coffee Street
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#features"
            className="hover:text-amber-700 transition-colors"
          >
            機能
          </a>
          <a
            href="#testimonials"
            className="hover:text-amber-700 transition-colors"
          >
            導入事例
          </a>
          <a href="#pricing" className="hover:text-amber-700 transition-colors">
            料金
          </a>
        </div>
        <Button variant="default" className="bg-amber-800 hover:bg-amber-900">
          無料で始める
        </Button>
      </nav>

      <main>
        {/* --- ヒーローセクション --- */}
        <section className="relative px-6 py-20 md:py-32 text-center max-w-5xl mx-auto">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100 border-none px-4 py-1">
            2026年 新機能：AI需要予測をリリース
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-stone-900">
            焙煎のこだわりを、
            <br />
            <span className="text-amber-700">最高のタイミング</span>でファンへ。
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            在庫管理から取り置き予約まで。ロースターの日常を支え、
            ファンとの繋がりを深くするオールインワン・プラットフォーム。
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-amber-800 hover:bg-amber-900 px-8 py-6 text-lg"
            >
              今すぐ無料で始める <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-stone-300"
            >
              デモ画面を見る
            </Button>
          </div>
        </section>

        {/* --- 価値提案 (Value Proposition) --- */}
        <section id="features" className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Smartphone className="h-8 w-8" />,
                title: "鮮度を逃さない",
                desc: "焙煎日からの経過日数を自動計算。飲み頃を逃さずファンに通知。",
              },
              {
                icon: <Store className="h-8 w-8" />,
                title: "ファンを逃さない",
                desc: "SNSから1クリックで予約完了。接客中でも注文を取りこぼしません。",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "事務を減らす",
                desc: "売上と在庫が連動。焙煎計画の立案をデータでサポートします。",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="bg-amber-50 p-4 rounded-2xl text-amber-700 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 機能カード (Feature Cards) --- */}
        <section className="px-6 py-20 bg-stone-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              現場の「欲しい」を形にした機能群
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>在庫・焙煎管理</CardTitle>
                  <CardDescription>
                    生豆から製品までリアルタイム管理
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      焙煎スケジュール自動生成
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      ロット別トレーサビリティ
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>取り置き・予約</CardTitle>
                  <CardDescription>24時間365日、予約を受付</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      受取忘れ防止リマインド
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      事前決済対応（オプション）
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>顧客CRM</CardTitle>
                  <CardDescription>
                    好みの「こだわり」をデータ化
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      購買履歴に基づくおすすめ
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                      デジタル会員証発行
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- ユーザーの声 (Testimonials) --- */}
        <section id="testimonials" className="px-6 py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center italic">
            <Star className="h-8 w-8 text-amber-400 mx-auto mb-6 fill-amber-400" />
            <p className="text-2xl font-medium text-stone-800 mb-6">
              「これまではSNSのDMで予約を受けていましたが、在庫と連動していませんでした。Coffee
              Streetのおかげで、焙煎に集中しながら、完売率を30%向上させることができました。」
            </p>
            <div className="font-semibold text-stone-600">
              — Blue Beans Coffee 焙煎士 佐藤様
            </div>
          </div>
        </section>

        {/* --- 料金プラン (Pricing) --- */}
        <section id="pricing" className="px-6 py-20 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              あらゆる成長段階に合わせたプラン
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                plan="Starter"
                price="0"
                description="まずはデジタル化を始めたい個人ロースターへ"
              />
              <PricingCard
                plan="Professional"
                price="4,980"
                description="店舗の売上を最大化したい成長中のショップへ"
                popular={true}
              />
              <PricingCard
                plan="Enterprise"
                price="ASK"
                description="複数店舗や卸売を行う大規模ロースターへ"
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- フッター --- */}
      <footer className="px-6 py-12 bg-stone-900 text-stone-400 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            <span className="text-lg font-bold text-white tracking-tight">
              Coffee Street
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              利用規約
            </a>
            <a href="#" className="hover:text-white transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="hover:text-white transition-colors">
              お問い合わせ
            </a>
          </div>
          <p className="text-xs">
            © 2026 Coffee Street Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// 料金プランカード用サブコンポーネント
function PricingCard({
  plan,
  price,
  description,
  popular = false,
}: {
  plan: string;
  price: string;
  description: string;
  popular?: boolean;
}) {
  return (
    <Card
      className={`relative flex flex-col ${popular ? "border-amber-600 ring-2 ring-amber-600 ring-opacity-20 shadow-xl scale-105 z-10" : "border-stone-200 shadow-sm"}`}
    >
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 hover:bg-amber-600 border-none">
          一番人気
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan}</CardTitle>
        <CardDescription className="min-h-[40px]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">¥{price}</span>
          {price !== "ASK" && (
            <span className="text-stone-500 text-sm">/月</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${popular ? "bg-amber-800 hover:bg-amber-900" : ""}`}
          variant={popular ? "default" : "outline"}
        >
          {price === "0" ? "無料で始める" : "今すぐ申し込む"}
        </Button>
      </CardFooter>
    </Card>
  );
}
