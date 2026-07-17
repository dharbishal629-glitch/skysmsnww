import { useState, useMemo } from "react";
import { useListServices, useGetAvailability, useCreateRental, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe, CheckCircle2, AlertCircle, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/SearchableSelect";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface LiveCountry {
  code: string;
  name: string;
  flag: string;
  available: number;
  heroPrice: number;
  price: number;
}

function useCountriesForService(serviceCode: string) {
  return useQuery<{ countries: LiveCountry[] }>({
    queryKey: ["/api/catalog/countries-for-service", serviceCode],
    queryFn: async () => {
      const res = await fetch(`/api/catalog/countries-for-service?serviceCode=${serviceCode}`);
      if (!res.ok) throw new Error("Failed to load countries");
      return res.json();
    },
    enabled: !!serviceCode,
    refetchInterval: 20_000,
    staleTime: 20_000,
  });
}

const serviceIconDomains: Record<string, string> = {
  aol: "aol.com", aliexpress: "aliexpress.com", telegram: "telegram.org",
  whatsapp: "whatsapp.com", google: "google.com", instagram: "instagram.com",
  facebook: "facebook.com", twitter: "x.com", "x / twitter": "x.com",
  discord: "discord.com", amazon: "amazon.com", tiktok: "tiktok.com",
  snapchat: "snapchat.com", linkedin: "linkedin.com", netflix: "netflix.com",
  spotify: "spotify.com", uber: "uber.com", airbnb: "airbnb.com",
  paypal: "paypal.com", apple: "apple.com", yandex: "yandex.com",
  yahoo: "yahoo.com", proton: "proton.me", "ok.ru": "ok.ru", qq: "qq.com",
  wechat: "wechat.com", viber: "viber.com", vk: "vk.com",
  tinder: "tinder.com", bumble: "bumble.com", "pof.com": "pof.com",
  coinbase: "coinbase.com", steam: "steampowered.com", naver: "naver.com",
  bolt: "bolt.eu", wise: "wise.com", nike: "nike.com",
};

function getServiceIcon(name: string): string | null {
  const key = name.toLowerCase();
  const domain = serviceIconDomains[key] ?? Object.entries(serviceIconDomains).find(([label]) => key.includes(label))?.[1];
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function maskProviderName(name: string): string {
  return name === "Hero SMS" ? "SKY SMS" : name;
}

type SortMode = "stock" | "price-asc" | "price-desc";

function SortPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-semibold transition-all duration-150 ${
        active
          ? "bg-[#4574FF]/15 border border-[#4574FF]/25 text-[#4574FF]"
          : "border border-slate-200 dark:border-white/[0.07] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.12]"
      }`}
    >
      {children}
    </button>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const iconUrl = getServiceIcon(name);
  const initials = name.slice(0, 2).toUpperCase();
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className="h-7 w-7 rounded-lg object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className="h-7 w-7 rounded-lg bg-[#4574FF]/15 border border-[#4574FF]/20 flex items-center justify-center">
      <span className="text-[9px] font-black text-[#4574FF]">{initials}</span>
    </div>
  );
}

export default function Rent() {
  const { t } = useLanguage();
  const [serviceCode, setServiceCode] = useState<string>(
    () => new URLSearchParams(window.location.search).get("service") ?? ""
  );
  const [countryCode, setCountryCode] = useState<string>(
    () => new URLSearchParams(window.location.search).get("country") ?? ""
  );
  const [sort, setSort] = useState<SortMode>("stock");
  const [serviceSearch, setServiceSearch] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: servicesData, isLoading: loadingServices, isError: servicesError, refetch: refetchServices } = useListServices({}, {
    query: { queryKey: ["/api/catalog/services"], refetchInterval: 20_000, staleTime: 20_000 }
  });

  const { data: countriesData, isLoading: loadingCountries } = useCountriesForService(serviceCode);

  const { data: availability, isLoading: loadingAvailability, isFetching: fetchingAvailability } = useGetAvailability(
    { countryCode, serviceCode },
    {
      query: {
        enabled: !!countryCode && !!serviceCode,
        queryKey: ["/api/catalog/availability", { countryCode, serviceCode }],
        refetchInterval: 15000,
      }
    }
  );

  const createRental = useCreateRental();

  const handleRent = () => {
    if (!countryCode || !serviceCode) return;
    createRental.mutate({ data: { countryCode, serviceCode } }, {
      onSuccess: (rental) => {
        toast({
          title: "Number rented!",
          description: `Ready to receive SMS for ${rental.serviceName}.`,
        });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        queryClient.invalidateQueries({ queryKey: ["/api/rentals"] });
        setLocation("/rentals");
      },
      onError: (error: unknown) => {
        const apiErr = error as { data?: { error?: string }; message?: string } | null;
        const description = apiErr?.data?.error || apiErr?.message || "Check your balance and try again.";
        toast({ title: "Failed to rent", description, variant: "destructive" });
      }
    });
  };

  const allServices = servicesData?.services ?? [];

  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return allServices;
    const q = serviceSearch.toLowerCase();
    return allServices.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.category ?? "").toLowerCase().includes(q)
    );
  }, [allServices, serviceSearch]);

  const liveCountries = countriesData?.countries ?? [];

  const sortedCountries = useMemo(() => {
    const arr = [...liveCountries];
    if (sort === "price-asc") return arr.sort((a, b) => (a.price || 999) - (b.price || 999));
    if (sort === "price-desc") return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    return arr.sort((a, b) => b.available - a.available);
  }, [liveCountries, sort]);

  const countryOptions = sortedCountries.map((country) => ({
    value: country.code,
    label: country.name,
    searchText: `${country.name} ${country.code}`,
    meta: country.price > 0 ? `$${country.price.toFixed(2)}` : "",
    icon: country.flag || "🌍",
  }));

  const selectedService = allServices.find(s => s.code === serviceCode);
  const isAvailable = availability && availability.available > 0 && availability.provider.mode === "live";
  const canRent = isAvailable && !createRental.isPending;

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
          {t("rentANumber")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[13px]">Pick a service, then choose a country. Prices refresh in real time.</p>
      </div>

      {/* Step 1: Service Selection */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] overflow-hidden shadow-sm dark:shadow-none">
        <div className="px-4 py-3 border-b border-slate-200/80 dark:border-white/[0.05] flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-[14px]">
              1 — Select Service
              {selectedService && (
                <span className="ml-2 text-[#4574FF] text-[13px] font-medium">
                  ✓ {selectedService.name}
                </span>
              )}
            </div>
            {!selectedService && <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Search and tap a service below</div>}
          </div>
          {selectedService && (
            <button
              type="button"
              onClick={() => { setServiceCode(""); setCountryCode(""); }}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Change service"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] focus-within:border-[#4574FF]/40 focus-within:bg-[#4574FF]/[0.03] transition-all">
            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <input
              type="text"
              value={serviceSearch}
              onChange={e => setServiceSearch(e.target.value)}
              placeholder="Telegram, Discord, WhatsApp…"
              className="flex-1 bg-transparent text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
            />
            {serviceSearch && (
              <button onClick={() => setServiceSearch("")} className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Service list */}
        {loadingServices ? (
          <div className="px-3 pb-3 space-y-1.5">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
            ))}
          </div>
        ) : servicesError ? (
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2.5 text-[12px] text-red-600 dark:text-red-200">
              <span>Services failed to load.</span>
              <button type="button" onClick={() => refetchServices()} className="font-bold text-red-500 dark:text-red-100 flex items-center gap-1 hover:text-red-700 dark:hover:text-white transition-colors">
                <RefreshCw className="h-3 w-3" /> {t("retry")}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 pb-3 max-h-[320px] overflow-y-auto space-y-0.5">
            {filteredServices.length === 0 ? (
              <div className="py-6 text-center text-[13px] text-slate-500 dark:text-slate-400">No services found.</div>
            ) : (
              filteredServices.map(service => {
                const isSelected = service.code === serviceCode;
                return (
                  <button
                    key={service.code}
                    type="button"
                    onClick={() => { setServiceCode(service.code); setCountryCode(""); setServiceSearch(""); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100 ${
                      isSelected
                        ? "bg-[#4574FF]/12 border border-[#4574FF]/25 text-slate-900 dark:text-white"
                        : "hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-transparent text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <ServiceIcon name={service.name} />
                    <span className="flex-1 text-[13.5px] font-medium truncate min-w-0">{service.name}</span>
                    <span className="text-[12px] text-slate-400 dark:text-slate-500 shrink-0">${service.price.toFixed(2)}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-[#4574FF] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Step 2: Country Selection — only visible after service picked */}
      {serviceCode && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] overflow-hidden shadow-sm dark:shadow-none">
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-white/[0.05] flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-[14px]">
                2 — Select Country
                {countryCode && (
                  <span className="ml-2 text-[#4574FF] text-[13px] font-medium">
                    ✓ {liveCountries.find(c => c.code === countryCode)?.name}
                  </span>
                )}
              </div>
              {!countryCode && <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Choose where you want your number from</div>}
            </div>
            {serviceCode && !loadingCountries && liveCountries.length > 1 && (
              <div className="flex items-center gap-1">
                <SortPill active={sort === "stock"} onClick={() => setSort("stock")}>
                  <ArrowUpDown className="h-3 w-3" />
                </SortPill>
                <SortPill active={sort === "price-asc"} onClick={() => setSort("price-asc")}>
                  <ArrowUp className="h-3 w-3" />
                </SortPill>
                <SortPill active={sort === "price-desc"} onClick={() => setSort("price-desc")}>
                  <ArrowDown className="h-3 w-3" />
                </SortPill>
              </div>
            )}
          </div>

          <div className="p-4">
            {loadingCountries ? (
              <div className="space-y-2">
                <Skeleton className="h-11 w-full rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
              </div>
            ) : liveCountries.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3 py-3 text-[12px] text-slate-500 dark:text-slate-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                No countries available for this service. Try a different one.
              </div>
            ) : (
              <SearchableSelect
                value={countryCode}
                options={countryOptions}
                placeholder="Search a country…"
                searchPlaceholder="Type country name…"
                emptyText="No country found."
                onChange={setCountryCode}
              />
            )}
          </div>
        </div>
      )}

      {/* Step 3: Availability + Rent */}
      {countryCode && serviceCode && (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none ${isAvailable ? "border-emerald-500/20" : "border-slate-200 dark:border-white/[0.07]"} bg-white dark:bg-white/[0.025]`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-white/[0.05]">
            <div className="font-semibold text-slate-900 dark:text-white text-[14px]">3 — Confirm & Rent</div>
            {(loadingAvailability || fetchingAvailability) && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 dark:text-slate-600" />
            )}
          </div>

          <div className="p-4">
            {!availability && !loadingAvailability ? (
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-300 bg-rose-400/[0.06] border border-rose-400/15 rounded-xl p-3.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-[13px] font-medium">Failed to check availability.</span>
              </div>
            ) : availability ? (
              <div className="space-y-4">
                {availability.available === 0 && (
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl p-3.5">
                    <AlertCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-700 dark:text-slate-300 text-[13.5px]">No numbers available</div>
                      <div className="text-[12px] mt-0.5 text-slate-500 dark:text-slate-600">Try a different country.</div>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.015] divide-y divide-slate-200/80 dark:divide-white/[0.04]">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Price per SMS</span>
                    <span className="text-[18px] font-bold text-slate-900 dark:text-white" data-testid="text-price-quote">${availability.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Numbers in stock</span>
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{availability.available.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Network</span>
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">{maskProviderName(availability.provider.name)}</span>
                  </div>
                </div>

                <button
                  className={`w-full h-12 rounded-xl text-[14.5px] font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
                    canRent
                      ? "bg-[#4574FF] text-white hover:bg-blue-500 shadow-[0_2px_16px_rgba(69,116,255,0.3)]"
                      : "bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                  disabled={!canRent}
                  onClick={handleRent}
                  data-testid="button-confirm-rent"
                >
                  {createRental.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Allocating…</>
                  ) : availability?.provider.mode !== "live" ? (
                    "Provider Unavailable"
                  ) : availability?.available === 0 ? (
                    "No Numbers Available"
                  ) : (
                    `Rent Number — $${availability.price.toFixed(2)}`
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
                <Skeleton className="h-24 w-full rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
                <Skeleton className="h-12 w-full rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
