"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { logo } from "@/lib/brand";
import { callHref, mainNav, quoteHref, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export type MenuItem = { href: string; title: string; summary: string; icon: ReactNode };

const EASE = [0.22, 1, 0.36, 1] as const;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function useScrolledPast(threshold: number) {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ industriesMenu }: { industriesMenu: MenuItem[] }) {
  const pathname = usePathname();
  const scrolled = useScrolledPast(24);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close menus whenever the route changes (including back/forward navigation).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setDropdownOpen(false);
  }

  const solid = scrolled || mobileOpen || dropdownOpen;
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ease-premium",
          solid
            ? "bg-white/95 shadow-[0_1px_0_rgb(16_37_26/0.06),0_16px_40px_-28px_rgb(16_37_26/0.35)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="container-site relative flex h-[72px] items-center justify-between gap-4 lg:h-20">
          {/* Logo sits on a white tab so the official artwork stays legible over dark imagery */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className={cn(
              "relative z-10 self-start rounded-b-2xl bg-white px-3 py-2.5 transition-shadow duration-500",
              solid ? "shadow-none" : "shadow-[0_22px_44px_-20px_rgb(0_0_0/0.6)]",
            )}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              sizes="(min-width: 1024px) 104px, 80px"
              loading="eager"
              className={cn(
                "w-auto transition-[height] duration-500 ease-premium",
                solid ? "h-[52px] lg:h-[60px]" : "h-[64px] lg:h-[86px]",
              )}
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {mainNav.map((item) =>
                item.dropdown ? (
                  <NavDropdown
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    items={industriesMenu}
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                    solid={solid}
                    active={isActivePath(pathname, item.href)}
                  />
                ) : (
                  <li key={item.href}>
                    <NavLink href={item.href} solid={solid} active={isActivePath(pathname, item.href)}>
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <ButtonLink href={quoteHref} variant={solid ? "primary" : "accent"} size="sm" arrow>
                Request a Quote
              </ButtonLink>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label="Open menu"
              className={cn(
                "grid size-11 place-items-center rounded-full border transition-colors lg:hidden",
                solid
                  ? "border-mist-200 bg-white text-ink-900 hover:bg-mist-50"
                  : "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={closeMobile}
        pathname={pathname}
        industriesMenu={industriesMenu}
        returnFocusRef={menuButtonRef}
      />
    </>
  );
}

const navItemClass = (solid: boolean, active: boolean) =>
  cn(
    "relative rounded-full px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-300 xl:px-3.5",
    solid ? "text-ink-700 hover:text-forest-700" : "text-white/80 hover:text-white",
    active && (solid ? "text-forest-700" : "text-white"),
  );

function ActiveBar({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-sun-400 transition-transform duration-500 ease-premium xl:inset-x-3.5",
        active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

function NavLink({ href, solid, active, children }: { href: string; solid: boolean; active: boolean; children: ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn("block", navItemClass(solid, active))}>
      {children}
      <ActiveBar active={active} />
    </Link>
  );
}

function NavDropdown({
  label,
  href,
  items,
  open,
  setOpen,
  solid,
  active,
}: {
  label: string;
  href: string;
  items: MenuItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  solid: boolean;
  active: boolean;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <li
      ref={wrapperRef}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={cn("flex items-center gap-1.5", navItemClass(solid, active))}
      >
        {label}
        <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
        <ActiveBar active={active} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={panelId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute inset-x-4 top-full pt-3 sm:inset-x-6 lg:inset-x-8"
          >
            <div className="grid grid-cols-[1fr_17rem] overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-lift">
              <ul className="grid grid-cols-2 gap-1 p-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onNavigate={() => setOpen(false)}
                      className="group flex h-full gap-4 rounded-2xl p-4 transition-colors hover:bg-mist-50"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-leaf-50 text-forest-700 ring-1 ring-leaf-100 transition-colors group-hover:bg-forest-700 group-hover:text-sun-300">
                        {item.icon}
                      </span>
                      <span>
                        <span className="flex items-center gap-1 font-display font-semibold text-ink-900">
                          {item.title}
                          <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-500">{item.summary}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="surface-dark relative flex flex-col justify-between overflow-hidden bg-forest-900 p-7 text-white">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.3),transparent_70%)]"
                />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-200">Industries</p>
                  <p className="mt-3 font-display text-xl font-semibold leading-snug">
                    Every sector, one responsible standard.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Tell us about the battery scrap your business generates and we&rsquo;ll suggest the right next step.
                  </p>
                </div>
                <div className="relative mt-6 flex flex-col gap-3">
                  <Link
                    href={quoteHref}
                    onNavigate={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sun-300 hover:text-sun-100"
                  >
                    Request a quote <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <Link
                    href={href}
                    onNavigate={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
                  >
                    View all industries <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MobileNav({
  open,
  onClose,
  pathname,
  industriesMenu,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  industriesMenu: MenuItem[];
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [subOpen, setSubOpen] = useState(false);
  const subListId = useId();

  // Lock page scroll, trap focus and support Escape while open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const returnTarget = returnFocusRef.current;

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ??
          [],
      );
    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      returnTarget?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="backdrop"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-forest-950/55 backdrop-blur-sm lg:hidden"
          />
          <m.div
            key="panel"
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[26rem] flex-col bg-white shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-mist-200 px-5 py-3">
              <Link href="/" onNavigate={onClose} aria-label={`${site.name} — home`}>
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="72px" className="h-14 w-auto" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full border border-mist-200 text-ink-900 transition-colors hover:bg-mist-50"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {mainNav.map((item, index) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <m.li
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + index * 0.05, duration: 0.45, ease: EASE }}
                    >
                      {item.dropdown ? (
                        <>
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              onNavigate={onClose}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex-1 py-3 font-display text-2xl font-semibold tracking-tight",
                                active ? "text-forest-700" : "text-ink-900",
                              )}
                            >
                              {item.label}
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSubOpen((value) => !value)}
                              aria-expanded={subOpen}
                              aria-controls={subListId}
                              aria-label={subOpen ? `Hide ${item.label.toLowerCase()}` : `Show ${item.label.toLowerCase()}`}
                              className="grid size-10 place-items-center rounded-full bg-mist-100 text-ink-700"
                            >
                              <ChevronDown
                                aria-hidden="true"
                                className={cn("size-5 transition-transform duration-300", subOpen && "rotate-180")}
                              />
                            </button>
                          </div>
                          <AnimatePresence initial={false}>
                            {subOpen && (
                              <m.ul
                                id={subListId}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="overflow-hidden"
                              >
                                {industriesMenu.map((entry) => (
                                  <li key={entry.href}>
                                    <Link
                                      href={entry.href}
                                      onNavigate={onClose}
                                      className="flex items-center gap-3 rounded-xl py-2.5 pl-1 text-[0.9375rem] font-medium text-ink-600 hover:text-forest-700"
                                    >
                                      <span className="grid size-8 place-items-center rounded-lg bg-leaf-50 text-forest-700 [&_svg]:size-4">
                                        {entry.icon}
                                      </span>
                                      {entry.title}
                                    </Link>
                                  </li>
                                ))}
                              </m.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onNavigate={onClose}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between py-3 font-display text-2xl font-semibold tracking-tight",
                            active ? "text-forest-700" : "text-ink-900",
                          )}
                        >
                          {item.label}
                          {active && <span aria-hidden="true" className="size-2 rounded-full bg-sun-400" />}
                        </Link>
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-mist-200 bg-mist-50 px-5 py-6">
              <ButtonLink href={quoteHref} arrow block onClick={onClose}>
                Request a Quote
              </ButtonLink>
              <div className="grid gap-2 text-sm text-ink-600">
                {callHref.startsWith("tel:") ? (
                  <a href={callHref} className="flex items-center gap-2.5 hover:text-forest-700">
                    <Phone className="size-4 text-leaf-600" aria-hidden="true" /> {site.contact.phone.display}
                  </a>
                ) : (
                  <Link href={callHref} onNavigate={onClose} className="flex items-center gap-2.5 hover:text-forest-700">
                    <Phone className="size-4 text-leaf-600" aria-hidden="true" /> {site.contact.phone.display}
                  </Link>
                )}
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 hover:text-forest-700">
                  <Mail className="size-4 text-leaf-600" aria-hidden="true" /> {site.contact.email}
                </a>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
