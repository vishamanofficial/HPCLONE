'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Calculator,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  Smartphone,
  Globe,
  Tablet,
  ShoppingBag,
  Truck,
  HeartPulse,
  Cpu,
  CalendarDays,
  GraduationCap,
  Tv,
  Dumbbell,
  Navigation,
  Layout,
  Activity,
  Gamepad2,
  Users,
  FileText,
  BarChart3,
  BellRing,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Apple } from '@/components/ui/BrandIcons';
import { calculatorQuestions, CalculatorQuestion, runCalculation, formatPrice } from '@/data/calculatorQuestions';

const iconMap: Record<string, any> = {
  Smartphone,
  Globe,
  Apple,
  Tablet,
  ShoppingBag,
  Layers,
  Truck,
  HeartPulse,
  Cpu,
  CalendarDays,
  GraduationCap,
  Tv,
  Dumbbell,
  Navigation,
  MoreHorizontal,
  Layout,
  Sparkles,
  Activity,
  Gamepad2,
  Users,
  FileText,
  BarChart3,
  BellRing,
};

export default function AdminCalculatorPricingPage() {
  const { success, error } = useToast();

  const [currency, setCurrency] = useState('$');
  const [baseWeeks, setBaseWeeks] = useState(6);
  const [questions, setQuestions] = useState<CalculatorQuestion[]>(calculatorQuestions);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // Live Simulator state
  const [simulatorSelections, setSimulatorSelections] = useState<Record<string, string | string[]>>({
    platform: 'android',
    category: 'ecommerce',
    design: 'custom',
    management: ['users', 'content']
  });

  const fetchCalculatorSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminCalculator();
      if (res?.success && res.settings) {
        if (res.settings.currency) setCurrency(res.settings.currency);
        if (res.settings.baseWeeks) setBaseWeeks(res.settings.baseWeeks);
        if (res.settings.questions && Array.isArray(res.settings.questions) && res.settings.questions.length > 0) {
          setQuestions(res.settings.questions);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load calculator settings, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculatorSettings();
  }, []);

  const handleOptionChange = (stepIndex: number, optionIndex: number, field: string, value: any) => {
    setQuestions((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[stepIndex].options[optionIndex][field] = value;
      return updated;
    });
  };

  const handleQuestionTextChange = (stepIndex: number, field: 'question' | 'description', value: string) => {
    setQuestions((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[stepIndex][field] = value;
      return updated;
    });
  };

  const handleAddOption = (stepIndex: number) => {
    setQuestions((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const step = updated[stepIndex];
      const newId = `custom_${Date.now().toString(36)}`;

      if (step.id === 'platform') {
        step.options.push({
          id: newId,
          label: 'New Platform',
          iconName: 'Smartphone',
          baseCost: 4000
        });
      } else if (step.id === 'category') {
        step.options.push({
          id: newId,
          label: 'New Category',
          iconName: 'ShoppingBag',
          multiplier: 1.2
        });
      } else if (step.id === 'design') {
        step.options.push({
          id: newId,
          label: 'New Theme',
          iconName: 'Sparkles',
          multiplier: 1.3
        });
      } else {
        step.options.push({
          id: newId,
          label: 'New Management Feature',
          iconName: 'Layers',
          flatCost: 1000
        });
      }
      return updated;
    });
  };

  const handleRemoveOption = (stepIndex: number, optionIndex: number) => {
    setQuestions((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (updated[stepIndex].options.length <= 1) {
        error('A step must have at least one selectable option.');
        return prev;
      }
      updated[stepIndex].options.splice(optionIndex, 1);
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateAdminCalculator({
        currency,
        baseWeeks: Number(baseWeeks) || 6,
        questions
      });
      if (res?.success) {
        success('Calculator pricing rules and multipliers saved successfully!');
      } else {
        throw new Error(res?.message || 'Failed to save pricing rules');
      }
    } catch (err: any) {
      error(err.message || 'Error saving calculator rules');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all calculator prices and formulas back to the factory defaults? Any custom numbers will be overwritten.')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await api.resetAdminCalculator();
      if (res?.success) {
        setCurrency('$');
        setBaseWeeks(6);
        setQuestions(calculatorQuestions);
        success('Calculator pricing rules restored to factory defaults!');
      } else {
        throw new Error(res?.message || 'Failed to reset rules');
      }
    } catch (err: any) {
      error(err.message || 'Error resetting calculator rules');
    } finally {
      setIsResetting(false);
    }
  };

  // Live simulation calculation
  const simResult = runCalculation(simulatorSelections, questions, baseWeeks);

  const renderIcon = (name: string, className: string = 'w-5 h-5') => {
    if (name === 'Apple') return <Apple className={className} />;
    const Comp = iconMap[name] || HelpCircle;
    return <Comp className={className} />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-text-muted">Loading Calculator Rules...</span>
      </div>
    );
  }

  const activeQuestionIndex = Math.max(0, Math.min(activeStepTab - 1, questions.length - 1));
  const currentQ = questions[activeQuestionIndex];

  return (
    <div className="flex flex-col gap-8 pb-16 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">
              Cost Calculator Pricing Engine
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            Control baseline platform costs, app category multipliers, design themes, and administrative add-ons. Changes update the public calculator instantly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/app-cost-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-surface text-xs font-bold text-text-primary transition-colors"
          >
            <span>View Live Calculator</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
            isLoading={isResetting}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset to Baseline
          </Button>

          <Button
            type="button"
            variant="gradient"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Pricing Rules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Settings (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Global Parameters Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-text-primary pb-3 border-b border-border flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Global Pricing & Timeline Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Currency Symbol / Prefix
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="e.g. $, ₹, €, £, AED"
                    className="font-mono text-base font-bold text-primary"
                    required
                  />
                  <div className="flex gap-1.5 shrink-0">
                    {['$', '₹', '€', '£', 'AED'].map((sym) => (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => setCurrency(sym)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          currency === sym
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface border-border hover:border-primary/40 text-text-secondary'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-1.5">
                  Displayed before every calculated dollar amount on the public wizard and lead submissions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Baseline Minimum Timeline (Weeks)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted shrink-0" />
                  <Input
                    type="number"
                    min="1"
                    max="52"
                    value={baseWeeks}
                    onChange={(e) => setBaseWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                    placeholder="6"
                    className="font-mono"
                    required
                  />
                  <span className="text-xs font-bold text-text-secondary whitespace-nowrap">Weeks</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1.5">
                  Starting project baseline before platform, feature, and theme multipliers are applied.
                </p>
              </div>
            </div>
          </div>

          {/* Step Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/80">
            {questions.map((q, idx) => (
              <button
                type="button"
                key={q.id}
                onClick={() => setActiveStepTab(idx + 1)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStepTab === idx + 1
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeStepTab === idx + 1 ? 'bg-white/25 text-white' : 'bg-surface border border-border text-text-muted'
                }`}>
                  {idx + 1}
                </span>
                <span>
                  {q.id === 'platform' && 'Step 1: Platforms'}
                  {q.id === 'category' && 'Step 2: Categories'}
                  {q.id === 'design' && 'Step 3: UI Themes'}
                  {q.id === 'management' && 'Step 4: Management Features'}
                </span>
              </button>
            ))}
          </div>

          {/* Active Question Editor Card */}
          {currentQ && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full max-w-xl">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Step {currentQ.step} Question Title
                  </label>
                  <Input
                    value={currentQ.question}
                    onChange={(e) => handleQuestionTextChange(activeQuestionIndex, 'question', e.target.value)}
                    className="font-bold text-sm"
                  />
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted mt-2">
                    Subtitle Instructions
                  </label>
                  <Input
                    value={currentQ.description}
                    onChange={(e) => handleQuestionTextChange(activeQuestionIndex, 'description', e.target.value)}
                    className="text-xs text-text-secondary"
                  />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddOption(activeQuestionIndex)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  Add Option
                </Button>
              </div>

              {/* Options Table / Cards */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted px-2">
                  <span>Option Details</span>
                  <span>
                    {currentQ.id === 'platform' && 'Starting Base Cost'}
                    {(currentQ.id === 'category' || currentQ.id === 'design') && 'Multiplier Factor (e.g. 1.25 = +25%)'}
                    {currentQ.id === 'management' && 'Flat Add-on Cost'}
                  </span>
                </div>

                {currentQ.options.map((opt, optIdx) => (
                  <div
                    key={opt.id}
                    className="p-4 rounded-2xl bg-surface/70 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                      <span className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shrink-0 shadow-xs">
                        {renderIcon(opt.iconName, 'w-5 h-5')}
                      </span>
                      <div className="flex flex-col gap-1 flex-1">
                        <Input
                          value={opt.label}
                          onChange={(e) => handleOptionChange(activeQuestionIndex, optIdx, 'label', e.target.value)}
                          placeholder="Option Label"
                          className="font-semibold text-xs py-1.5"
                        />
                        <span className="text-[10px] font-mono text-text-muted">
                          ID: {opt.id}
                        </span>
                      </div>
                    </div>

                    {/* Pricing Field */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {currentQ.id === 'platform' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-muted">{currency}</span>
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            value={opt.baseCost ?? 0}
                            onChange={(e) =>
                              handleOptionChange(activeQuestionIndex, optIdx, 'baseCost', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className="w-32 font-mono font-bold text-sm text-right"
                          />
                        </div>
                      )}

                      {(currentQ.id === 'category' || currentQ.id === 'design') && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-muted">×</span>
                          <Input
                            type="number"
                            min="0.5"
                            max="5.0"
                            step="0.05"
                            value={opt.multiplier ?? 1.0}
                            onChange={(e) =>
                              handleOptionChange(activeQuestionIndex, optIdx, 'multiplier', Math.max(0.1, parseFloat(e.target.value) || 1.0))
                            }
                            className="w-28 font-mono font-bold text-sm text-right"
                          />
                          <span className="text-[11px] font-bold text-emerald-500 w-12 text-right">
                            {opt.multiplier && opt.multiplier > 1
                              ? `+${Math.round((opt.multiplier - 1) * 100)}%`
                              : opt.multiplier && opt.multiplier < 1
                              ? `-${Math.round((1 - opt.multiplier) * 100)}%`
                              : 'Base'}
                          </span>
                        </div>
                      )}

                      {currentQ.id === 'management' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-muted">+{currency}</span>
                          <Input
                            type="number"
                            min="0"
                            step="50"
                            value={opt.flatCost ?? 0}
                            onChange={(e) =>
                              handleOptionChange(activeQuestionIndex, optIdx, 'flatCost', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className="w-32 font-mono font-bold text-sm text-right"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(activeQuestionIndex, optIdx)}
                        className="p-2 rounded-xl text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Calculator Simulator */}
        <div className="flex flex-col gap-6 sticky top-6">
          <div className="bg-gradient-to-br from-card via-card to-surface border border-primary/20 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary">
                  Live Formula Simulator
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                Real-Time
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Test how your live edits affect calculations right now before saving.
            </p>

            {/* Simulator Controls */}
            <div className="flex flex-col gap-4 mt-5">
              {/* Select Platform */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-muted mb-1.5">
                  1. Platform Selection
                </label>
                <select
                  value={simulatorSelections.platform as string}
                  onChange={(e) => setSimulatorSelections({ ...simulatorSelections, platform: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {questions[0]?.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({formatPrice(opt.baseCost ?? 0, currency)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-muted mb-1.5">
                  2. App Category Factor
                </label>
                <select
                  value={simulatorSelections.category as string}
                  onChange={(e) => setSimulatorSelections({ ...simulatorSelections, category: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {questions[1]?.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} (×{opt.multiplier ?? 1.0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Design */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-muted mb-1.5">
                  3. UI Design Theme
                </label>
                <select
                  value={simulatorSelections.design as string}
                  onChange={(e) => setSimulatorSelections({ ...simulatorSelections, design: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {questions[2]?.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} (×{opt.multiplier ?? 1.0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Features */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-muted mb-1.5">
                  4. Management Modules
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {questions[3]?.options.map((opt) => {
                    const isChecked = (simulatorSelections.management as string[]).includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          const current = (simulatorSelections.management as string[]) || [];
                          const updated = isChecked ? current.filter((x) => x !== opt.id) : [...current, opt.id];
                          setSimulatorSelections({ ...simulatorSelections, management: updated });
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface border-border text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        <span className="text-[10px] font-mono shrink-0 ml-1">+{formatPrice(opt.flatCost ?? 0, currency)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="mt-6 pt-5 border-t border-border flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Calculated Ballpark Cost
                  </span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">
                    {formatPrice(simResult.estimatedCost, currency)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Project Timeline
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {simResult.timelineWeeks.min} – {simResult.timelineWeeks.max} Weeks
                  </span>
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="p-3 rounded-xl bg-card border border-border/60 text-[11px] text-text-muted font-mono leading-relaxed">
                Formula: (Base Platform × Category × Design) + Feature Flat Costs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
