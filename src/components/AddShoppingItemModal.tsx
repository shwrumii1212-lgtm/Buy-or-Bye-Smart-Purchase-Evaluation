import React, { useState } from 'react';
import { X, PlusCircle, ShoppingBag } from 'lucide-react';
import { Language, PaymentMethod, ProductCategory, ShoppingLogItem } from '../types';
import { translations, categoryLabels } from '../utils/translations';

interface AddShoppingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  language: Language;
  onAdd: (item: ShoppingLogItem) => void;
}

export const AddShoppingItemModal: React.FC<AddShoppingItemModalProps> = ({
  isOpen,
  onClose,
  userId,
  language,
  onAdd,
}) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('fashion');
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<'bought' | 'saved_bye' | 'cooling_down'>('bought');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || price <= 0) return;

    const newItem: ShoppingLogItem = {
      id: `log_${Date.now()}`,
      userId,
      productName: productName.trim(),
      category,
      price,
      status,
      date: new Date(date).toISOString(),
      paymentMethod,
      savedAmount: status === 'saved_bye' ? price : 0,
      notes: notes.trim()
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24303E]/45 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2EAF0] my-8 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B8BA4] via-[#8CA8BF] to-[#B8D5E5] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-heading text-lg font-bold">{t.addManualItemBtn}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24303E] mb-1">
              {t.productNameLabel}
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Misal: Kemeja Linen, Kopi Kenangan, TWS Earphone..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.priceLabel} (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-[#7A8C9E]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price ? price.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setPrice(raw ? parseInt(raw, 10) : 0);
                  }}
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA] focus:ring-2 focus:ring-[#6B8BA4]/30 focus:border-[#6B8BA4]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
              >
                {Object.entries(categoryLabels).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                Status Keputusan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
              >
                <option value="bought">Barang Dibeli (Bought)</option>
                <option value="saved_bye">Dibatalkan & Simpan Uang (BYE)</option>
                <option value="cooling_down">Dalam Daftar Tunda (Cooling Off)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24303E] mb-1">
                {t.paymentMethodLabel}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
              >
                <option value="cash">Tunai / Transfer (Cash)</option>
                <option value="debit">Kartu Debit</option>
                <option value="credit_card">Kartu Kredit</option>
                <option value="paylater">Paylater (Cicilan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24303E] mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24303E] mb-1">
              Catatan / Refleksi
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alasan membeli atau motivasi membatalkan barang ini..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CFDCE6] bg-[#FBFBFA]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D5DFE7] text-[#55697A] hover:bg-[#F2F6F9]"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#6B8BA4] hover:bg-[#587893] text-white shadow-xs"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
