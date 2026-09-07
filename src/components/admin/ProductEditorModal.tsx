import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  UploadCloud,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Tag,
  Percent,
} from 'lucide-react';
import { Product } from '../../types';
import { compressImageFile } from '../../lib/imageUtils';
import { FormattedDescription } from '../FormattedDescription';

interface ProductEditorModalProps {
  product: Product | null; // null means new product
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>) => Promise<void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(product?.title || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '$49');
  const [category, setCategory] = useState(product?.category || 'Planners & OS');
  const [badge, setBadge] = useState(product?.badge || '');
  const [purchaseLink, setPurchaseLink] = useState(product?.purchaseLink || '');
  const [status, setStatus] = useState<'active' | 'draft'>(product?.status || 'active');

  // Discount states
  const [isDiscounted, setIsDiscounted] = useState<boolean>(product?.isDiscounted || false);
  const [originalPrice, setOriginalPrice] = useState<string>(product?.originalPrice || '');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>(
    typeof product?.discountPercentage === 'number' ? product.discountPercentage : ''
  );

  // Multi-image list state
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0 ? product.images : []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Features checklist state
  const [features, setFeatures] = useState<string[]>(
    product?.features || ['Instant Download', 'Commercial License Included']
  );
  const [newFeatureText, setNewFeatureText] = useState('');
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Re-synchronize form fields whenever product or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setTitle(product.title || '');
        setShortDescription(product.shortDescription || '');
        setDescription(product.description || '');
        setPrice(product.price || '$49');
        setIsDiscounted(product.isDiscounted || Boolean(product.originalPrice && product.originalPrice !== product.price));
        setOriginalPrice(product.originalPrice || '');
        setDiscountPercentage(
          typeof product.discountPercentage === 'number'
            ? product.discountPercentage
            : (product.originalPrice && product.price
                ? Math.round(
                    ((parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) -
                      parseFloat(product.price.replace(/[^0-9.]/g, ''))) /
                      parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''))) *
                      100
                  ) || ''
                : '')
        );
        setCategory(product.category || 'Planners & OS');
        setBadge(product.badge || '');
        setPurchaseLink(product.purchaseLink || '');
        setStatus(product.status || 'active');
        setImages(product.images && product.images.length > 0 ? product.images : []);
        setFeatures(
          product.features && product.features.length > 0
            ? product.features
            : ['Instant Download', 'Commercial License Included']
        );
      } else {
        setTitle('');
        setShortDescription('');
        setDescription('');
        setPrice('$49');
        setIsDiscounted(false);
        setOriginalPrice('');
        setDiscountPercentage('');
        setCategory('Planners & OS');
        setBadge('');
        setPurchaseLink('');
        setStatus('active');
        setImages([]);
        setFeatures(['Instant Download', 'Commercial License Included']);
      }
      setNewImageUrl('');
      setNewFeatureText('');
      setError('');
      setShowDescriptionPreview(false);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Discount calculation helpers
  const extractNumericPrice = (val: string): number => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const extractCurrencySymbol = (val: string): string => {
    const match = val.match(/^[^0-9.]+/);
    return match ? match[0].trim() || '$' : '$';
  };

  const formatPriceDisplay = (num: number, customSymbol?: string): string => {
    const symbol = customSymbol || extractCurrencySymbol(price) || '$';
    if (num <= 0) return `${symbol}0`;
    return Number.isInteger(num) ? `${symbol}${num}` : `${symbol}${num.toFixed(2)}`;
  };

  const handleToggleDiscount = (enabled: boolean) => {
    setIsDiscounted(enabled);
    if (enabled) {
      if (!originalPrice) {
        const currentNumeric = extractNumericPrice(price);
        const currSymbol = extractCurrencySymbol(price);
        if (currentNumeric > 0) {
          const suggestedOriginal = Math.round(currentNumeric * 1.4);
          setOriginalPrice(`${currSymbol}${suggestedOriginal}`);
          setDiscountPercentage(Math.round(((suggestedOriginal - currentNumeric) / suggestedOriginal) * 100));
        } else {
          setOriginalPrice('$89');
          setDiscountPercentage(30);
        }
      }
    }
  };

  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    const origNum = extractNumericPrice(val);
    const currentPriceNum = extractNumericPrice(price);
    if (origNum > 0 && currentPriceNum > 0 && currentPriceNum < origNum) {
      const pct = Math.round(((origNum - currentPriceNum) / origNum) * 100);
      setDiscountPercentage(pct);
    } else if (typeof discountPercentage === 'number' && discountPercentage > 0 && origNum > 0) {
      const discountedVal = origNum * (1 - discountPercentage / 100);
      setPrice(formatPriceDisplay(discountedVal));
    }
  };

  const handleDiscountPercentChange = (val: string) => {
    if (val === '') {
      setDiscountPercentage('');
      return;
    }
    const pct = parseInt(val, 10);
    if (isNaN(pct)) return;
    const clampedPct = Math.max(1, Math.min(99, pct));
    setDiscountPercentage(clampedPct);

    const origNum = extractNumericPrice(originalPrice);
    if (origNum > 0) {
      const discountedVal = origNum * (1 - clampedPct / 100);
      setPrice(formatPriceDisplay(discountedVal));
    }
  };

  // Add image via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Add image via local file input (auto-compresses and resizes to lightweight format)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setError('');

    try {
      const fileList: File[] = Array.from(files);
      const compressedList: string[] = [];

      for (const file of fileList) {
        if (!file.type.startsWith('image/')) {
          continue;
        }
        // Downscales large photos to max 900px and converts to optimized ~30-60KB JPEG
        const compressed = await compressImageFile(file, 900, 0.78);
        compressedList.push(compressed);
      }

      if (compressedList.length > 0) {
        setImages((prev) => [...prev, ...compressedList]);
      }
    } catch (err: any) {
      setError(err.message || 'Error processing uploaded images.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Set image as primary (move to index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const filtered = images.filter((_, i) => i !== index);
    setImages([target, ...filtered]);
  };

  // Reorder image up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...images];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setImages(newArr);
  };

  // Reorder image down
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newArr = [...images];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setImages(newArr);
  };

  // Feature tag handlers
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim()) {
      setError('Title and Price are mandatory.');
      return;
    }
    if (images.length === 0) {
      setError('Please provide at least 1 square product image.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      let finalPurchaseLink = purchaseLink.trim();
      if (!finalPurchaseLink) {
        finalPurchaseLink = '#';
      } else if (
        !finalPurchaseLink.startsWith('http://') &&
        !finalPurchaseLink.startsWith('https://') &&
        !finalPurchaseLink.startsWith('#') &&
        !finalPurchaseLink.startsWith('/') &&
        !finalPurchaseLink.startsWith('mailto:')
      ) {
        finalPurchaseLink = `https://${finalPurchaseLink}`;
      }

      await onSave({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        price: price.trim(),
        originalPrice: isDiscounted ? originalPrice.trim() : undefined,
        discountPercentage: isDiscounted && typeof discountPercentage === 'number' ? discountPercentage : undefined,
        isDiscounted: isDiscounted,
        category: category.trim() || 'Planners & OS',
        badge: badge.trim(),
        images,
        purchaseLink: finalPurchaseLink,
        features,
        status,
        createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product in Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-400">
              Configure product details and multi-image gallery with real-time Firestore sync.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Life Planner Pro Suite"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price (with currency symbol) *
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. $49 or $89"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              >
                <option value="Planners & OS">Planners & OS</option>
                <option value="Dashboards">Dashboards</option>
                <option value="UI Kits">UI Kits</option>
                <option value="Code Templates">Code Templates</option>
                <option value="Templates">Templates</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, New, Featured"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Discount & Special Pricing Settings Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isDiscounted
              ? 'bg-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isDiscounted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-heading">
                    Discount & Promotional Sale
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Display original strikethrough price, discounted sale price, and % off badge.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleDiscount(!isDiscounted)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isDiscounted ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isDiscounted ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {isDiscounted && (
              <div className="pt-3 border-t border-slate-800/80 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Original Regular Price
                    </label>
                    <input
                      type="text"
                      value={originalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      placeholder="e.g. $89 or $99"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Shown with strikethrough</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Discount Percentage (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="95"
                        value={discountPercentage}
                        onChange={(e) => handleDiscountPercentChange(e.target.value)}
                        placeholder="e.g. 40"
                        className="w-full px-3 py-1.5 pr-7 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 outline-none"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
                        %
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Auto-computes sale price</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-400 mb-1">
                      Final Sale / Selling Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        const origNum = extractNumericPrice(originalPrice);
                        const newNum = extractNumericPrice(e.target.value);
                        if (origNum > 0 && newNum > 0 && newNum < origNum) {
                          setDiscountPercentage(Math.round(((origNum - newNum) / origNum) * 100));
                        }
                      }}
                      placeholder="e.g. $49"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/60 text-amber-300 font-bold text-xs focus:border-amber-400 outline-none"
                    />
                    <span className="text-[10px] text-amber-500/80 mt-0.5 block">Customer charged this price</span>
                  </div>
                </div>

                {/* Live Preview Bar */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">Customer View:</span>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-slate-500 font-semibold tabular-nums">
                        {originalPrice || '$89'}
                      </span>
                      <span className="text-amber-400 font-extrabold text-sm tabular-nums">
                        {price || '$49'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                        {discountPercentage ? `${discountPercentage}% OFF` : 'ON SALE'}
                      </span>
                    </div>
                  </div>

                  {extractNumericPrice(originalPrice) > extractNumericPrice(price) && (
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      Customer saves {formatPriceDisplay(extractNumericPrice(originalPrice) - extractNumericPrice(price))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Purchase / Checkout Redirect URL *
            </label>
            <input
              type="text"
              required
              value={purchaseLink}
              onChange={(e) => setPurchaseLink(e.target.value)}
              placeholder="https://gumroad.com/l/your-product or your checkout link"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Accepts any checkout URL (e.g. Gumroad, Lemon Squeezy, Stripe, or section links like #contact).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description (Card Summary)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One or two sentences highlighting the value proposition"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Full Description (Modal Detail View)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDescriptionPreview(!showDescriptionPreview)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    showDescriptionPreview
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {showDescriptionPreview ? 'Edit Text' : 'Live Preview'}
                </button>
              </div>
            </div>

            {/* Quick Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-1">Quick Tools:</span>
              <button
                type="button"
                onClick={() => setDescription((prev) => (prev ? prev + '\n\n• ' : '• '))}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-amber-300 border border-slate-800 text-slate-300 transition-colors"
                title="Add a bullet point"
              >
                + Bullet Point (•)
              </button>
              <button
                type="button"
                onClick={() => setDescription((prev) => (prev ? prev + '\n\n' : ''))}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-amber-300 border border-slate-800 text-slate-300 transition-colors"
                title="Add new paragraph break"
              >
                + New Paragraph
              </button>
              <button
                type="button"
                onClick={() => setDescription((prev) => (prev ? prev + ' **Important Feature** ' : '**Important Feature** '))}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-amber-300 border border-slate-800 text-slate-300 transition-colors"
                title="Add bold highlighted text"
              >
                **Bold Text**
              </button>
            </div>

            {showDescriptionPreview ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[140px] text-xs">
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-2">
                  Live Customer Preview (Paragraphs & Bullets):
                </div>
                {description.trim() ? (
                  <FormattedDescription content={description} />
                ) : (
                  <p className="text-slate-500 italic">Type in the description to preview paragraphs and bullets here...</p>
                )}
              </div>
            ) : (
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type multiple sentences, paragraphs, and bullet points here. For example:&#10;&#10;First paragraph introducing your product in detail.&#10;&#10;Key features & deliverables:&#10;• Complete source files & docs&#10;• 24/7 Priority support&#10;• Commercial license&#10;&#10;Final closing sentence."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none resize-y min-h-[130px] font-sans leading-relaxed"
              />
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Separate paragraphs with a blank line (press Enter twice). Start bullet lines with <code className="text-amber-400 font-mono">•</code> or <code className="text-amber-400 font-mono">-</code>.
            </p>
          </div>

          {/* ADVANCED MULTI-IMAGE GALLERY MANAGER */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white font-heading">
                  Product Image Gallery (1:1 Square Ratio)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Multiple images automatically activate the interactive product carousel and popup gallery.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">{images.length} images</span>
            </div>

            {/* Add Image Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <div className="sm:col-span-8 flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste Image URL (Unsplash, Firebase Storage, CDN)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
                >
                  Add URL
                </button>
              </div>

              <div className="sm:col-span-4">
                <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-dashed text-xs font-semibold cursor-pointer transition-colors ${
                  isCompressing ? 'border-amber-400 text-amber-300' : 'border-slate-700 hover:border-amber-500 text-slate-300'
                }`}>
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Upload Files</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isCompressing}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Uploaded Images List with Reorder, Primary, and Delete */}
            {images.length === 0 ? (
              <div className="py-8 px-4 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">No product preview images yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Click "Upload Files" or "Add URL" above to add square preview images</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative group rounded-xl overflow-hidden aspect-square border-2 bg-slate-900 flex flex-col justify-between p-1.5 transition-all ${
                      idx === 0 ? 'border-amber-400 shadow-md shadow-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Preview ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />

                    {/* Primary Badge */}
                    <div className="relative z-10 flex justify-between items-start">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] shadow">
                          Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Set as featured primary image"
                          className="px-1.5 py-0.5 rounded bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] font-semibold backdrop-blur-sm transition-colors"
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-md bg-rose-500/90 hover:bg-rose-600 text-white shadow transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Move Up / Down Buttons */}
                    <div className="relative z-10 flex justify-end gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          title="Move image left/up"
                          className="p-1 rounded bg-slate-950/80 hover:bg-slate-800 text-white backdrop-blur-sm"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          title="Move image right/down"
                          className="p-1 rounded bg-slate-950/80 hover:bg-slate-800 text-white backdrop-blur-sm"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Checklist Adder */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Features & Inclusions List
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="e.g. Includes Notion workspace + Figma tokens"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Add Feature
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isCompressing}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Saving to Firestore...</span>
                </>
              ) : isCompressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Images...</span>
                </>
              ) : product ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
