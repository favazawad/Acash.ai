'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calculator, TrendingDown, Calendar, DollarSign, Target, Plus, Trash2, BarChart3 } from 'lucide-react'

interface Debt {
  id: string
  name: string
  balance: number
  minPayment: number
  interestRate: number
}

interface PayoffResult {
  debt: Debt
  monthsToPayoff: number
  totalInterest: number
  totalPayment: number
}

interface PayoffStrategy {
  method: 'snowball' | 'avalanche'
  results: PayoffResult[]
  totalTime: number
  totalInterest: number
  savings: number
}

export default function DebtCalculatorPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'بطاقة ائتمان', balance: 15000, minPayment: 450, interestRate: 18 }
  ])
  const [extraPayment, setExtraPayment] = useState(0)
  const [results, setResults] = useState<{
    snowball: PayoffStrategy | null
    avalanche: PayoffStrategy | null
  }>({ snowball: null, avalanche: null })

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      balance: 0,
      minPayment: 0,
      interestRate: 0
    }
    setDebts([...debts, newDebt])
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ))
  }

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id))
    }
  }

  const calculatePayoffTime = (balance: number, payment: number, rate: number): PayoffResult => {
    const monthlyRate = rate / 100 / 12
    let currentBalance = balance
    let months = 0
    let totalInterest = 0

    if (payment <= currentBalance * monthlyRate) {
      return {
        debt: { id: '', name: '', balance, minPayment: payment, interestRate: rate },
        monthsToPayoff: 999,
        totalInterest: 999999,
        totalPayment: 999999
      }
    }

    while (currentBalance > 0.01 && months < 600) {
      const interestCharge = currentBalance * monthlyRate
      const principalPayment = payment - interestCharge
      
      totalInterest += interestCharge
      currentBalance -= principalPayment
      months++

      if (currentBalance < 0) currentBalance = 0
    }

    return {
      debt: { id: '', name: '', balance, minPayment: payment, interestRate: rate },
      monthsToPayoff: months,
      totalInterest,
      totalPayment: balance + totalInterest
    }
  }

  const calculateStrategy = (method: 'snowball' | 'avalanche'): PayoffStrategy => {
    const validDebts = debts.filter(debt => debt.balance > 0 && debt.minPayment > 0)
    const totalMinPayments = validDebts.reduce((sum, debt) => sum + debt.minPayment, 0)
    const totalExtraPayment = extraPayment

    // Sort debts based on strategy
    const sortedDebts = [...validDebts].sort((a, b) => {
      if (method === 'snowball') {
        return a.balance - b.balance // Smallest balance first
      } else {
        return b.interestRate - a.interestRate // Highest interest first
      }
    })

    const results: PayoffResult[] = []
    let remainingDebts = [...sortedDebts]
    let currentExtraPayment = totalExtraPayment
    let totalMonths = 0

    while (remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0]
      const paymentForThisDebt = targetDebt.minPayment + currentExtraPayment

      const result = calculatePayoffTime(
        targetDebt.balance,
        paymentForThisDebt,
        targetDebt.interestRate
      )

      result.debt = targetDebt
      results.push(result)

      totalMonths = Math.max(totalMonths, result.monthsToPayoff)
      currentExtraPayment += targetDebt.minPayment // Add freed up payment
      remainingDebts.shift()
    }

    const totalInterest = results.reduce((sum, result) => sum + result.totalInterest, 0)
    
    return {
      method,
      results,
      totalTime: totalMonths,
      totalInterest,
      savings: 0
    }
  }

  const calculateBothStrategies = () => {
    const snowball = calculateStrategy('snowball')
    const avalanche = calculateStrategy('avalanche')
    
    // Calculate savings
    if (snowball.totalInterest > avalanche.totalInterest) {
      avalanche.savings = snowball.totalInterest - avalanche.totalInterest
    } else {
      snowball.savings = avalanche.totalInterest - snowball.totalInterest
    }

    setResults({ snowball, avalanche })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonths = (months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return remainingMonths > 0 
        ? `${years} سنة و ${remainingMonths} شهر`
        : `${years} سنة`
    }
    return `${months} شهر`
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full text-white">
              <Calculator className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">حاسبة الديون المتقدمة</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            احسب أفضل استراتيجية لسداد ديونك ووفر آلاف الريالات من الفوائد
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Debt Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  ملخص الديون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">إجمالي الديون</div>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(totalDebt)}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">الحد الأدنى للسداد</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalMinPayment)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>قائمة الديون</span>
                  <Button onClick={addDebt} size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    إضافة دين
                  </Button>
                </CardTitle>
                <CardDescription>
                  أدخل تفاصيل كل دين لحساب أفضل استراتيجية سداد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {debts.map((debt, index) => (
                  <div key={debt.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">دين #{index + 1}</span>
                      {debts.length > 1 && (
                        <Button
                          onClick={() => removeDebt(debt.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`name-${debt.id}`} className="text-sm">اسم الدين</Label>
                        <Input
                          id={`name-${debt.id}`}
                          value={debt.name}
                          onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                          placeholder="مثال: بطاقة ائتمان"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`balance-${debt.id}`} className="text-sm">الرصيد المتبقي</Label>
                        <Input
                          id={`balance-${debt.id}`}
                          type="number"
                          value={debt.balance || ''}
                          onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                          placeholder="مثال: 15000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`payment-${debt.id}`} className="text-sm">الحد الأدنى للسداد</Label>
                        <Input
                          id={`payment-${debt.id}`}
                          type="number"
                          value={debt.minPayment || ''}
                          onChange={(e) => updateDebt(debt.id, 'minPayment', parseFloat(e.target.value) || 0)}
                          placeholder="مثال: 450"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rate-${debt.id}`} className="text-sm">معدل الفائدة السنوي (%)</Label>
                        <Input
                          id={`rate-${debt.id}`}
                          type="number"
                          step="0.1"
                          value={debt.interestRate || ''}
                          onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                          placeholder="مثال: 18"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Extra Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  مبلغ إضافي للسداد
                </CardTitle>
                <CardDescription>
                  كم تستطيع دفع إضافة على الحد الأدنى شهرياً؟
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={extraPayment || ''}
                  onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                  placeholder="مثال: 500"
                  className="text-lg p-4 h-12"
                />
              </CardContent>
            </Card>

            {/* Calculate Button */}
            <Button 
              onClick={calculateBothStrategies}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 h-12 text-lg"
              disabled={debts.some(debt => debt.balance <= 0 || debt.minPayment <= 0)}
            >
              احسب استراتيجية السداد الأمثل
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results.snowball && results.avalanche ? (
              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comparison">مقارنة</TabsTrigger>
                  <TabsTrigger value="snowball">كرة الثلج</TabsTrigger>
                  <TabsTrigger value="avalanche">الانهيار الجليدي</TabsTrigger>
                </TabsList>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>مقارنة الاستراتيجيات</CardTitle>
                      <CardDescription>
                        اختر الاستراتيجية التي تناسب أهدافك المالية
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Snowball Strategy */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800">استراتيجية كرة الثلج</h3>
                          <Badge variant="secondary">الأسرع نفسياً</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">وقت السداد:</span>
                            <span className="font-medium ml-2">{formatMonths(results.snowball.totalTime)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">إجمالي الفوائد:</span>
                            <span className="font-medium ml-2">{formatCurrency(results.snowball.totalInterest)}</span>
                          </div>
                        </div>
                        {results.snowball.savings > 0 && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <span className="text-green-600 font-medium">
                              توفير: {formatCurrency(results.snowball.savings)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Avalanche Strategy */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800">استراتيجية الانهيار الجليدي</h3>
                          <Badge variant="secondary">الأوفر مالياً</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">وقت السداد:</span>
                            <span className="font-medium ml-2">{formatMonths(results.avalanche.totalTime)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">إجمالي الفوائد:</span>
                            <span className="font-medium ml-2">{formatCurrency(results.avalanche.totalInterest)}</span>
                          </div>
                        </div>
                        {results.avalanche.savings > 0 && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <span className="text-green-600 font-medium">
                              توفير: {formatCurrency(results.avalanche.savings)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Recommendation */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">التوصية:</h4>
                        <p className="text-blue-700 text-sm">
                          {results.avalanche.savings > results.snowball.savings
                            ? "استراتيجية الانهيار الجليدي توفر أكثر على المدى الطويل"
                            : "استراتيجية كرة الثلج قد تكون أفضل للدافعية النفسية"
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Snowball Details */}
                <TabsContent value="snowball">
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل استراتيجية كرة الثلج</CardTitle>
                      <CardDescription>
                        ادفع الديون الأصغر أولاً لبناء الزخم النفسي
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.snowball.results.map((result, index) => (
                          <div key={result.debt.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{result.debt.name || `دين #${index + 1}`}</h4>
                              <Badge>ترتيب #{index + 1}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">الرصيد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.debt.balance)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">وقت السداد:</span>
                                <span className="font-medium ml-2">{formatMonths(result.monthsToPayoff)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الفوائد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.totalInterest)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">إجمالي السداد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.totalPayment)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Avalanche Details */}
                <TabsContent value="avalanche">
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل استراتيجية الانهيار الجليدي</CardTitle>
                      <CardDescription>
                        ادفع الديون ذات الفائدة الأعلى أولاً لتوفير أكبر
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.avalanche.results.map((result, index) => (
                          <div key={result.debt.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{result.debt.name || `دين #${index + 1}`}</h4>
                              <Badge>ترتيب #{index + 1}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">الرصيد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.debt.balance)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">وقت السداد:</span>
                                <span className="font-medium ml-2">{formatMonths(result.monthsToPayoff)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">الفوائد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.totalInterest)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">إجمالي السداد:</span>
                                <span className="font-medium ml-2">{formatCurrency(result.totalPayment)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">جاهز للحساب</h3>
                  <p className="text-gray-500">
                    أدخل تفاصيل ديونك واضغط على "احسب استراتيجية السداد الأمثل" لرؤية النتائج
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
