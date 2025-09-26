import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  PieChart, 
  Target, 
  TrendingUp, 
  Shield, 
  Coins,
  BarChart3,
  Wallet,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function ToolsPage() {
  const tools = [
    {
      id: 'debt-calculator',
      title: 'حاسبة الديون المتقدمة',
      description: 'احسب أفضل استراتيجية لسداد ديونك ووفر آلاف الريالات من الفوائد باستخدام طريقة كرة الثلج أو الانهيار الجليدي',
      icon: <Calculator className="h-8 w-8" />,
      href: '/tools/debt-calculator',
      features: ['استراتيجيتان للسداد', 'حساب الفوائد', 'مقارنة التوفير'],
      status: 'available',
      category: 'إدارة الديون',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'budget-planner',
      title: 'مخطط الميزانية الذكي',
      description: 'أنشئ ميزانية مخصصة وتتبع إنفاقك مع توصيات ذكية لتوفير المال وتحقيق أهدافك المالية',
      icon: <PieChart className="h-8 w-8" />,
      href: '/tools/budget-planner',
      features: ['تخطيط الميزانية', 'تتبع الإنفاق', 'تحليل الأنماط'],
      status: 'coming-soon',
      category: 'التخطيط المالي',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'investment-calculator',
      title: 'حاسبة الاستثمار',
      description: 'احسب العائد على استثماراتك مع الفوائد المركبة وخطط لتحقيق الحرية المالية بناءً على أهدافك',
      icon: <TrendingUp className="h-8 w-8" />,
      href: '/tools/investment-calculator',
      features: ['الفوائد المركبة', 'تخطيط التقاعد', 'تحليل المخاطر'],
      status: 'coming-soon',
      category: 'الاستثمار',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'goal-tracker',
      title: 'متتبع الأهداف المالية',
      description: 'حدد أهدافك المالية وتتبع تقدمك مع خطط عمل واضحة لتحقيق أحلامك المالية في الوقت المحدد',
      icon: <Target className="h-8 w-8" />,
      href: '/tools/goal-tracker',
      features: ['تحديد الأهداف', 'تتبع التقدم', 'تذكيرات ذكية'],
      status: 'coming-soon',
      category: 'التخطيط',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'emergency-fund',
      title: 'حاسبة صندوق الطوارئ',
      description: 'احسب المبلغ المثالي لصندوق طوارئك وضع خطة لبنائه لحماية نفسك من الأزمات المالية المفاجئة',
      icon: <Shield className="h-8 w-8" />,
      href: '/tools/emergency-fund',
      features: ['حساب الاحتياج', 'خطة البناء', 'تتبع التقدم'],
      status: 'coming-soon',
      category: 'الحماية المالية',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'zakat-calculator',
      title: 'حاسبة الزكاة',
      description: 'احسب زكاة أموالك بدقة وفقاً للشريعة الإسلامية مع تغطية جميع أنواع الأموال والأصول',
      icon: <Coins className="h-8 w-8" />,
      href: '/tools/zakat-calculator',
      features: ['حساب شرعي دقيق', 'أنواع الأموال', 'التقويم الهجري'],
      status: 'coming-soon',
      category: 'الزكاة والصدقات',
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ]

  const categories = [...new Set(tools.map(tool => tool.category))]
  const availableTools = tools.filter(tool => tool.status === 'available')
  const upcomingTools = tools.filter(tool => tool.status === 'coming-soon')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <BarChart3 className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              أدواتك المالية الشخصية
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              مجموعة شاملة من الأدوات المالية المتطورة لمساعدتك في إدارة أموالك 
              وتحقيق أهدافك المالية بذكاء وثقة
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{availableTools.length}</div>
                <div className="text-blue-200">أداة متاحة الآن</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{categories.length}</div>
                <div className="text-blue-200">فئة متخصصة</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-blue-200">مجاني بالكامل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Available Tools Section */}
        {availableTools.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                متاح الآن
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">ابدأ الآن مع أدواتنا</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                أدوات جاهزة للاستخدام الفوري لتحسين وضعك المالي
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${tool.bgColor} relative`}>
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${tool.color} text-white mb-4 w-fit`}>
                      {tool.icon}
                    </div>
                    <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90">
                      {tool.category}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 group"
                      >
                        <Link href={tool.href} className="flex items-center justify-center gap-2">
                          استخدم الأداة
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Section */}
        {upcomingTools.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium mb-4">
                <Clock className="h-4 w-4 mr-2" />
                قريباً
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">أدوات قادمة</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                المزيد من الأدوات المتقدمة في طريقها إليك لتجربة مالية أكثر شمولية
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden opacity-75">
                  <CardHeader className={`${tool.bgColor} relative`}>
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${tool.color} text-white mb-4 w-fit opacity-75`}>
                      {tool.icon}
                    </div>
                    <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90">
                      {tool.category}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                      قريباً
                    </Badge>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs opacity-75">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        disabled
                        className="w-full bg-gray-400 cursor-not-allowed"
                      >
                        قريباً
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">هل تحتاج مساعدة في البدء؟</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك المالية بتقييم سريع لفهم وضعك المالي الحالي وأفضل الأدوات المناسبة لك
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
          >
            <Link href="/assessment" className="flex items-center gap-2">
              ابدأ التقييم المجاني
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}