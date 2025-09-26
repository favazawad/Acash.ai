'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Target, Home, Car, ShoppingCart, Heart, ArrowRight, ArrowLeft, Download, Mail } from 'lucide-react'
import Link from 'next/link'

interface BudgetCategories {
  housing: number
  transportation: number
  food: number
  utilities: number
  healthcare: number
  entertainment: number
  savings: number
  other: number
}

interface BudgetAnalysis {
  totalExpenses: number
  remainingIncome: number
  categoryBreakdown: {
    category: string
    amount: number
    percentage: number
    status: 'good' | 'warning' | 'danger'
    recommendation: string
    icon: JSX.Element
  }[]
  overallAssessment: {
    title: string
    message: string
    tone: 'positive' | 'warning' | 'danger'
    advice: string[]
  }
}

interface EmailState {
  isVisible: boolean
  email: string
  isSending: boolean
  sent: boolean
}

const RECOMMENDED_PERCENTAGES = {
  housing: { max: 30, name: 'السكن والإيجار' },
  transportation: { max: 15, name: 'المواصلات' },
  food: { max: 12, name: 'الطعام' },
  utilities: { max: 8, name: 'الفواتير' },
  healthcare: { max: 5, name: 'الصحة' },
  entertainment: { max: 10, name: 'الترفيه' },
  savings: { min: 20, name: 'الادخار' },
  other: { max: 10, name: 'مصاريف أخرى' }
}

export default function SmartBudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [categories, setCategories] = useState<BudgetCategories>({
    housing: 0,
    transportation: 0,
    food: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    savings: 0,
    other: 0
  })
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [emailState, setEmailState] = useState<EmailState>({
    isVisible: false,
    email: '',
    isSending: false,
    sent: false
  })

  const validateInputs = (): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'يرجى إدخال الدخل الشهري'
    }

    const totalExpenses = Object.values(categories).reduce((sum, value) => sum + value, 0)
    if (totalExpenses === 0) {
      newErrors.categories = 'يرجى إدخال بعض المصاريف على الأقل'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateCategory = (category: keyof BudgetCategories, value: string) => {
    setCategories(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }))
  }

  const handlePrint = () => {
    const printContent = document.getElementById('budget-results')
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>تقرير مخطط الميزانية - Acash.ai</title>
              <style>
                body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .result-card { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; }
                .highlight { background-color: #f0f9ff; padding: 15px; border-radius: 8px; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>تقرير مخطط الميزانية الذكي</h1>
                <p>مُولد بواسطة Acash.ai - ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              ${printContent.innerHTML}
              <div class="footer">
                <p>تم إنشاء هذا التقرير بواسطة Acash.ai - مرشدك المالي الذكي</p>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const toggleEmailInput = () => {
    setEmailState(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
      sent: false
    }))
  }

  const handleEmailSend = async () => {
    if (!emailState.email) return
    
    setEmailState(prev => ({ ...prev, isSending: true }))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setEmailState(prev => ({
      ...prev,
      isSending: false,
      sent: true,
      isVisible: false
    }))
  }

  const analyzeBudget = () => {
    if (!validateInputs()) return

    const income = parseFloat(monthlyIncome)
    const totalExpenses = Object.values(categories).reduce((sum, value) => sum + value, 0)
    const remainingIncome = income - totalExpenses

    const categoryBreakdown = Object.entries(categories).map(([key, amount]) => {
      const percentage = (amount / income) * 100
      const recommended = RECOMMENDED_PERCENTAGES[key as keyof typeof RECOMMENDED_PERCENTAGES]
      
      let status: 'good' | 'warning' | 'danger' = 'good'
      let recommendation = ''

      if (key === 'savings') {
        if (percentage >= getMin(recommended)!) {
          status = 'good'
          recommendation = `ممتاز! معدل الادخار صحي`
        } else if (percentage >= 10) {
          status = 'warning'
          recommendation = `جيد، لكن يمكن زيادة الادخار`
        } else {
          status = 'danger'
          recommendation = `معدل ادخار منخفض، حاول الوصول لـ ${getMin(recommended)}%`
        }
      } else {
        if (percentage <= getMax(recommended)!) {
          status = 'good'
          recommendation = `ضمن المعدل المطلوب`
        } else if (percentage <= getMax(recommended)! * 1.2) {
          status = 'warning'
          recommendation = `أعلى قليلاً من المُوصى، حاول التقليل`
        } else {
          status = 'danger'
          recommendation = `مرتفع جداً، المعدل المُوصى أقل من ${getMax(recommended)}%`
        }
      }

      const icons = {
        housing: <Home className="h-5 w-5" />,
        transportation: <Car className="h-5 w-5" />,
        food: <ShoppingCart className="h-5 w-5" />,
        utilities: <DollarSign className="h-5 w-5" />,
        healthcare: <Heart className="h-5 w-5" />,
        entertainment: <Target className="h-5 w-5" />,
        savings: <TrendingUp className="h-5 w-5" />,
        other: <DollarSign className="h-5 w-5" />
      }

      return {
        category: recommended.name,
        amount,
        percentage,
        status,
        recommendation,
        icon: icons[key as keyof typeof icons]
      }
    }).filter(item => item.amount > 0)

    const savingsRate = (categories.savings / income) * 100
    
    let overallAssessment
    if (remainingIncome < 0) {
      overallAssessment = {
        title: 'تحذير: مصاريف أكثر من الدخل!',
        message: `مصاريفك تتجاوز دخلك بـ ${formatCurrency(Math.abs(remainingIncome))}. هذا وضع خطر يتطلب تدخل فوري لتجنب الديون.`,
        tone: 'danger' as const,
        advice: [
          'قلل المصاريف غير الضرورية فوراً',
          'راجع كل بند وابحث عن بدائل أرخص',
          'فكر في زيادة الدخل إن أمكن',
          'تجنب الاقتراض لتغطية المصاريف'
        ]
      }
    } else if (savingsRate >= 20 && remainingIncome >= 0) {
      overallAssessment = {
        title: 'ممتاز! ميزانية صحية ومتوازنة',
        message: `تهانينا! تدير ميزانيتك بحكمة مع معدل ادخار ${savingsRate.toFixed(0)}% ومبلغ متبقي قدره ${formatCurrency(remainingIncome)}.`,
        tone: 'positive' as const,
        advice: [
          'استمر على هذا المسار الرائع',
          'فكر في استثمار جزء من المدخرات',
          'ابق على مراجعة دورية للميزانية',
          'كافئ نفسك أحياناً لتحافظ على الدافع'
        ]
      }
    } else if (savingsRate >= 10) {
      overallAssessment = {
        title: 'جيد، مع إمكانية للتحسين',
        message: `ميزانيتك معقولة مع معدل ادخار ${savingsRate.toFixed(0)}%. يمكن تحسينها لتصل للمستوى المثالي.`,
        tone: 'warning' as const,
        advice: [
          'حاول زيادة معدل الادخار تدريجياً',
          'راجع المصاريف الثانوية وقللها',
          'ضع أهداف شهرية للتوفير',
          'فكر في مصادر دخل إضافية'
        ]
      }
    } else {
      overallAssessment = {
        title: 'تحتاج لإعادة ترتيب الأولويات',
        message: `معدل الادخار منخفض (${savingsRate.toFixed(0)}%). تحتاج لمراجعة شاملة لإنفاقك لضمان مستقبل مالي آمن.`,
        tone: 'danger' as const,
        advice: [
          'ضع الادخار كأولوية قبل أي مصروف',
          'طبق قاعدة "ادفع لنفسك أولاً"',
          'راجع كل المصاريف وامحُ غير الضروري',
          'ضع ميزانية صارمة والتزم بها'
        ]
      }
    }

    setAnalysis({
      totalExpenses,
      remainingIncome,
      categoryBreakdown,
      overallAssessment
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const resetBudget = () => {
    setMonthlyIncome('')
    setCategories({
      housing: 0,
      transportation: 0,
      food: 0,
      utilities: 0,
      healthcare: 0,
      entertainment: 0,
      savings: 0,
      other: 0
    })
    setAnalysis(null)
    setErrors({})
    setEmailState({
      isVisible: false,
      email: '',
      isSending: false,
      sent: false
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-purple-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ArrowRight className="h-4 w-4" />
            <Link href="/tools" className="hover:text-purple-600">
              الأدوات المالية
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-gray-800 font-medium">مخطط الميزانية الذكي</span>
          </nav>
          
          <Link href="/tools">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة للأدوات
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white">
              <PieChart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مخطط الميزانية الذكي</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            خطط ميزانيتك الشهرية بذكاء واحصل على تحليل مخصص لتحسين وضعك المالي
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  الدخل الشهري
                </CardTitle>
                <CardDescription>
                  الراتب الصافي أو إجمالي دخلك الشهري
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  placeholder="مثال: 8000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="text-lg p-4 h-14"
                />
                {errors.monthlyIncome && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.monthlyIncome}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أبواب الإنفاق الشهري</CardTitle>
                <CardDescription>
                  أدخل متوسط إنفاقك الشهري لكل فئة (بالريال)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(RECOMMENDED_PERCENTAGES).map(([key, config]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                      {key === 'housing' && <Home className="h-4 w-4" />}
                      {key === 'transportation' && <Car className="h-4 w-4" />}
                      {key === 'food' && <ShoppingCart className="h-4 w-4" />}
                      {(key === 'utilities' || key === 'other') && <DollarSign className="h-4 w-4" />}
                      {key === 'healthcare' && <Heart className="h-4 w-4" />}
                      {key === 'entertainment' && <Target className="h-4 w-4" />}
                      {key === 'savings' && <TrendingUp className="h-4 w-4" />}
                      {config.name}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      placeholder="0"
                      value={categories[key as keyof BudgetCategories] || ''}
                      onChange={(e) => updateCategory(key as keyof BudgetCategories, e.target.value)}
                      className="h-12"
                    />
                  </div>
                ))}
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.categories}
                  </p>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={analyzeBudget}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg font-medium"
            >
              تحليل الميزانية
            </Button>

            {analysis && (
              <Button 
                onClick={resetBudget}
                variant="outline"
                className="w-full"
              >
                ميزانية جديدة
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {analysis ? (
              <div id="budget-results">
                <Card className={`border-2 ${
                  analysis.overallAssessment.tone === 'positive' ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' :
                  analysis.overallAssessment.tone === 'warning' ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' :
                  'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
                }`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-xl ${
                      analysis.overallAssessment.tone === 'positive' ? 'text-green-800' :
                      analysis.overallAssessment.tone === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {analysis.overallAssessment.tone === 'positive' ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                      {analysis.overallAssessment.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      {analysis.overallAssessment.message}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/80 p-4 rounded-lg text-center">
                        <div className="text-xl font-bold text-gray-800">
                          {formatCurrency(analysis.totalExpenses)}
                        </div>
                        <div className="text-sm text-gray-600">إجمالي المصاريف</div>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${
                        analysis.remainingIncome >= 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <div className={`text-xl font-bold ${
                          analysis.remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(analysis.remainingIncome)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {analysis.remainingIncome >= 0 ? 'المبلغ المتبقي' : 'النقص في الميزانية'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>تحليل أبواب الإنفاق</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(category.amount)}</div>
                            <div className="text-sm text-gray-500">{category.percentage.toFixed(0)}%</div>
                          </div>
                        </div>
                        <Progress 
                          value={getMin(Math)(category.percentage, 100)} 
                          className={`h-2 ${
                            category.status === 'good' ? 'bg-green-100' :
                            category.status === 'warning' ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}
                        />
                        <p className={`text-sm ${
                          category.status === 'good' ? 'text-green-600' :
                          category.status === 'warning' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {category.recommendation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className={`${
                  analysis.overallAssessment.tone === 'positive' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                  analysis.overallAssessment.tone === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
                  'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${
                      analysis.overallAssessment.tone === 'positive' ? 'text-green-800' :
                      analysis.overallAssessment.tone === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      خطوات عملية للتحسين
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.overallAssessment.advice.map((advice, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            analysis.overallAssessment.tone === 'positive' ? 'text-green-600' :
                            analysis.overallAssessment.tone === 'warning' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                          <span className="text-sm">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      حفظ ومشاركة النتائج
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={handlePrint}
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        حفظ كـ PDF
                      </Button>
                      
                      <Button 
                        onClick={toggleEmailInput}
                        variant="outline" 
                        className="flex items-center gap-2"
                        disabled={emailState.sent}
                      >
                        <Mail className="h-4 w-4" />
                        {emailState.sent ? 'تم الإرسال' : 'إرسال بالإيميل'}
                      </Button>
                    </div>

                    {emailState.isVisible && (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <Input
                          type="email"
                          placeholder="أدخل الإيميل"
                          value={emailState.email}
                          onChange={(e) => setEmailState(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleEmailSend}
                            disabled={!emailState.email || emailState.isSending}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {emailState.isSending ? 'جاري الإرسال...' : 'إرسال'}
                          </Button>
                          <Button 
                            onClick={() => setEmailState(prev => ({ ...prev, isVisible: false }))}
                            variant="outline"
                            size="sm"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}

                    {emailState.sent && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          تم إرسال التقرير لإيميلك بنجاح
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-fit">
                <CardContent className="p-8 text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">جاهز للتحليل</h3>
                  <p className="text-gray-500">
                    أدخل دخلك الشهري ومصاريفك في النموذج المجاور للحصول على تحليل ذكي لميزانيتك
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              هل تريد تتبعاً متقدماً لميزانيتك؟
            </h2>
            <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
              اكتشف ميزات التتبع التلقائي، التنبيهات الذكية، والتحليل المتعمق لعاداتك المالية
            </p>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
            >
              استكشف الميزات المتقدمة قريباً
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}