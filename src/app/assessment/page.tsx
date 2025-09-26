'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, ArrowLeft, ArrowRight, Target, TrendingUp, Shield, PiggyBank } from 'lucide-react'
import { Header } from '@/components/Header'

interface AssessmentData {
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  currentDebt: number
  primaryGoal: string
}

interface FinancialScore {
  overall: number
  cashFlow: number
  savings: number
  debt: number
  details: {
    title: string
    message: string
    recommendations: string[]
  }
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    currentDebt: 0,
    primaryGoal: ''
  })
  const [showResults, setShowResults] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const steps = [
    {
      title: "الدخل الشهري",
      subtitle: "لنبدأ بفهم دخلك الشهري الصافي",
      field: "monthlyIncome",
      label: "الدخل الشهري الصافي (بالريال)",
      placeholder: "مثال: 8000",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />
    },
    {
      title: "المصروفات الشهرية",
      subtitle: "ما هو إجمالي إنفاقك الشهري التقديري؟",
      field: "monthlyExpenses",
      label: "المصروفات الشهرية (بالريال)",
      placeholder: "مثال: 6000",
      icon: <Target className="h-8 w-8 text-green-600" />
    },
    {
      title: "المدخرات الحالية",
      subtitle: "كم لديك في المدخرات والاستثمارات؟",
      field: "currentSavings",
      label: "إجمالي المدخرات والاستثمارات (بالريال)",
      placeholder: "مثال: 25000",
      icon: <PiggyBank className="h-8 w-8 text-purple-600" />
    },
    {
      title: "الديون الحالية",
      subtitle: "ما هو إجمالي مبلغ الديون (باستثناء الرهن العقاري)؟",
      field: "currentDebt",
      label: "إجمالي الديون (بطاقات ائتمان، قروض شخصية، إلخ)",
      placeholder: "مثال: 15000",
      icon: <Shield className="h-8 w-8 text-orange-600" />
    },
    {
      title: "الهدف المالي الأساسي",
      subtitle: "ما هو هدفك المالي الأهم حالياً؟",
      field: "primaryGoal",
      label: "اختر هدفك الأساسي",
      placeholder: "",
      icon: <CheckCircle className="h-8 w-8 text-teal-600" />
    }
  ]

  const goalOptions = [
    { value: "save_more", label: "ادخار المزيد من المال" },
    { value: "reduce_debt", label: "تقليل الديون" },
    { value: "invest", label: "بدء الاستثمار أو تنميته" },
    { value: "buy_home", label: "الادخار لشراء منزل" },
    { value: "emergency_fund", label: "بناء صندوق الطوارئ" },
    { value: "retire", label: "التخطيط للتقاعد" },
    { value: "other", label: "أهداف أخرى" }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}
    const currentField = steps[step].field as keyof AssessmentData

    if (step < 4) {
      const value = assessmentData[currentField] as number
      if (!value || value <= 0) {
        newErrors[currentField] = "يرجى إدخال قيمة صحيحة"
        setErrors(newErrors)
        return false
      }
    } else {
      if (!assessmentData.primaryGoal) {
        newErrors.primaryGoal = "يرجى اختيار هدف مالي"
        setErrors(newErrors)
        return false
      }
    }

    setErrors({})
    return true
  }

  const calculateFinancialScore = (data: AssessmentData): FinancialScore => {
    const { monthlyIncome, monthlyExpenses, currentSavings, currentDebt } = data

    // Cash Flow Score (0-40 points)
    const monthlyCashFlow = monthlyIncome - monthlyExpenses
    const cashFlowRatio = monthlyCashFlow / monthlyIncome
    let cashFlowScore = 0
    if (cashFlowRatio > 0.3) cashFlowScore = 40
    else if (cashFlowRatio > 0.2) cashFlowScore = 30
    else if (cashFlowRatio > 0.1) cashFlowScore = 20
    else if (cashFlowRatio > 0) cashFlowScore = 10

    // Savings Score (0-30 points)
    const monthsOfExpenses = currentSavings / monthlyExpenses
    let savingsScore = 0
    if (monthsOfExpenses >= 6) savingsScore = 30
    else if (monthsOfExpenses >= 3) savingsScore = 20
    else if (monthsOfExpenses >= 1) savingsScore = 10
    else if (currentSavings > 0) savingsScore = 5

    // Debt Score (0-30 points)
    const debtToIncomeRatio = (currentDebt / monthlyIncome) / 12
    let debtScore = 0
    if (currentDebt === 0) debtScore = 30
    else if (debtToIncomeRatio < 0.1) debtScore = 25
    else if (debtToIncomeRatio < 0.2) debtScore = 20
    else if (debtToIncomeRatio < 0.3) debtScore = 15
    else if (debtToIncomeRatio < 0.5) debtScore = 10
    else debtScore = 5

    const overallScore = cashFlowScore + savingsScore + debtScore

    let scoreDetails
    if (overallScore >= 80) {
      scoreDetails = {
        title: "صحة مالية ممتازة!",
        message: "لديك أسس مالية قوية جداً. استمر في هذا المسار الرائع.",
        recommendations: [
          "استمر في الادخار والاستثمار بانتظام",
          "فكر في تنويع محفظتك الاستثمارية",
          "راجع أهدافك المالية طويلة المدى"
        ]
      }
    } else if (overallScore >= 60) {
      scoreDetails = {
        title: "صحة مالية جيدة",
        message: "لديك أساس مالي جيد مع وجود مجال للتحسين.",
        recommendations: [
          "ركز على زيادة صندوق الطوارئ",
          "قلل النفقات غير الضرورية",
          "ابدأ أو زد من استثماراتك الشهرية"
        ]
      }
    } else if (overallScore >= 40) {
      scoreDetails = {
        title: "صحة مالية متوسطة",
        message: "تحتاج لبعض التحسينات المهمة في إدارة أموالك.",
        recommendations: [
          "ضع ميزانية شهرية واضحة",
          "ابدأ ببناء صندوق طوارئ صغير",
          "راجع ديونك وضع خطة سداد"
        ]
      }
    } else {
      scoreDetails = {
        title: "تحتاج لاهتمام فوري",
        message: "وضعك المالي يحتاج لتحسينات جذرية وسريعة.",
        recommendations: [
          "قلل النفقات فوراً",
          "ضع خطة طوارئ لسداد الديون",
          "فكر في زيادة مصادر الدخل",
          "استشر مختص مالي"
        ]
      }
    }

    return {
      overall: overallScore,
      cashFlow: (cashFlowScore / 40) * 100,
      savings: (savingsScore / 30) * 100,
      debt: (debtScore / 30) * 100,
      details: scoreDetails
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleInputChange = (field: keyof AssessmentData, value: string | number) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setShowResults(false)
    setAssessmentData({
      monthlyIncome: 0,
      monthlyExpenses: 0,
      currentSavings: 0,
      currentDebt: 0,
      primaryGoal: ''
    })
    setErrors({})
  }

  if (showResults) {
    const score = calculateFinancialScore(assessmentData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
        <Header />
        <div className="max-w-4xl mx-auto pt-10">
          <Card className="shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <CardTitle className="text-2xl font-bold">نتائج تقييمك المالي</CardTitle>
              <CardDescription className="text-blue-100">
                تحليل شامل لوضعك المالي الحالي
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white mb-4">
                  <div>
                    <div className="text-3xl font-bold">{score.overall}</div>
                    <div className="text-sm">من 100</div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{score.details.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">{score.details.message}</p>
              </div>

              {/* Detailed Scores */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">التدفق النقدي</h3>
                    <div className="text-2xl font-bold text-blue-600">{Math.round(score.cashFlow)}%</div>
                    <Progress value={score.cashFlow} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <PiggyBank className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">المدخرات</h3>
                    <div className="text-2xl font-bold text-purple-600">{Math.round(score.savings)}%</div>
                    <Progress value={score.savings} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">إدارة الديون</h3>
                    <div className="text-2xl font-bold text-green-600">{Math.round(score.debt)}%</div>
                    <Progress value={score.debt} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">توصيات للتحسين</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {score.details.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mt-8">
                <Button onClick={handleRestart} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  إعادة التقييم
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  استكشاف الأدوات المالية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <Header />
      <div className="max-w-2xl mx-auto pt-10">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تقييم الصحة المالية</h1>
          <p className="text-gray-600 mb-4">اكتشف نقاط قوتك المالية ومجالات التحسين</p>
          <div className="mb-2">
            <span className="text-sm text-gray-500">الخطوة {currentStep + 1} من {steps.length}</span>
          </div>
          <Progress value={progress} className="max-w-md mx-auto" />
        </div>

        {/* Assessment Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {currentStepData!.icon}
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {currentStepData!.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStepData!.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {currentStep < 4 ? (
              <div className="space-y-4">
                <Label htmlFor={currentStepData!.field} className="text-base font-medium">
                  {currentStepData!.label}
                </Label>
                <Input
                  id={currentStepData!.field}
                  type="number"
                  placeholder={currentStepData!.placeholder}
                  value={assessmentData[currentStepData!.field as keyof AssessmentData] || ''}
                  onChange={(e) => handleInputChange(
                    currentStepData!.field as keyof AssessmentData, 
                    parseFloat(e.target.value) || 0
                  )}
                  className={`text-lg p-4 h-14 ${errors[currentStepData!.field] ? 'border-red-500' : ''}`}
                />
                {errors[currentStepData!.field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[currentStepData!.field]}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-base font-medium">{currentStepData!.label}</Label>
                <div className="grid gap-3">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('primaryGoal', option.value)}
                      className={`p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                        assessmentData.primaryGoal === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.primaryGoal && (
                  <p className="text-red-500 text-sm mt-1">{errors.primaryGoal}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                السابق
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'عرض النتائج' : 'التالي'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
