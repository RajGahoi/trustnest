import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Building2, Car, Smartphone, Laptop, Armchair, Briefcase, Wrench, Package } from 'lucide-react';
import { SearchBarExpandable } from '../components/search/SearchBarExpandable';
import { ListingCard } from '../components/listing/ListingCard';
import { TrustScoreChart } from '../components/trust/TrustScoreChart';
import { VerificationTimeline } from '../components/trust/VerificationTimeline';
import { FraudScanPanel } from '../components/trust/FraudScanPanel';
import { Reveal } from '../components/motion/Reveal';
import { VerificationDemo } from '../components/home/VerificationDemo';
import { store } from '../mock/store';
import type { Listing } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenListingDetail
}) => {
  const [selectedTrustListing, setSelectedTrustListing] = useState<Listing | null>(null);

  const categories = store.getCategories();
  const listings = store.getPublishedListings();
  const featuredListings = listings.filter(l => l.isFeatured);

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

  const CITY_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  ];
  // Top cities by real inventory; counts come from the dataset, not hard-coded strings.
  const cityCounts = store.getCitiesWithCounts();
  const locations = cityCounts.slice(0, 5).map((c, i) => ({
    city: c.city,
    count: c.count,
    img: CITY_IMAGES[i % CITY_IMAGES.length],
  }));

  const categoryCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.categorySlug] = (acc[l.categorySlug] || 0) + 1;
    return acc;
  }, {});
  const avgTrust = Math.round(listings.reduce((s, l) => s + l.trustScore.overallScore, 0) / Math.max(listings.length, 1));
  const heroListing =
    [...listings].filter(l => l.categorySlug === 'property').sort((x, y) => y.trustScore.overallScore - x.trustScore.overallScore)[0] || listings[0];
  const reduce = useReducedMotion();
  const headlineLines = ['Checked before', 'it is listed.'];

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] pt-32 pb-20 flex items-center overflow-hidden">
        <div className="absolute inset-0 ledger-grid pointer-events-none" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <h1 className="display-hero text-navy-900" aria-label="Checked before it is listed.">
                {headlineLines.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.08em]" aria-hidden>
                    <motion.span
                      className="block"
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-7 text-navy-800 text-lg max-w-lg leading-relaxed"
              >
                Ownership papers, seller identity, location and photos are checked on every listing.
                Pick a city, then see exactly what was verified.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-9 max-w-2xl"
              >
                <SearchBarExpandable
                  onExecuteSearch={(query, cat, city) => {
                    onNavigate(`search?q=${encodeURIComponent(query || '')}&category=${cat || ''}&city=${city || ''}`);
                  }}
                />
              </motion.div>

              <motion.dl
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-10 flex flex-wrap gap-x-12 gap-y-4"
              >
                {[
                  { v: listings.length.toLocaleString('en-IN'), l: 'verified listings' },
                  { v: String(cityCounts.length), l: 'cities' },
                  { v: `${avgTrust}/100`, l: 'average trust score' },
                ].map(stat => (
                  <div key={stat.l}>
                    <dt className="font-display text-3xl font-semibold text-navy-900 num-mono">{stat.v}</dt>
                    <dd className="text-sm text-navy-700">{stat.l}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              {heroListing && <VerificationDemo listing={heroListing} onOpen={onOpenListingDetail} />}
            </div>
          </div>
        </div>
      </section>

      {/* CITY MARQUEE: live cities and counts from the dataset */}
      <div className="marquee overflow-hidden border-y border-navy-900/10 py-5 -my-8" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <div key={dup} className="flex items-center shrink-0">
              {cityCounts.map(c => (
                <span key={c.city + dup} className="font-display text-4xl sm:text-5xl font-semibold text-navy-900/80 px-8 flex items-center gap-8">
                  {c.city}
                  <span className="text-base text-orange-600 font-sans num-mono">{c.count}</span>
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 2. CATEGORY DISCOVERY RAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Reveal><h2 className="display-section text-navy-900">
              Browse by category
            </h2></Reveal>
          </div>
          <a
            href="#search"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-navy-900 hover:text-orange-500 transition-colors"
          >
            <span className="link-underline">See all listings</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Dynamic Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(cat => {
            const IconComp = categoryIcons[cat.slug] || Package;
            return (
              <a
                key={cat.slug}
                href={`#category/${cat.slug}`}
                className="group block relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer border border-navy-900/10 shadow-sm card-hover-lift"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent transition-opacity" />

                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-amber-soft transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-cream-200 line-clamp-1 mt-0.5 opacity-90">
                      {categoryCounts[cat.slug] || 0} {(categoryCounts[cat.slug] || 0) === 1 ? 'listing' : 'listings'}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 3. VERIFIED FEATURED LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Reveal><h2 className="display-section text-navy-900">
              Highest-trust listings right now
            </h2></Reveal>
          </div>

          <a
            href="#search"
            className="inline-flex w-fit items-center gap-2 px-5 py-2.5 bg-navy-900 text-cream-50 font-bold rounded-2xl text-xs hover:bg-navy-800 transition-colors cursor-pointer"
          >
            <span>See all {listings.length} listings</span>
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onOpenListing={onOpenListingDetail}
              onOpenTrustModal={setSelectedTrustListing}
            />
          ))}
        </div>
      </section>

      {/* 4. TRUST SCORE EXPLANATION & INTERACTIVE AUDIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustScoreChart
          trustScore={featuredListings[0]?.trustScore || listings[0].trustScore}
        />
      </section>

      {/* 5. VERIFICATION JOURNEY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VerificationTimeline />
      </section>

      {/* 6. AI MEDIA & FRAUD SCANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FraudScanPanel />
      </section>

      {/* 7. POPULAR LOCATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="display-section text-navy-900">
            Start in your city
          </h2>
          <p className="text-sm text-navy-700 mt-2">
            Cities with the most verified inventory
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {locations.map(loc => (
            <a
              key={loc.city}
              href={`#search?city=${encodeURIComponent(loc.city)}`}
              className="group block relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-navy-900/10 shadow-sm card-hover-lift"
            >
              <img
                src={loc.img}
                alt={loc.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base font-extrabold group-hover:text-orange-400 transition-colors">
                  {loc.city}
                </h3>
                <span className="text-[11px] text-cream-200 block font-medium">
                  {loc.count} {loc.count === 1 ? 'listing' : 'listings'}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Trust Score Breakdown Modal */}
      {selectedTrustListing && (
        <TrustScoreChart
          trustScore={selectedTrustListing.trustScore}
          isModal
          onClose={() => setSelectedTrustListing(null)}
        />
      )}
    </div>
  );
};
