import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Upload, CheckCircle2, MapPin, Sparkles, Building2, Car, Smartphone, Laptop, Armchair, Briefcase, Wrench, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '../../mock/store';
import { api } from '../../services/api';
import type { CategorySlug, Listing } from '../../types';

interface PostWizardProps {
  onSuccess: (newListing: Listing) => void;
  onCancel: () => void;
}

export const PostWizardPage: React.FC<PostWizardProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('property');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [pricePeriod, setPricePeriod] = useState('');

  // Location State
  const [address, setAddress] = useState('Sector 62');
  const [locality, setLocality] = useState('Sector 62');
  const [city, setCity] = useState('Noida');
  const stateName = 'Uttar Pradesh';
  const [pincode, setPincode] = useState('201309');

  // Dynamic Attrs
  const [dynamicAttrs, setDynamicAttrs] = useState<Record<string, any>>({
    bhk: '2 BHK',
    propertyType: 'Apartment',
    area: 1450,
    furnishing: 'Fully Furnished'
  });

  // Media
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
  ]);

  const categories = store.getCategories();
  const activeCategoryObj = categories.find(c => c.slug === selectedCategory) || categories[0];

  const handleAttrChange = (key: string, value: any) => {
    setDynamicAttrs(prev => ({ ...prev, [key]: value }));
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ];
    const nextImg = samples[uploadedImages.length % samples.length];
    setUploadedImages([...uploadedImages, nextImg]);
  };

  const handleSubmitListing = async () => {
    const listingPayload = {
      title: title || `Verified ${activeCategoryObj.name} Listing`,
      description: description || 'Verified high quality listing posted on TrustNest.',
      categorySlug: selectedCategory,
      categoryName: activeCategoryObj.name,
      price: Number(price) || 4500000,
      formattedPrice: price ? `₹${Number(price).toLocaleString('en-IN')}` : '₹45.00 Lakh',
      pricePeriod: pricePeriod || undefined,
      images: uploadedImages,
      attributes: dynamicAttrs,
      location: {
        address,
        locality,
        city,
        state: stateName,
        pincode,
        lat: 28.6273,
        lng: 77.3725,
        verifiedCoords: true
      }
    };

    let newListing: Listing;
    try {
      newListing = await api.createListing(listingPayload);
    } catch (e) {
      newListing = store.createListing(listingPayload);
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    onSuccess(newListing);
  };

  const categoryIcons: Record<string, any> = {
    property: Building2,
    vehicles: Car,
    mobiles: Smartphone,
    electronics: Laptop,
    furniture: Armchair,
    jobs: Briefcase,
    services: Wrench,
    other: Package
  };

  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Step Header Indicator */}
      <div className="bg-cream-50 rounded-3xl p-6 border border-navy-900/10 shadow-trust flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-500 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verification Listing Pipeline
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Step {step} of 6 — {
              step === 1 ? 'Select Category' :
              step === 2 ? 'Details & Dynamic Specifications' :
              step === 3 ? 'High-Res Photos & Documents' :
              step === 4 ? 'Location & GPS Tagging' :
              step === 5 ? 'Pricing & Negotiations' : 'Preview & Verification Submit'
            }
          </h1>
        </div>

        <button type="button" onClick={onCancel} className="text-xs font-bold text-navy-700 hover:text-navy-900 cursor-pointer">
          Cancel & Exit
        </button>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <h2 className="text-xl font-bold text-navy-900">What are you listing on TrustNest?</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => {
              const IconComp = categoryIcons[cat.slug] || Package;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between aspect-square transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-navy-900 text-cream-50 border-orange-500 shadow-md ring-2 ring-orange-500/30'
                      : 'bg-cream-50 border-navy-900/10 hover:border-orange-500/50 text-navy-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-orange-500 text-white' : 'bg-cream-200 text-navy-900'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">{cat.name}</div>
                    <div className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-gray-300' : 'text-navy-700'}`}>
                      {cat.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TITLE & DYNAMIC ATTRIBUTES */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <h2 className="text-xl font-bold text-navy-900">Listing Information & Attributes</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Modern 3 BHK Luxury Apartment in Greater Noida"
                className="w-full px-4 py-3 bg-cream-50 border border-navy-900/15 rounded-xl text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe key highlights, condition, title deed details..."
                className="w-full px-4 py-3 bg-cream-50 border border-navy-900/15 rounded-xl text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Dynamic Attributes Fields */}
            <div className="pt-4 border-t border-navy-900/10 space-y-4">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                {activeCategoryObj.name} Dynamic Attributes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeCategoryObj.attributes.map(attr => (
                  <div key={attr.id}>
                    <label className="block text-xs font-semibold text-navy-700 mb-1">
                      {attr.label} {attr.required && '*'}
                    </label>

                    {attr.type === 'enum' && attr.options ? (
                      <select
                        value={dynamicAttrs[attr.key] || ''}
                        onChange={e => handleAttrChange(attr.key, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select {attr.label}</option>
                        {attr.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={attr.type === 'number' ? 'number' : 'text'}
                        value={dynamicAttrs[attr.key] || ''}
                        onChange={e => handleAttrChange(attr.key, e.target.value)}
                        placeholder={attr.placeholder || `Enter ${attr.label}`}
                        className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-2xl text-xs cursor-pointer hover:bg-cream-300 transition-colors"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Media</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MEDIA & PHOTO UPLOADER */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <h2 className="text-xl font-bold text-navy-900">Upload Photos for AI Authenticity Check</h2>
          <p className="text-xs text-navy-700">
            Our AI fraud engine scans uploaded photos for digital manipulation and duplicate stock imagery.
          </p>

          <div className="border-2 border-dashed border-navy-900/20 rounded-3xl p-8 text-center bg-cream-50 space-y-3">
            <Upload className="w-10 h-10 text-orange-500 mx-auto" />
            <div className="text-sm font-bold text-navy-900">Drag high-resolution photos here</div>
            <p className="text-xs text-navy-700">Supports WebP, PNG, JPG (EXIF metadata preserved for verification)</p>
            <button
              type="button"
              onClick={handleAddSampleImage}
              className="px-4 py-2 bg-navy-900 text-cream-50 font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              + Upload Sample Photo
            </button>
          </div>

          {/* Uploaded Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-navy-900/10">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-trust-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  ✓ EXIF OK
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-2xl text-xs cursor-pointer hover:bg-cream-300 transition-colors"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LOCATION */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <h2 className="text-xl font-bold text-navy-900">Location & GPS Tagging</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Locality</label>
              <input
                type="text"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-navy-900 text-cream-50 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>GPS Geolocation Pin matches postal index within 8 meters accuracy</span>
            </div>
            <span className="text-trust-green font-bold">✓ Coordinates Tagged</span>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-2xl text-xs cursor-pointer hover:bg-cream-300 transition-colors"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PRICING */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <h2 className="text-xl font-bold text-navy-900">Pricing & Negotiation Terms</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Expected Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                placeholder="e.g. 4500000"
                className="w-full px-4 py-3 bg-cream-50 border border-navy-900/15 rounded-xl text-lg font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                Price Period / Frequency (Optional)
              </label>
              <input
                type="text"
                value={pricePeriod}
                onChange={e => setPricePeriod(e.target.value)}
                placeholder="e.g. /month for rent or /year for salary"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-2xl text-xs cursor-pointer hover:bg-cream-300 transition-colors"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(6)}
              className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <span>Preview & Submit Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PREVIEW & SUBMIT */}
      {step === 6 && (
        <div className="bg-white rounded-3xl p-8 border border-navy-900/10 shadow-trust space-y-6">
          <div className="p-4 bg-amber-soft/20 text-navy-900 rounded-2xl border border-amber-soft font-bold text-xs flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
            <span>Ready for Verification Engine. Initial estimated Trust Score: 91 / 100 Gold Tier.</span>
          </div>

          <div className="bg-cream-50 p-6 rounded-2xl border border-navy-900/10 space-y-3">
            <h3 className="text-xl font-extrabold text-navy-900">{title || 'Verified Listing'}</h3>
            <div className="text-2xl font-extrabold text-orange-500">
              ₹{Number(price || 4500000).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-navy-700">{address}, {locality}, {city}</p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-5 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-2xl text-xs cursor-pointer hover:bg-cream-300 transition-colors"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmitListing}
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Submit & Calculate Trust Score</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
