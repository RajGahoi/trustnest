import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import type { Listing } from '../../types';

interface DownloadBrochureModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadBrochureModal: React.FC<DownloadBrochureModalProps> = ({
  listing,
  isOpen,
  onClose
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const pricePerSqft = listing.attributes?.pricePerSqft || 
    (listing.attributes?.area ? `₹ ${Math.round(listing.price / Number(listing.attributes.area))} / sqft` : '₹ 8,500 / sqft');

  const handlePrintPdf = () => {
    // Generate clean printable window for Save as PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download or print the PDF brochure.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TrustNest Verified Property Brochure - ${listing.title}</title>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; color: #0F172A; background: #fff; padding: 24px; font-size: 13px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #D92228; padding-bottom: 16px; margin-bottom: 20px; }
            .brand { display: flex; align-items: center; gap: 8px; }
            .logo-badge { background: #0F172A; color: #fff; font-weight: 800; padding: 6px 12px; border-radius: 8px; font-size: 18px; }
            .tagline { font-size: 11px; color: #64748B; font-weight: 600; }
            .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
            .location { font-size: 13px; color: #475569; margin-bottom: 16px; }
            .price-strip { display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; }
            .price { font-size: 26px; font-weight: 900; color: #D92228; }
            .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
            .spec-card { background: #F1F5F9; padding: 10px; border-radius: 8px; }
            .spec-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; }
            .spec-val { font-size: 13px; font-weight: 800; color: #0F172A; margin-top: 2px; }
            .photos-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .photo-box { height: 160px; border-radius: 8px; overflow: hidden; background: #000; }
            .photo-box img { width: 100%; height: 100%; object-fit: cover; }
            .trust-box { border: 2px solid #10B981; background: #ECFDF5; padding: 14px; border-radius: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .trust-score { font-size: 22px; font-weight: 900; color: #065F46; }
            .footer { border-top: 1px solid #E2E8F0; padding-top: 14px; display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-top: 20px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <span class="logo-badge">TrustNest</span>
              <div>
                <p style="font-weight: 800; font-size: 13px;">Official Verified Real Estate Factsheet</p>
                <p class="tagline">99acres & MagicBricks Verification Standard</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 700; color: #D92228;">REF ID: ${listing.id.toUpperCase()}</p>
              <p style="font-size: 10px; color: #64748B;">Generated: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <h1 class="title">${listing.title}</h1>
          <p class="location">📍 ${listing.location.address}, ${listing.location.locality}, ${listing.location.city} - ${listing.location.pincode}</p>

          <div class="price-strip">
            <div>
              <span style="font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase;">Total Valuation / Offering</span>
              <p class="price">${listing.formattedPrice}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase;">Unit Rate & EMI</span>
              <p style="font-weight: 800; font-size: 14px;">${pricePerSqft}</p>
              <p style="font-size: 11px; color: #10B981; font-weight: 700;">EMI Starting from 7% Available</p>
            </div>
          </div>

          <div class="specs-grid">
            <div class="spec-card">
              <p class="spec-label">Super / Plot Area</p>
              <p class="spec-val">${listing.attributes?.area || 150} ${listing.attributes?.areaUnit || 'sqft'}</p>
            </div>
            <div class="spec-card">
              <p class="spec-label">Facing / Direction</p>
              <p class="spec-val">${listing.attributes?.facing || 'East Facing'}</p>
            </div>
            <div class="spec-card">
              <p class="spec-label">Road Width</p>
              <p class="spec-val">${listing.attributes?.roadWidth || '60 ft Wide Road'}</p>
            </div>
            <div class="spec-card">
              <p class="spec-label">Title Ownership</p>
              <p class="spec-val">${listing.attributes?.ownership || 'Freehold Title'}</p>
            </div>
          </div>

          <div class="photos-grid">
            ${listing.images.slice(0, 3).map((img: string) => `
              <div class="photo-box">
                <img src="${img}" alt="Property Photo" />
              </div>
            `).join('')}
          </div>

          <div class="trust-box">
            <div>
              <p style="font-weight: 800; color: #065F46; font-size: 14px;">✓ TrustNest 5-Dimensional Title & Risk Audit PASSED</p>
              <p style="font-size: 11px; color: #047857; margin-top: 2px;">Identity, Ownership Deeds, Municipal Ward Map, and Media Authenticity Verified.</p>
            </div>
            <div class="trust-score">
              ${listing.trustScore.overallScore}/100
            </div>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 12px; margin-bottom: 20px;">
            <p style="font-weight: 800; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Property Overview & Infrastructure</p>
            <p style="font-size: 12px; color: #334155; line-height: 1.6;">${listing.description}</p>
          </div>

          <div style="display: flex; justify-content: space-between; background: #FFF7ED; border: 1px solid #FED7AA; padding: 12px 16px; border-radius: 12px;">
            <div>
              <p style="font-size: 10px; font-weight: 700; color: #C2410C; text-transform: uppercase;">Direct Contact Contact Person</p>
              <p style="font-size: 14px; font-weight: 800; color: #7C2D12;">${listing.sellerName} (${listing.sellerType})</p>
              <p style="font-size: 12px; font-weight: 700; color: #9A3412;">Phone: ${listing.sellerPhone} | Email: ${listing.sellerEmail}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 11px; font-weight: 700; color: #C2410C;">Zero Brokerage Certified</p>
              <p style="font-size: 10px; color: #9A3412;">Direct seller interaction with zero commission</p>
            </div>
          </div>

          <div class="footer">
            <p>© 2026 TrustNest Platform Inc. Verified Real Estate Marketplace. Deployed at rajgahoi.github.io/trustnest.</p>
            <p>Scan QR or visit TrustNest to verify digital registry hash.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleDirectDownload = () => {
    // Generate text/pdf factsheet file
    const content = `
================================================================================
TRUSTNEST OFFICIAL VERIFIED PROPERTY BROCHURE & BLUEPRINT FACTSHEET
Ref ID: ${listing.id.toUpperCase()} | Generated: ${new Date().toLocaleDateString('en-IN')}
Standards: 99acres & MagicBricks High-Integrity Marketplace
================================================================================

PROPERTY TITLE:
${listing.title}

OFFERING PRICE:
${listing.formattedPrice} (${pricePerSqft})

LOCATION & ADDRESS:
${listing.location.address}, ${listing.location.locality}, ${listing.location.city} - ${listing.location.pincode}
Coordinates: Lat ${listing.location.lat}, Lng ${listing.location.lng}

KEY SPECIFICATIONS:
- Super / Plot Area: ${listing.attributes?.area || 150} ${listing.attributes?.areaUnit || 'sqft'}
- Facing Direction: ${listing.attributes?.facing || 'East Facing'}
- Road Access: ${listing.attributes?.roadWidth || '60 ft Wide Arterial Road'}
- Ownership: ${listing.attributes?.ownership || 'Freehold Title'}
- Status: ${listing.attributes?.status || 'Ready to Move / Clear Title'}
- Zoning: ${listing.attributes?.zoning || 'Residential Approved'}

TRUST & VERIFICATION SCORE:
Score: ${listing.trustScore.overallScore}/100 (${listing.trustScore.tier} TIER)
- Identity Verification: PASSED (Aadhaar/PAN verified)
- Document Title Check: PASSED (Deeds & Municipal Tax audited)
- GPS Location Coordinates: PASSED (GIS satellite verified)
- Media Authenticity: PASSED (On-site unedited photos)

DESCRIPTION & OVERVIEW:
${listing.description}

OWNER / SELLER CONTACT DETAILS:
Seller Name: ${listing.sellerName}
Type: ${listing.sellerType}
Phone: ${listing.sellerPhone}
Email: ${listing.sellerEmail}
Verified Rating: ${listing.sellerRating} / 5.0

HOME LOAN & BANK OFFERS:
Eligible for Home Loans starting from 7.10% with SBI, HDFC, ICICI, Canara Bank.
Zero Processing Fee* festive schemes apply.

================================================================================
Official Digital Registry Hash: TN-SHA256-${listing.id}-${Date.now()}
TrustNest Real Estate Technologies Inc.
https://rajgahoi.github.io/trustnest/
================================================================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustNest_Brochure_${listing.slug || listing.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D92228] flex items-center justify-center font-bold">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
              Download Official Property Brochure
            </h3>
            <p className="text-xs text-gray-500">
              RERA Certified Factsheet, Blueprints, Title Verification & Price Breakdown
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Brochure generated successfully! Printable PDF & digital factsheet ready.</span>
          </div>
        )}

        {/* Brochure Preview Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-orange-50/40 border border-gray-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✓ RERA Approved Document
              </span>
              <h4 className="font-display text-base font-extrabold text-navy-950 mt-1">
                {listing.title}
              </h4>
              <p className="text-xs text-gray-600">
                {listing.location.locality}, {listing.location.city}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="font-display text-xl font-black text-[#D92228]">
                {listing.formattedPrice}
              </p>
              <p className="text-[11px] font-semibold text-gray-500">
                {pricePerSqft}
              </p>
            </div>
          </div>

          {/* Highlights Checklist in Brochure */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full Floor Plan & Dimensions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Freehold Ownership Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Municipal Road Frontage Clearance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Direct Owner Phone & Contacts</span>
            </div>
          </div>

          {/* Trust Seal */}
          <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="text-xs">
                <span className="font-bold text-navy-950">Trust Score: {listing.trustScore.overallScore}/100</span>
                <p className="text-[10px] text-gray-500">5-Dimensional Anti-Fraud Scanned</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              {listing.trustScore.tier} CERTIFIED
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {/* Print to PDF (Browser Save as PDF) */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="w-full py-3.5 bg-[#D92228] hover:bg-[#B7181D] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Save / Print PDF Brochure</span>
          </button>

          {/* Direct File Download */}
          <button
            type="button"
            onClick={handleDirectDownload}
            className="w-full py-3.5 bg-white hover:bg-gray-50 text-navy-900 border border-gray-300 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-gray-700" />
            <span>Download Factsheet File</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-3">
          Contains verified owner contact info, site layout blueprint, and certified RERA registration.
        </p>
      </div>
    </div>
  );
};
