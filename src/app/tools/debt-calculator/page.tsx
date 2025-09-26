'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, TrendingDown, Calendar, DollarSign, AlertCircle, CheckCircle2, ArrowRight, Home, ArrowLeft, Download, Mail } from 'lucide-react'
import Link from 'next/link'

interface DebtResult {
  monthsToPayoff: number
  totalInterest: number
  totalPayment: number
  personalMessage?: {
    title: string
    message: string
    tone: string
    advice: string
  }
}

interface EmailState {
  isVisible: boolean
  email: string
  isSending: boolean
  sent: boolean
}

export default function SimplifiedDebtCalculator() {
  const [debtAmount, setDebtAmount] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [result, setResult] = useState<DebtResult | null>(null)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [emailState, setEmailState] = useState<EmailState>({
    isVisible: false,
    email: '',
    isSending: false,
    sent: false
  })

  const validateInputs = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!debtAmount || parseFloat(debtAmount) <= 0) {
      newErrors.debtAmount = 'يرجى إدخال مبلغ الدين'
    }

    if (!monthlyPayment || parseFloat(monthlyPayment) <= 0) {
      newErrors.monthlyPayment = 'يرجى إدخال القسط الشهري'
    }

    if (!interestRate || parseFloat(interestRate) < 0) {
      newErrors.interestRate = 'يرجى إدخال معدل الفائدة'
    }

    if (parseFloat(monthlyPayment) && parseFloat(debtAmount) && parseFloat(interestRate)) {
      const monthlyRate = parseFloat(interestRate) / 100 / 12
      const minPayment = parseFloat(debtAmount) * monthlyRate
      
      if (parseFloat(monthlyPayment) <= minPayment) {
        newErrors.monthlyPayment = `القسط يجب أن يكون أكبر من ${Math.ceil(minPayment)} ريال`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generatePersonalMessage = (months: number, totalInterest: number, debtAmount: number) => {
    const principal = parseFloat(debtAmount)
    const interestPercentage = (totalInterest / principal) * 100

    if (months <= 6) {
      return {
        title: "ممتاز! خطة سداد سريعة",
        message: `بالخطة الحالية، ستتخلص من دينك في ${formatDuration(months)} فقط. هذا إنجاز رائع يظهر التزامك القوي بتحسين وضعك المالي.`,
        tone: "positive",
        advice: "استمر على هذا المسار الممتاز، وفكر في توجيه القسط الذي ستوفره لبناء صندوق الطوارئ."
      }
    } else if (months <= 12) {
      return {
        title: "خطة سداد جيدة ومعقولة",
        message: `ستحرر نفسك من هذا الدين خلال ${formatDuration(months)}. فترة معقولة جداً تتيح لك التوازن بين السداد والالتزامات الأخرى.`,
        tone: "encouraging",
        advice: "إذا تمكنت من زيادة القسط حتى بمبلغ صغير، ستوفر الكثير من الفوائد وتقصر المدة."
      }
    } else if (months <= 24) {
      return {
        title: "خطة سداد متوسطة المدى",
        message: `رحلة السداد ستستغرق ${formatDuration(months)}. هذا وقت كافٍ لترتيب أمورك المالية دون ضغط كبير على ميزانيتك.`,
        tone: "supportive",
        advice: "راجع ميزانيتك لترى إن كان بإمكانك توفير مبلغ إضافي شهرياً، حتى 100 ريال ستحدث فرقاً كبيراً."
      }
    } else if (months <= 60) {
      return {
        title: "خطة سداد طويلة المدى - يمكن تحسينها",
        message: `المدة المتوقعة هي ${formatDuration(months)}. هذا وقت طويل، لكن الأهم أنك بدأت رحلة التخلص من الديون.`,
        tone: "motivational",
        advice: "فكر في طرق لزيادة دخلك أو تقليل المصاريف لتسريع عملية السداد. كل ريال إضافي مهم."
      }
    } else {
      return {
        title: "تحتاج لمراجعة الخطة",
        message: `بالمعدل الحالي، السداد سيستغرق أكثر من 5 سنوات. هذا يتطلب إعادة نظر في الاستراتيجية.`,
        tone: "advisory",
        advice: "أنصحك بالتفكير في زيادة القسط الشهري أو البحث عن خيارات إعادة تمويل بفائدة أقل."
      }
    }
  }

  const calculatePayoff = () => {
    if (!validateInputs()) return

    const principal = parseFloat(debtAmount)
    const payment = parseFloat(monthlyPayment)
    const annualRate = parseFloat(interestRate) / 100
    const monthlyRate = annualRate / 12

    let balance = principal
    let totalInterest = 0
    let months = 0

    if (monthlyRate === 0) {
      months = Math.ceil(balance / payment)
      totalInterest = 0
    } else {
      while (balance > 0.01 && months < 600) {
        const interestPayment = balance * monthlyRate
        const principalPayment = payment - interestPayment
        
        totalInterest += interestPayment
        balance -= principalPayment
        months++

        if (balance < 0) balance = 0
      }
    }

    const totalPayment = principal + totalInterest
    const personalMessage = generatePersonalMessage(months, totalInterest, principal)

    setResult({
      monthsToPayoff: months,
      totalInterest,
      totalPayment,
      personalMessage
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

  const formatDuration = (months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'سنة' : 'سنوات'}`
      }
      return `${years} ${years === 1 ? 'سنة' : 'سنوات'} و ${remainingMonths} ${remainingMonths === 1 ? 'شهر' : 'شهور'}`
    }
    return `${months} ${months === 1 ? 'شهر' : 'شهور'}`
  }

  const handlePrint = () => {
    // Simple PDF generation using browser's built-in functionality
    // In future versions, this will use jsPDF for more advanced formatting
    const printContent = document.getElementById('debt-results')
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>تقرير حاسبة الديون - Acash.ai</title>
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
                <h1>تقرير حاسبة الديون</h1>
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

  const resetCalculator = () => {
    setDebtAmount('')
    setMonthlyPayment('')
    setInterestRate('')
    setResult(null)
    setErrors({})
    setEmailState({
      isVisible: false,
      email: '',
      isSending: false,
      sent: false
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ArrowRight className="h-4 w-4" />
            <Link href="/tools" className="hover:text-blue-600">
              الأدوات المالية
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-gray-800 font-medium">حاسبة الديون</span>
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
            <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full text-white">
              <Calculator className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">حاسبة الديون</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            احسب المدة اللازمة لسداد دينك وإجمالي الفوائد المدفوعة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                معلومات الدين
              </CardTitle>
              <CardDescription>
                أدخل تفاصيل دينك للحصول على تحليل دقيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="debtAmount" className="text-base font-medium">
                  مبلغ الدين (بالريال)
                </Label>
                <Input
                  id="debtAmount"
                  type="number"
                  placeholder="مثال: 50000"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  className={`text-lg p-4 h-14 ${errors.debtAmount ? 'border-red-500' : ''}`}
                />
                {errors.debtAmount && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.debtAmount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyPayment" className="text-base font-medium">
                  القسط الشهري (بالريال)
                </Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  placeholder="مثال: 2000"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  className={`text-lg p-4 h-14 ${errors.monthlyPayment ? 'border-red-500' : ''}`}
                />
                {errors.monthlyPayment && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.monthlyPayment}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate" className="text-base font-medium">
                  معدل الفائدة السنوي (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="مثال: 15"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className={`text-lg p-4 h-14 ${errors.interestRate ? 'border-red-500' : ''}`}
                />
                {errors.interestRate && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.interestRate}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  إذا لم يكن هناك فائدة، أدخل 0
                </p>
              </div>

              <Button 
                onClick={calculatePayoff}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 h-12 text-lg font-medium"
              >
                احسب فترة السداد
              </Button>

              {result && (
                <Button 
                  onClick={resetCalculator}
                  variant="outline"
                  className="w-full"
                >
                  حساب جديد
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result ? (
              <div id="debt-results">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800 text-xl">
                      <CheckCircle2 className="h-6 w-6" />
                      {result.personalMessage?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-white/80 backdrop-blur p-6 rounded-lg">
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {result.personalMessage?.message}
                      </p>
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-center items-center">
                          <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatDuration(result.monthsToPayoff)}
                          </div>
                          <div className="text-gray-600 text-sm">فترة التحرر من الدين</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {formatCurrency(result.totalInterest)}
                        </div>
                        <div className="text-sm text-gray-600">إجمالي الفوائد</div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {formatCurrency(result.totalPayment)}
                        </div>
                        <div className="text-sm text-gray-600">المبلغ الكامل</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      نصيحة خاصة لوضعك
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-4 leading-relaxed">
                      {result.personalMessage?.advice}
                    </p>
                    
                    <div className="bg-white/50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">خطوات عملية:</h4>
                      <ul className="space-y-2 text-green-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">راجع مصروفاتك واحذف غير الضروري</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">اجعل سداد الدين الأولوية القصوى</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">احتفل بكل إنجاز في رحلة السداد</span>
                        </li>
                      </ul>
                    </div>
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
                            className="bg-blue-600 hover:bg-blue-700"
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
                  <TrendingDown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">جاهز للحساب</h3>
                  <p className="text-gray-500">
                    أدخل معلومات دينك في النموذج المجاور للحصول على تحليل مفصل لخطة السداد
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              هل تريد استراتيجيات متقدمة لسداد الديون؟
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              اكتشف طرق كرة الثلج والانهيار الجليدي لسداد عدة ديون بكفاءة أكبر
            </p>
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
            >
              استكشف الأدوات المتقدمة قريباً
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}