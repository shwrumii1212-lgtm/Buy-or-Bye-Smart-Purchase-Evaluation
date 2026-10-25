import { FormattedMessage } from './FormattedMessage';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User as UserIcon, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  MessageCircle, 
  RotateCcw,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Language, User, FinancialProfile } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FinancialAiAssistantProps {
  language: Language;
  user: User | null;
  finance: FinancialProfile | null;
}

const STARTER_PROMPTS = [
  {
    id: 'p1',
    label: 'Gimana cara mulai mengatur uang bulanan?',
    labelEn: 'How do I start budgeting my monthly income?',
    icon: '📊'
  },
  {
    id: 'p2',
    label: 'Berapa yang sebaiknya aku sisihkan untuk tabungan?',
    labelEn: 'How much should I set aside for savings?',
    icon: '💰'
  },
  {
    id: 'p3',
    label: 'Bagaimana cara menahan keinginan belanja impulsif?',
    labelEn: 'How can I curb the urge to impulse shop?',
    icon: '🛑'
  },
  {
    id: 'p4',
    label: 'Apa yang perlu dipertimbangkan sebelum memakai PayLater?',
    labelEn: 'What to consider before using PayLater loans?',
    icon: '💳'
  },
  {
    id: 'p5',
    label: 'Gimana cara membedakan kebutuhan dan keinginan?',
    labelEn: 'How do I distinguish needs from wants?',
    icon: '⚖️'
  }
];

export const FinancialAiAssistant: React.FC<FinancialAiAssistantProps> = ({
  language,
  user,
  finance,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: language === 'id' 
        ? 'Halo! Aku **Teman Finansial**, teman belajarmu di Buy or Bye. Kamu bisa tanya apa saja secara bebas mengenai tips mengatur uang bulanan, menabung, menahan nafsu belanja impulsif, hingga pertimbangan sebelum pakai PayLater dengan bahasa santai dan tanpa dihakimi. Ada yang ingin kamu diskusikan hari ini?'
        : 'Hello! I am **Financial Buddy**, your companion in Buy or Bye. Ask me anything about budgeting, saving, impulse buys, or loans with zero judgment.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setErrorMessage('');
    const userMsgId = `usr-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      // Map messages for Gemini API
      const apiPayload = updatedMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: apiPayload,
          userFinance: finance ? {
            monthlyIncome: finance.monthlyIncome,
            essentialExpenses: finance.essentialExpenses,
            lifestyleExpenses: finance.lifestyleExpenses,
            savings: finance.savings,
            debtInstallments: finance.debtInstallments
          } : null
        })
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || (language === 'id' ? 'Gagal memproses jawaban dari Teman Finansial.' : 'Failed to get response from Financial Buddy.'));
      }

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || (language === 'id' ? 'Tidak ada jawaban yang diterima.' : 'No response received.'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      setErrorMessage(err.message || (language === 'id' ? 'Koneksi ke asisten AI terganggu. Silakan coba lagi.' : 'AI assistant connection error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: language === 'id'
          ? 'Percakapan baru telah dimulai! Apa topik finansial atau kebiasaan belanja yang ingin kamu tanyakan sekarang?'
          : 'New conversation started! What financial topic would you like to explore?',
        timestamp: new Date()
      }
    ]);
    setInputText('');
    setErrorMessage('');
  };

  return (
    <div className="space-y-4">
      {/* Container */}
      <div className="rounded-3xl bg-white border border-[#E2EAF0] shadow-xs overflow-hidden flex flex-col h-[650px] max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#F8F6F2] via-white to-[#EAF0EB] border-b border-[#E2EAF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B8BA4] to-[#9EAEA2] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-[#24303E]">
                  {language === 'id' ? 'Teman Finansial' : 'Financial Buddy'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF0EB] text-[#3D6649]">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-[#7A8C9E]">
                {language === 'id' 
                  ? 'Edukasi keuangan ramah, bebas julgmen & kalkulasi rasional' 
                  : 'Mindful, non-judgmental personal finance coaching'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartNewChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBD7E2] bg-white hover:bg-[#F8F6F2] text-xs font-semibold text-[#506272] transition-colors cursor-pointer shadow-2xs"
            title={language === 'id' ? 'Mulai Percakapan Baru' : 'New Chat'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B8BA4]" />
            <span className="hidden sm:inline">{language === 'id' ? 'Percakapan Baru' : 'New Chat'}</span>
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4.5 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser 
                    ? 'bg-[#6B8BA4] text-white rounded-tr-none' 
                    : 'bg-white text-[#24303E] border border-[#E5ECF2] rounded-tl-none'
                }`}>
                  {isUser ? (
                    <p className="whitespace-pre-line">{msg.content}</p>
                  ) : (
                    <FormattedMessage content={msg.content} />
                  )}
                  <span className={`block text-[10px] mt-2 pt-1 border-t ${
                    isUser 
                      ? 'border-white/15 text-white/70 text-right' 
                      : 'border-[#F0F4F8] text-[#8EA0B0]'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#6B8BA4] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-[#E2EAF0] text-[#6B8BA4] flex items-center justify-center font-bold text-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E5ECF2] px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#6B8BA4] animate-spin" />
                <span className="text-xs text-[#6B8BA4] font-medium">
                  {language === 'id' ? 'Teman Finansial sedang menyusun jawaban...' : 'Financial Buddy is thinking...'}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#E11D48]" />
              <div>
                <p className="font-bold">{language === 'id' ? 'Gagal Memuat Jawaban' : 'Failed to Load Response'}</p>
                <p className="mt-0.5 text-[#9F1239]">{errorMessage}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts Carousel (Quick Questions) */}
        <div className="px-4 py-2.5 bg-white border-t border-[#EEF3F7] overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-[#8EA0B0] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-[#D4A359]" />
            {language === 'id' ? 'Coba Tanya:' : 'Try Asking:'}
          </span>
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(language === 'id' ? prompt.label : prompt.labelEn)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE6] border border-[#DCE4EC] text-xs font-semibold text-[#415364] whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              <span>{prompt.icon}</span>
              <span>{language === 'id' ? prompt.label : prompt.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }} 
          className="p-3 sm:p-4 bg-white border-t border-[#E2EAF0] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={language === 'id' 
              ? 'Tanyakan apa saja seputar uangmu (misal: "Berapa persen cicilan maksimal yang aman?")...' 
              : 'Ask any question about your finances...'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] text-xs sm:text-sm focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-4.5 py-2.5 rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'id' ? 'Kirim' : 'Send'}</span>
          </button>
        </form>

        {/* Disclaimer Safety Footer */}
        <div className="px-4 py-2 bg-[#F8F6F2] border-t border-[#EAEFEA] text-[10px] text-[#7A8C9E] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#9EAEA2]" />
            {language === 'id' 
              ? 'Edukasi umum mandiri, bukan rekomendasi finansial profesional bersertifikasi. Jangan bagikan password/PIN.'
              : 'General educational guidance. Never share sensitive PINs or passwords.'}
          </span>
          <span className="font-semibold text-[#6B8BA4]">Buy or Bye Guard</span>
        </div>
      </div>
    </div>
  );
};
