/* @ds-bundle: {"format":4,"namespace":"ClickForgeDesignSystem_494c16","components":[{"name":"ThirdsGrid","sourcePath":"components/brand/ThirdsGrid.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"NavPill","sourcePath":"components/core/NavPill.jsx"},{"name":"CTRScore","sourcePath":"components/data/CTRScore.jsx"},{"name":"MeterBar","sourcePath":"components/data/MeterBar.jsx"},{"name":"StatBlock","sourcePath":"components/data/StatBlock.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"FeatureRow","sourcePath":"components/marketing/FeatureRow.jsx"},{"name":"LogoStrip","sourcePath":"components/marketing/LogoStrip.jsx"},{"name":"PricingTier","sourcePath":"components/marketing/PricingTier.jsx"},{"name":"PromoBanner","sourcePath":"components/marketing/PromoBanner.jsx"},{"name":"SectionHeading","sourcePath":"components/marketing/SectionHeading.jsx"}],"sourceHashes":{"components/brand/ThirdsGrid.jsx":"6d68aba0c380","components/brand/Wordmark.jsx":"6a55d85ed621","components/core/Badge.jsx":"a58949f0251e","components/core/Button.jsx":"f349805959ac","components/core/Card.jsx":"9a02cf1d3b3b","components/core/Eyebrow.jsx":"8c72ce6feb80","components/core/Icon.jsx":"5e6bd9b3abd4","components/core/NavPill.jsx":"86afe1d3ad77","components/data/CTRScore.jsx":"5feda0444ad0","components/data/MeterBar.jsx":"08b1f5abcdb5","components/data/StatBlock.jsx":"d58a596b98dc","components/forms/Input.jsx":"d862365fe568","components/forms/SegmentedControl.jsx":"735c5bc87475","components/forms/Textarea.jsx":"ad14344c4def","components/marketing/FeatureRow.jsx":"2f8cf0621c52","components/marketing/LogoStrip.jsx":"320a3c8447de","components/marketing/PricingTier.jsx":"0f6604cac767","components/marketing/PromoBanner.jsx":"57cbe2392d8b","components/marketing/SectionHeading.jsx":"b637dacca590","ui_kits/app/AppShell.jsx":"533d16e20582","ui_kits/app/DataViews.jsx":"451830b674c3","ui_kits/app/ForgeView.jsx":"9a903eb853b5","ui_kits/marketing/Chrome.jsx":"68f7637d8a19","ui_kits/marketing/ForgePanel.jsx":"6115890acf5e","ui_kits/marketing/Sections.jsx":"13a3e762f834"},"inlinedExternals":[],"unexposedExports":[{"name":"ctrTone","sourcePath":"components/data/CTRScore.jsx"}]} */

(() => {

const __ds_ns = (window.ClickForgeDesignSystem_494c16 = window.ClickForgeDesignSystem_494c16 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/ThirdsGrid.jsx
try { (() => {
function ThirdsGrid({
  children,
  thirds = true,
  fade = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'var(--bg-thirds-grid)',
      backgroundSize: 'var(--bg-thirds-grid-size)',
      maskImage: fade ? 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)' : undefined,
      WebkitMaskImage: fade ? 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)' : undefined
    }
  }), thirds && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'linear-gradient(to right, transparent calc(33.333% - 1px), var(--grid-line-thirds) calc(33.333% - 1px), var(--grid-line-thirds) 33.333%, transparent 33.333%, transparent calc(66.666% - 1px), var(--grid-line-thirds) calc(66.666% - 1px), var(--grid-line-thirds) 66.666%, transparent 66.666%), linear-gradient(to bottom, transparent calc(33.333% - 1px), var(--grid-line-thirds) calc(33.333% - 1px), var(--grid-line-thirds) 33.333%, transparent 33.333%, transparent calc(66.666% - 1px), var(--grid-line-thirds) calc(66.666% - 1px), var(--grid-line-thirds) 66.666%, transparent 66.666%)',
      maskImage: fade ? 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 100%)' : undefined,
      WebkitMaskImage: fade ? 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 100%)' : undefined
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, children));
}
Object.assign(__ds_scope, { ThirdsGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ThirdsGrid.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function Wordmark({
  size = 20,
  color = 'var(--text-primary)',
  accent = 'var(--color-ember)',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: size,
      letterSpacing: '-0.045em',
      color,
      lineHeight: 1,
      ...style
    }
  }, "Click", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "Forge"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    color: 'var(--text-secondary)',
    border: '1px solid var(--color-slate-edge)',
    background: 'transparent'
  },
  ember: {
    color: 'var(--color-ember)',
    border: '1px solid var(--color-ember-edge)',
    background: 'var(--color-ember-wash)'
  },
  solid: {
    color: 'var(--action-primary-fg)',
    border: '1px solid transparent',
    background: 'var(--color-ember)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 7px',
      borderRadius: 'var(--radius-tags)',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      lineHeight: 1.2,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...TONES[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    padding: '6px 12px',
    fontSize: '13px'
  },
  md: {
    padding: '8px 16px',
    fontSize: '14px'
  },
  lg: {
    padding: '12px 20px',
    fontSize: '16px'
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--action-primary-bg)',
    color: 'var(--action-primary-fg)',
    border: '1px solid transparent',
    boxShadow: 'var(--glow-ember-soft)'
  },
  inverted: {
    background: 'var(--action-inverted-bg)',
    color: 'var(--action-inverted-fg)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--action-secondary-fg)',
    border: '1px solid var(--action-secondary-border)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent'
  }
};
const HOVER = {
  primary: {
    background: 'var(--action-primary-bg-hover)'
  },
  inverted: {
    background: '#ececec'
  },
  secondary: {
    background: 'var(--surface-elevated)',
    borderColor: 'var(--color-mist)'
  },
  ghost: {
    background: 'var(--surface-elevated)',
    color: 'var(--text-primary)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  onClick,
  type = 'button',
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const base = VARIANTS[variant] || VARIANTS.primary;
  const hovered = !disabled && hover ? HOVER[variant] : null;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-8)',
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-medium)',
      letterSpacing: '-0.25px',
      lineHeight: 1.4,
      borderRadius: 'var(--radius-buttons)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
      transition: `background ${'var(--duration-fast)'} var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)`,
      transform: active && !disabled ? 'translateY(1px)' : 'none',
      opacity: disabled ? 0.45 : 1,
      color: disabled ? 'var(--text-disabled)' : base.color,
      ...SIZES[size],
      ...base,
      ...(disabled ? {
        boxShadow: 'none',
        color: 'var(--text-disabled)'
      } : null),
      ...hovered,
      ...style
    }
  }, iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  level = 1,
  accent = false,
  padding = 'var(--card-padding)',
  interactive = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const bg = level === 2 ? 'var(--surface-elevated)' : level === 0 ? 'transparent' : 'var(--surface-card)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: interactive && hover ? 'var(--surface-elevated)' : bg,
      border: accent ? 'var(--border-accent)' : 'var(--border-hairline)',
      borderRadius: 'var(--radius-cards)',
      padding,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
      borderColor: interactive && hover ? 'var(--color-smoke)' : undefined,
      boxShadow: accent ? 'var(--glow-ember-soft)' : 'none',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  tone = 'muted',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      lineHeight: 'var(--leading-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: tone === 'ember' ? 'var(--color-ember)' : 'var(--text-secondary)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/* Renders a Lucide glyph. Requires the Lucide UMD script on the page:
   <script src="https://unpkg.com/lucide@0.454.0/dist/umd/lucide.min.js"></script> */
function Icon({
  name,
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.5,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        stroke: color,
        'stroke-width': strokeWidth
      },
      nameAttr: 'data-lucide'
    });
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: '0 0 auto',
      color,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/NavPill.jsx
try { (() => {
function NavPill({
  children,
  href = '#',
  active = false,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: 'var(--radius-navpills)',
      fontFamily: 'var(--font-inter)',
      fontSize: '14px',
      fontWeight: 'var(--font-weight-medium)',
      letterSpacing: '-0.25px',
      textDecoration: 'none',
      color: active || hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: hover ? 'var(--surface-elevated)' : 'transparent',
      transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)'
    }
  }, children);
}
Object.assign(__ds_scope, { NavPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavPill.jsx", error: String((e && e.message) || e) }); }

// components/data/CTRScore.jsx
try { (() => {
function ctrTone(score) {
  if (score >= 8) return 'var(--color-ctr-high)';
  if (score >= 5) return 'var(--color-ctr-mid)';
  return 'var(--color-ctr-low)';
}
function CTRScore({
  score = 0,
  label = 'Predicted CTR',
  size = 'md',
  showRing = true,
  style
}) {
  const dim = size === 'lg' ? 96 : size === 'sm' ? 44 : 64;
  const tone = ctrTone(score);
  const pct = Math.max(0, Math.min(100, score / 12 * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacing-16)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: dim,
      height: dim,
      borderRadius: 'var(--radius-full)',
      display: 'grid',
      placeItems: 'center',
      background: showRing ? `conic-gradient(${tone} ${pct}%, var(--surface-elevated) ${pct}% 100%)` : 'var(--surface-elevated)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '4px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-inter)',
      fontWeight: 'var(--font-weight-medium)',
      fontSize: size === 'lg' ? '28px' : size === 'sm' ? '14px' : '20px',
      letterSpacing: '-0.6px',
      color: tone
    }
  }, score.toFixed(1))), label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-primary)'
    }
  }, score >= 8 ? 'Top decile' : score >= 5 ? 'Above channel median' : 'Below channel median')));
}
Object.assign(__ds_scope, { ctrTone, CTRScore });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CTRScore.jsx", error: String((e && e.message) || e) }); }

// components/data/MeterBar.jsx
try { (() => {
function MeterBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  tone = 'ember',
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fill = tone === 'ember' ? 'var(--color-ember)' : tone;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      ...style
    }
  }, (label || valueLabel) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-secondary)'
    }
  }, valueLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-elevated)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 'var(--radius-sm)',
      background: fill,
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { MeterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MeterBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatBlock.jsx
try { (() => {
function StatBlock({
  icon = null,
  value,
  label,
  caption,
  align = 'center',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align === 'center' ? 'center' : 'left',
      gap: 'var(--spacing-8)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-ember)',
      display: 'flex',
      marginBottom: '4px'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-heading-lg)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--leading-heading-lg)',
      letterSpacing: 'var(--tracking-heading-lg)',
      color: 'var(--text-primary)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body)',
      fontWeight: 'var(--font-weight-medium)',
      letterSpacing: 'var(--tracking-body)',
      color: 'var(--text-primary)'
    }
  }, label), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body-sm)',
      letterSpacing: 'var(--tracking-body-sm)',
      color: 'var(--text-secondary)',
      maxWidth: '320px'
    }
  }, caption));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  value,
  onChange,
  placeholder,
  label,
  hint,
  disabled = false,
  type = 'text',
  iconLeft = null,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-8)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-8)',
      background: 'var(--surface-card)',
      border: `1px solid ${focus ? 'var(--color-ember)' : 'var(--color-slate-edge)'}`,
      borderRadius: 'var(--radius-inputs)',
      padding: '10px 12px',
      opacity: disabled ? 0.5 : 1,
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, iconLeft, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      all: 'unset',
      width: '100%',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      letterSpacing: 'var(--tracking-body-sm)',
      color: 'var(--text-primary)'
    }
  })), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: '12px',
      color: 'var(--text-disabled)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: '2px',
      padding: '3px',
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-inputs)',
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    const on = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      onClick: () => onChange && onChange(val),
      style: {
        all: 'unset',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter)',
        fontSize: '13px',
        fontWeight: 'var(--font-weight-medium)',
        letterSpacing: '-0.25px',
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: on ? 'var(--surface-elevated)' : 'transparent',
        boxShadow: on ? 'inset 0 0 0 1px var(--color-slate-edge)' : 'none',
        transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)'
      }
    }, typeof o === 'object' && o.icon, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function Textarea({
  value,
  onChange,
  placeholder,
  label,
  rows = 4,
  maxLength,
  disabled = false,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-8)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      background: 'var(--surface-card)',
      border: `1px solid ${focus ? 'var(--color-ember)' : 'var(--color-slate-edge)'}`,
      borderRadius: 'var(--radius-inputs)',
      padding: '12px',
      opacity: disabled ? 0.5 : 1,
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    rows: rows,
    maxLength: maxLength,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      all: 'unset',
      display: 'block',
      width: '100%',
      resize: 'none',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-body)',
      letterSpacing: 'var(--tracking-body)',
      color: 'var(--text-primary)'
    }
  }), maxLength && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      textAlign: 'right',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-disabled)',
      marginTop: '8px'
    }
  }, (value || '').length, "/", maxLength)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FeatureRow.jsx
try { (() => {
function FeatureRow({
  icon = 'sparkles',
  title,
  children,
  meta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-16)',
      alignItems: 'flex-start',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: '32px',
      height: '32px',
      flex: '0 0 auto',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-ember-wash)',
      border: 'var(--border-accent)',
      color: 'var(--color-ember)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body)',
      fontWeight: 'var(--font-weight-medium)',
      letterSpacing: 'var(--tracking-body)',
      color: 'var(--text-primary)'
    }
  }, title), meta), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body-sm)',
      letterSpacing: 'var(--tracking-body-sm)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, children)));
}
Object.assign(__ds_scope, { FeatureRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FeatureRow.jsx", error: String((e && e.message) || e) }); }

// components/marketing/LogoStrip.jsx
try { (() => {
function LogoStrip({
  label,
  names = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      alignItems: 'center',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--spacing-40)'
    }
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: '18px',
      fontWeight: 'var(--font-weight-semibold)',
      letterSpacing: '-0.03em',
      color: 'var(--text-secondary)',
      opacity: 0.75
    }
  }, n))));
}
Object.assign(__ds_scope, { LogoStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/LogoStrip.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PricingTier.jsx
try { (() => {
function PricingTier({
  name,
  price,
  period = '/mo',
  blurb,
  features = [],
  featured = false,
  ctaLabel = 'Start forging',
  onSelect,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    accent: featured,
    padding: "var(--spacing-32)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-8)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, name), featured && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "ember"
  }, "Most picked")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-heading-lg)',
      fontWeight: 'var(--font-weight-medium)',
      letterSpacing: 'var(--tracking-heading-lg)',
      color: 'var(--text-primary)'
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, period)), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body-sm)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, features.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: 'flex',
      gap: 'var(--spacing-8)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    color: featured ? 'var(--color-ember)' : 'var(--text-secondary)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body-sm)',
      color: 'var(--text-primary)'
    }
  }, f)))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? 'primary' : 'secondary',
    fullWidth: true,
    onClick: onSelect,
    style: {
      marginTop: 'auto'
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { PricingTier });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PricingTier.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PromoBanner.jsx
try { (() => {
function PromoBanner({
  badge,
  children,
  ctaLabel = 'Read more',
  href = '#',
  onDismiss,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-12)',
      padding: '10px var(--spacing-24)',
      background: 'var(--color-ember)',
      color: 'var(--action-primary-fg)',
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body-sm)',
      letterSpacing: 'var(--tracking-body-sm)',
      ...style
    }
  }, badge && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      border: '1px solid rgba(26,12,2,0.35)',
      borderRadius: 'var(--radius-tags)',
      padding: '2px 6px'
    }
  }, badge), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: 'inherit',
      fontWeight: 'var(--font-weight-medium)',
      textUnderlineOffset: '3px'
    }
  }, ctaLabel, " \u2192"), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      all: 'unset',
      cursor: 'pointer',
      marginLeft: 'var(--spacing-8)',
      opacity: 0.7,
      fontSize: '14px'
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { PromoBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PromoBanner.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  style
}) {
  const centered = align === 'center';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      alignItems: centered ? 'center' : 'flex-start',
      textAlign: centered ? 'center' : 'left',
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-heading-lg)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--leading-heading-lg)',
      letterSpacing: 'var(--tracking-heading-lg)',
      color: 'var(--text-primary)',
      maxWidth: '18ch',
      textWrap: 'balance'
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-inter)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-body)',
      letterSpacing: 'var(--tracking-body)',
      color: 'var(--text-secondary)',
      maxWidth: '640px',
      textAlign: 'left',
      textWrap: 'pretty'
    }
  }, body));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  Wordmark,
  Icon,
  Badge,
  Button,
  Card,
  Input,
  ThirdsGrid
} = window.ClickForgeDesignSystem_494c16;
const NAV = [['forge', 'Forge', 'flame'], ['history', 'History', 'clock'], ['blueprints', 'Blueprints', 'layout-grid'], ['benchmarks', 'Benchmarks', 'gauge']];
function LoginScreen({
  onEnter
}) {
  return /*#__PURE__*/React.createElement(ThirdsGrid, {
    style: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "var(--spacing-32)",
    style: {
      width: 380,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-heading-sm)',
      fontWeight: 500,
      letterSpacing: 'var(--tracking-heading-sm)'
    }
  }, "Log in to ClickForge"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "Score the click before you record.")), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    placeholder: "you@studio.com",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 14,
      color: "var(--text-disabled)"
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14,
      color: "var(--text-disabled)"
    })
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onEnter,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onEnter();
    },
    style: {
      color: 'var(--text-secondary)',
      textDecoration: 'none'
    }
  }, "Create an account"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-secondary)',
      textDecoration: 'none'
    }
  }, "Forgot password"))));
}
function Sidebar({
  view,
  setView,
  credits
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flex: '0 0 232px',
      borderRight: 'var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-16)',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 18
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, NAV.map(([k, label, icon]) => {
    const on = view === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => setView(k),
      style: {
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'var(--font-inter)',
        letterSpacing: '-0.25px',
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: on ? 'var(--surface-elevated)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16,
      color: on ? 'var(--color-ember)' : 'currentColor'
    }), label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    level: 2,
    padding: "14px",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Forges left"), /*#__PURE__*/React.createElement(Badge, {
    tone: "ember"
  }, "Creator")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-heading)',
      fontWeight: 500,
      letterSpacing: '-0.6px'
    }
  }, credits, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, " / 120")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 4,
      background: 'var(--surface-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${credits / 120 * 100}%`,
      height: '100%',
      background: 'var(--color-ember)',
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 9999,
      background: 'var(--surface-elevated)',
      border: 'var(--border-hairline)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 11,
      fontFamily: 'var(--font-jetbrains-mono)',
      color: 'var(--text-secondary)'
    }
  }, "NP"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "Northpoint Media"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-up-down",
    size: 14,
    color: "var(--text-disabled)",
    style: {
      marginLeft: 'auto'
    }
  }))));
}
function TopBar({
  title,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 60,
      flex: '0 0 60px',
      borderBottom: 'var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-16)',
      padding: '0 var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-heading-sm)',
      fontWeight: 500,
      letterSpacing: 'var(--tracking-heading-sm)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-12)'
    }
  }, actions));
}
Object.assign(window, {
  LoginScreen,
  Sidebar,
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/DataViews.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  CTRScore,
  MeterBar,
  StatBlock,
  Eyebrow,
  Input
} = window.ClickForgeDesignSystem_494c16;
const ROWS = [['Cheap knives vs $300 knives', 'YouTube', 'Mar 14', 9.4, 'Shipped'], ['Why my kitchen rebuild failed', 'YouTube', 'Mar 11', 7.2, 'Shipped'], ['Testing 8 espresso machines', 'Shorts', 'Mar 09', 6.8, 'Draft'], ['The truth about non-stick pans', 'TikTok', 'Mar 07', 4.6, 'Discarded'], ['I cooked with 1800s tools', 'YouTube', 'Mar 02', 8.9, 'Shipped']];
function HistoryView({
  onOpen
}) {
  const [q, setQ] = React.useState('');
  const rows = ROWS.filter(r => r[0].toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      padding: 'var(--spacing-24)',
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(StatBlock, {
    align: "left",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 20
    }),
    value: "47",
    label: "Forges this month"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(StatBlock, {
    align: "left",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "trending-up",
      size: 20
    }),
    value: "+38%",
    label: "Median CTR lift"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(StatBlock, {
    align: "left",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "gauge",
      size: 20
    }),
    value: "7.4%",
    label: "Mean predicted CTR"
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--spacing-24)',
      borderBottom: 'var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Recent forges"), /*#__PURE__*/React.createElement(Input, {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Filter concepts",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 14,
      color: "var(--text-disabled)"
    }),
    style: {
      maxWidth: 260,
      marginLeft: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 100px 84px 110px 104px',
      gap: 'var(--spacing-16)',
      padding: '10px var(--spacing-24)',
      background: 'var(--surface-elevated)',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Concept"), /*#__PURE__*/React.createElement("span", null, "Platform"), /*#__PURE__*/React.createElement("span", null, "Date"), /*#__PURE__*/React.createElement("span", null, "Predicted CTR"), /*#__PURE__*/React.createElement("span", null, "Status")), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r[0],
    onClick: onOpen,
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 100px 84px 110px 104px',
      gap: 'var(--spacing-16)',
      padding: '14px var(--spacing-24)',
      borderTop: 'var(--border-hairline)',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12
    }
  }, r[2]), /*#__PURE__*/React.createElement(CTRScore, {
    score: r[3],
    label: "",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: r[4] === 'Shipped' ? 'ember' : 'neutral'
  }, r[4]))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--spacing-40)',
      textAlign: 'center',
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "No forges match that filter.")));
}
function BlueprintsView({
  onOpen
}) {
  const items = [['Comparison split', 'Two subjects, hard vertical divide on the centre third', 9.1], ['Reaction close-up', 'Face in left third, product in lower-right, 40mm feel', 8.4], ['Object hero', 'Single object on the centre third, 60% negative space', 7.6], ['Before / after', 'Diagonal wipe, cool left, warm right', 6.9]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--spacing-24)',
      padding: 'var(--spacing-24)',
      maxWidth: 1080
    }
  }, items.map(([t, d, s]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    interactive: true,
    onClick: onOpen,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(BlueprintFrame, {
    height: 150
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: '-0.25px'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.57,
      color: 'var(--text-secondary)'
    }
  }, d)), /*#__PURE__*/React.createElement(CTRScore, {
    score: s,
    label: "",
    size: "sm",
    style: {
      marginLeft: 'auto'
    }
  })))));
}
function BenchmarksView() {
  const bars = [['Mar 02', 8.9], ['Mar 05', 5.2], ['Mar 07', 4.6], ['Mar 09', 6.8], ['Mar 11', 7.2], ['Mar 14', 9.4], ['Mar 16', 8.1], ['Mar 18', 6.4]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      padding: 'var(--spacing-24)',
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Predicted vs realised CTR"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, "Last 30 days \xB7 \xB10.8pt MAE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 'var(--spacing-16)',
      height: 180,
      borderBottom: 'var(--border-hairline)',
      paddingBottom: 8
    }
  }, bars.map(([d, v]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 11,
      color: 'var(--text-secondary)'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      gap: 3,
      alignItems: 'flex-end',
      height: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: `${v / 12 * 100}%`,
      background: ctrTone(v),
      borderRadius: '4px 4px 0 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: `${(v - 0.6) / 12 * 100}%`,
      background: 'var(--surface-elevated)',
      borderRadius: '4px 4px 0 0'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 11,
      color: 'var(--text-disabled)'
    }
  }, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-24)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: 'var(--color-ctr-high)'
    }
  }), "Predicted"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: 'var(--surface-elevated)'
    }
  }), "Realised (7-day)"))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Channel medians"), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Your channel",
    value: 62,
    valueLabel: "6.2%"
  }), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Category median (food & cooking)",
    value: 48,
    valueLabel: "4.8%",
    tone: "var(--surface-border-strong)"
  }), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Top decile",
    value: 94,
    valueLabel: "9.4%",
    tone: ctrTone(9.4)
  })));
}
Object.assign(window, {
  HistoryView,
  BlueprintsView,
  BenchmarksView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/DataViews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ForgeView.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  CTRScore,
  MeterBar,
  Textarea,
  SegmentedControl,
  Input,
  Eyebrow
} = window.ClickForgeDesignSystem_494c16;
const ctrTone = s => s >= 8 ? 'var(--color-ctr-high)' : s >= 5 ? 'var(--color-ctr-mid)' : 'var(--color-ctr-low)';
const TITLES = [{
  text: 'I bought the cheapest knife on Amazon. It beat my $300 one.',
  score: 9.4,
  gap: 88,
  hook: 74,
  len: 61
}, {
  text: 'Why expensive kitchen knives are a scam (I tested 41)',
  score: 7.8,
  gap: 71,
  hook: 66,
  len: 53
}, {
  text: 'The $12 knife professional chefs actually use',
  score: 6.1,
  gap: 58,
  hook: 52,
  len: 45
}, {
  text: 'I tested 41 kitchen knives so you do not have to',
  score: 4.3,
  gap: 39,
  hook: 44,
  len: 49
}];
const HOOKS = [{
  text: 'Three hundred dollars. Twelve dollars. Same tomato. Watch.',
  hold: 91
}, {
  text: 'Every chef I asked said the same thing — and it cost me $288 to find out.',
  hold: 77
}, {
  text: 'Do not buy a knife until you have seen this cut.',
  hold: 68
}];
const BLUEPRINT = [['Focal subject', 'Left-third quadrant, chest-up, blade angled toward frame centre at 30°'], ['Secondary', 'Cut tomato in lower-right third, shallow depth of field'], ['Colour grade', 'Contrast +18, background cooled to 5200K, skin tones held warm'], ['Text overlay', 'Two words max — "$12 vs $300" — condensed grotesk, 180px cap-height, bottom-right'], ['Negative space', 'Upper-right third kept clear for the duration badge'], ['Contrast check', 'Subject-to-background luminance delta ≥ 45 for feed legibility']];
function BlueprintFrame({
  height = 200
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      minHeight: height,
      borderRadius: 'var(--radius-md)',
      border: 'var(--border-hairline)',
      background: 'var(--color-pure-black)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--bg-thirds-grid)',
      backgroundSize: '32px 32px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(to right,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%),linear-gradient(to bottom,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '33.333%',
      top: '50%',
      width: 12,
      height: 12,
      margin: '-6px 0 0 -6px',
      borderRadius: 9999,
      background: 'var(--color-ember)',
      boxShadow: 'var(--glow-ember-soft)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '33.333%',
      top: '50%',
      width: 64,
      height: 64,
      margin: '-32px 0 0 -32px',
      borderRadius: 9999,
      border: 'var(--border-accent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '6%',
      top: '6%',
      width: '26%',
      height: '22%',
      border: '1px dashed var(--color-slate-edge)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 10,
      bottom: 8,
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 11,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Focal \xB7 left-third"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      bottom: 8,
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 11,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, "1280 \xD7 720"));
}
function Composer({
  onForge,
  forging
}) {
  const [concept, setConcept] = React.useState('Why cheap kitchen knives outperform expensive ones — I tested 41 of them');
  const [platform, setPlatform] = React.useState('yt');
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "Your raw concept",
    rows: 3,
    maxLength: 600,
    value: concept,
    onChange: e => setConcept(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Channel",
    placeholder: "youtube.com/@northpoint",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "link",
      size: 14,
      color: "var(--text-disabled)"
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Reference video (optional)",
    placeholder: "Paste a URL to match tone",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "clapperboard",
      size: 14,
      color: "var(--text-disabled)"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-12)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    value: platform,
    onChange: setPlatform,
    options: [{
      value: 'yt',
      label: 'YouTube'
    }, {
      value: 'tt',
      label: 'TikTok'
    }, {
      value: 'sh',
      label: 'Shorts'
    }]
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, "1 forge \xB7 ~50s"), /*#__PURE__*/React.createElement(Button, {
    onClick: onForge,
    disabled: forging,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 16
    }),
    style: {
      marginLeft: 'auto'
    }
  }, forging ? 'Forging…' : 'Forge assets')));
}
function ForgeView({
  onForge,
  forging,
  hasResult,
  onOpenBlueprint
}) {
  const [tab, setTab] = React.useState('titles');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      padding: 'var(--spacing-24)',
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement(Composer, {
    onForge: onForge,
    forging: forging
  }), !hasResult && !forging && /*#__PURE__*/React.createElement(Card, {
    level: 0,
    padding: "var(--spacing-40)",
    style: {
      borderStyle: 'dashed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 20,
    color: "var(--text-disabled)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "Nothing forged yet. Paste a concept and run the engine.")), (hasResult || forging) && /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: forging ? 0.4 : 1,
      transition: 'opacity var(--duration-base) var(--ease-standard)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderBottom: 'var(--border-hairline)'
    }
  }, [['titles', 'Titles'], ['hooks', 'Hooks'], ['blueprint', 'Blueprint']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    onClick: () => setTab(k),
    style: {
      all: 'unset',
      cursor: 'pointer',
      padding: '10px 14px',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'var(--font-inter)',
      color: tab === k ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderBottom: `2px solid ${tab === k ? 'var(--color-ember)' : 'transparent'}`,
      marginBottom: -1
    }
  }, l)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, forging ? 'Running model…' : 'Forged in 52s · knives-v1')), tab === 'titles' && TITLES.map((t, i) => /*#__PURE__*/React.createElement(Card, {
    key: t.text,
    accent: i === 0,
    interactive: true,
    padding: "16px",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 170px auto',
      gap: 'var(--spacing-24)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, i === 0 && /*#__PURE__*/React.createElement(Badge, {
    tone: "ember"
  }, "Recommended"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      color: 'var(--text-disabled)'
    }
  }, t.len, " chars")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: '-0.25px'
    }
  }, t.text)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(MeterBar, {
    label: "Curiosity gap",
    value: t.gap,
    valueLabel: String(t.gap),
    tone: ctrTone(t.score)
  }), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Hook strength",
    value: t.hook,
    valueLabel: String(t.hook),
    tone: ctrTone(t.score)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(CTRScore, {
    score: t.score,
    label: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: i === 0 ? 'primary' : 'secondary',
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 14
    })
  }, "Copy"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      size: 14
    })
  }, "Rework"))))), tab === 'hooks' && HOOKS.map((h, i) => /*#__PURE__*/React.createElement(Card, {
    key: h.text,
    interactive: true,
    padding: "16px",
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0,1fr) 150px auto',
      gap: 'var(--spacing-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: i === 0 ? 'ember' : 'neutral'
  }, "0\u20133s"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '-0.25px'
    }
  }, h.text), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Predicted hold",
    value: h.hold,
    valueLabel: `${h.hold}%`
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 14
    })
  }, "Copy"))), tab === 'blueprint' && /*#__PURE__*/React.createElement(Card, {
    padding: "var(--spacing-24)",
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(220px,320px) minmax(0,1fr)',
      gap: 'var(--spacing-32)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement(BlueprintFrame, null), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onOpenBlueprint,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Open blueprint")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Compositional directives"), BLUEPRINT.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gridTemplateColumns: '132px minmax(0,1fr)',
      gap: 'var(--spacing-16)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.57
    }
  }, v)))))));
}
Object.assign(window, {
  ForgeView,
  BlueprintFrame,
  TITLES,
  ctrTone
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ForgeView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Chrome.jsx
try { (() => {
const {
  NavPill,
  Button,
  Wordmark,
  Badge,
  PromoBanner,
  Icon
} = window.ClickForgeDesignSystem_494c16;
function SiteNav() {
  const [promo, setPromo] = React.useState(true);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(11,10,9,0.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: 'var(--border-hairline)'
    }
  }, promo && /*#__PURE__*/React.createElement(PromoBanner, {
    badge: "New",
    ctaLabel: "See the model card",
    onDismiss: () => setPromo(false)
  }, "Retention Hooks v3 is live \u2014 22% better first-3-second hold."), /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 'var(--page-max-width)',
      margin: '0 auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      marginLeft: 8
    }
  }, /*#__PURE__*/React.createElement(NavPill, {
    href: "#engine"
  }, "Product"), /*#__PURE__*/React.createElement(NavPill, {
    href: "#how"
  }, "How it works"), /*#__PURE__*/React.createElement(NavPill, {
    href: "#proof"
  }, "Results"), /*#__PURE__*/React.createElement(NavPill, {
    href: "#pricing"
  }, "Pricing")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement(NavPill, {
    href: "#"
  }, "Log in"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Start forging"))));
}
function SiteFooter() {
  const cols = [{
    label: 'Product',
    links: ['Title engine', 'Retention hooks', 'Thumbnail blueprints', 'CTR prediction', 'Changelog']
  }, {
    label: 'Platforms',
    links: ['YouTube', 'YouTube Shorts', 'TikTok', 'Instagram Reels']
  }, {
    label: 'Resources',
    links: ['Blueprint library', 'CTR benchmarks', 'Model cards', 'API docs', 'Status']
  }, {
    label: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: 'var(--border-hairline)',
      padding: '64px 24px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max-width)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(4, 1fr)',
      gap: 'var(--spacing-40)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 19
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.57,
      color: 'var(--text-secondary)',
      maxWidth: 260
    }
  }, "Score the click before you record."), /*#__PURE__*/React.createElement(Badge, null, "SOC 2 Type II")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, c.label), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      textDecoration: 'none'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max-width)',
      margin: '48px auto 0',
      paddingTop: 24,
      borderTop: 'var(--border-hairline)',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 ClickForge"), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms")));
}
Object.assign(window, {
  SiteNav,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ForgePanel.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Icon,
  CTRScore,
  MeterBar,
  Textarea,
  SegmentedControl
} = window.ClickForgeDesignSystem_494c16;
const ctrTone = s => s >= 8 ? 'var(--color-ctr-high)' : s >= 5 ? 'var(--color-ctr-mid)' : 'var(--color-ctr-low)';
const RESULTS = {
  titles: [{
    text: 'I bought the cheapest knife on Amazon. It beat my $300 one.',
    score: 9.4,
    gap: 88,
    hook: 74
  }, {
    text: 'Why expensive kitchen knives are a scam (tested 41 of them)',
    score: 7.8,
    gap: 71,
    hook: 66
  }, {
    text: 'The $12 knife professional chefs actually use',
    score: 6.1,
    gap: 58,
    hook: 52
  }],
  hooks: ['Three hundred dollars. Twelve dollars. Same tomato. Watch.', 'Every chef I asked said the same thing — and it cost me $288 to find out.', 'Do not buy a knife until you have seen this cut.'],
  blueprint: [['Focal subject', 'Left-third quadrant, chest-up, blade angled toward frame centre'], ['Colour grade', 'Push contrast +18; cool the background to 5200K, keep skin warm'], ['Text overlay', 'Two words max, condensed grotesk, 180px cap-height, bottom-right'], ['Negative space', 'Keep upper-right third clear for the duration badge']]
};
function ForgePanel({
  compact = false
}) {
  const [concept, setConcept] = React.useState('Why cheap kitchen knives outperform expensive ones — I tested 41 of them');
  const [platform, setPlatform] = React.useState('yt');
  const [tab, setTab] = React.useState('titles');
  const [state, setState] = React.useState('done');
  const forge = () => {
    setState('forging');
    setTimeout(() => setState('done'), 1100);
  };
  return /*#__PURE__*/React.createElement(Card, {
    level: 1,
    padding: "0",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--spacing-24)',
      borderBottom: 'var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "Your raw concept",
    rows: compact ? 2 : 3,
    maxLength: 600,
    value: concept,
    onChange: e => setConcept(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-12)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    value: platform,
    onChange: setPlatform,
    options: [{
      value: 'yt',
      label: 'YouTube'
    }, {
      value: 'tt',
      label: 'TikTok'
    }, {
      value: 'sh',
      label: 'Shorts'
    }]
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: forge,
    disabled: state === 'forging',
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 16
    }),
    style: {
      marginLeft: 'auto'
    }
  }, state === 'forging' ? 'Forging…' : 'Forge assets'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: '10px var(--spacing-24) 0'
    }
  }, [['titles', 'Titles'], ['hooks', 'Hooks'], ['blueprint', 'Blueprint']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    onClick: () => setTab(k),
    style: {
      all: 'unset',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'var(--font-inter)',
      color: tab === k ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderBottom: `2px solid ${tab === k ? 'var(--color-ember)' : 'transparent'}`
    }
  }, l)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      alignSelf: 'center',
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, state === 'forging' ? 'Running model…' : 'Forged in 52s')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--spacing-24)',
      opacity: state === 'forging' ? 0.4 : 1,
      transition: 'opacity var(--duration-base) var(--ease-standard)',
      minHeight: compact ? 236 : 268
    }
  }, tab === 'titles' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, RESULTS.titles.map((t, i) => /*#__PURE__*/React.createElement(Card, {
    key: t.text,
    level: 2,
    interactive: true,
    padding: "14px 16px",
    accent: i === 0,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--spacing-16)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: '-0.25px',
      color: 'var(--text-primary)'
    }
  }, t.text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-24)',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(MeterBar, {
    label: "Gap",
    value: t.gap,
    valueLabel: String(t.gap),
    tone: ctrTone(t.score)
  }), /*#__PURE__*/React.createElement(MeterBar, {
    label: "Hook",
    value: t.hook,
    valueLabel: String(t.hook),
    tone: ctrTone(t.score)
  }))), /*#__PURE__*/React.createElement(CTRScore, {
    score: t.score,
    label: "",
    size: "sm"
  })))), tab === 'hooks' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, RESULTS.hooks.map((h, i) => /*#__PURE__*/React.createElement(Card, {
    key: h,
    level: 2,
    interactive: true,
    padding: "14px 16px",
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: i === 0 ? 'ember' : 'neutral'
  }, "0\u20133s"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.5,
      letterSpacing: '-0.25px'
    }
  }, h)))), tab === 'blueprint' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '190px 1fr',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/9',
      borderRadius: 'var(--radius-md)',
      border: 'var(--border-hairline)',
      background: 'var(--color-pure-black)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--bg-thirds-grid)',
      backgroundSize: '24px 24px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(to right,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%),linear-gradient(to bottom,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '33.333%',
      top: '50%',
      width: 10,
      height: 10,
      margin: '-5px 0 0 -5px',
      borderRadius: 9999,
      background: 'var(--color-ember)',
      boxShadow: 'var(--glow-ember-soft)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 8,
      bottom: 6,
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 10,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, "Focal \xB7 L-third")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)'
    }
  }, RESULTS.blueprint.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gridTemplateColumns: '128px 1fr',
      gap: 'var(--spacing-16)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.57,
      color: 'var(--text-primary)'
    }
  }, v)))))));
}
Object.assign(window, {
  ForgePanel,
  RESULTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ForgePanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Icon,
  Badge,
  ThirdsGrid,
  LogoStrip,
  SectionHeading,
  Card,
  FeatureRow,
  StatBlock,
  PricingTier,
  Eyebrow,
  SegmentedControl,
  Wordmark
} = window.ClickForgeDesignSystem_494c16;
const shell = {
  maxWidth: 'var(--page-max-width)',
  margin: '0 auto',
  padding: '0 24px'
};
function Hero() {
  return /*#__PURE__*/React.createElement(ThirdsGrid, {
    style: {
      padding: '96px 0 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'grid',
      gridTemplateColumns: '1fr 1.05fr',
      gap: 'var(--spacing-64)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ember"
  }, "CTR prediction \xB7 v3"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-display)',
      lineHeight: 'var(--leading-display)',
      letterSpacing: 'var(--tracking-display)',
      fontWeight: 500,
      textWrap: 'balance'
    }
  }, "Score the click before you record."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-secondary)',
      maxWidth: 480,
      textWrap: 'pretty'
    }
  }, "Drop in a raw concept. ClickForge returns three optimised title options, a first-three-second retention hook, and an exact thumbnail blueprint \u2014 each with a predicted CTR."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Forge your first video"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "See a sample report")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      textTransform: 'uppercase',
      color: 'var(--text-disabled)'
    }
  }, "No card \xB7 5 free forges")), /*#__PURE__*/React.createElement(ForgePanel, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      marginTop: 'var(--spacing-64)'
    }
  }, /*#__PURE__*/React.createElement(LogoStrip, {
    label: "Forging titles for studios shipping 400+ videos a month:",
    names: ['Nightshift', 'Northpoint', 'Studio Kilo', 'Halcyon', 'Rundown', 'Overcast']
  })));
}
function HowItWorks() {
  const steps = [['Paste the concept', 'pencil-line', 'A one-line angle, a script draft, or a rough idea. No formatting rules.'], ['The engine runs', 'cpu', 'Titles, hooks and blueprints are generated and scored against your channel history.'], ['Ship the winner', 'send', 'Take the highest-CTR asset set straight into your edit. Under sixty seconds, start to finish.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    style: {
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-40)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "How it works",
    title: "Three assets. Sixty seconds.",
    body: "ClickForge is an administrative safety net: it validates the idea and the design before you spend a day editing something the feed will ignore."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-24)',
      width: '100%'
    }
  }, steps.map(([t, icon, body], i) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20,
    color: "var(--color-ember)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-jetbrains-mono)',
      fontSize: 12,
      letterSpacing: '0.85px',
      color: 'var(--text-disabled)'
    }
  }, "0", i + 1)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-heading-sm)',
      fontWeight: 500,
      letterSpacing: 'var(--tracking-heading-sm)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.57,
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, body))))));
}
function Engine() {
  return /*#__PURE__*/React.createElement("section", {
    id: "engine",
    style: {
      padding: '80px 0',
      borderTop: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 'var(--spacing-64)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-32)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    eyebrow: "The engine",
    title: "Every asset a click depends on",
    body: "One model call, three outputs \u2014 each one scored, each one editable before it reaches your edit."
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-24)'
    }
  }, /*#__PURE__*/React.createElement(FeatureRow, {
    icon: "type",
    title: "High-converting titles",
    meta: /*#__PURE__*/React.createElement(Badge, null, "Beta")
  }, "Curiosity-gap constructions and trigger-focused phrasings, ranked against your last 200 uploads."), /*#__PURE__*/React.createElement(FeatureRow, {
    icon: "zap",
    title: "Viral retention hooks"
  }, "Snappy script intros written for the first three seconds on TikTok, Reels and Shorts."), /*#__PURE__*/React.createElement(FeatureRow, {
    icon: "layout-grid",
    title: "Thumbnail blueprints"
  }, "Exact compositional directives \u2014 subject quadrant, colour grade, overlay styling, negative space."))), /*#__PURE__*/React.createElement(ForgePanel, {
    compact: true
  })));
}
function Proof() {
  return /*#__PURE__*/React.createElement("section", {
    id: "proof",
    style: {
      padding: '80px 0',
      borderTop: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-40)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Measured, not promised"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-32)',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "trending-up",
      size: 24
    }),
    value: "+38%",
    label: "Median CTR lift",
    caption: "Across 12,400 forged titles in a channel's first 90 days on ClickForge."
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "timer",
      size: 24
    }),
    value: "52s",
    label: "Median time to forge",
    caption: "From pasted concept to a scored, ready-to-ship asset set."
  }), /*#__PURE__*/React.createElement(StatBlock, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "gauge",
      size: 24
    }),
    value: "\xB10.8pt",
    label: "Prediction error",
    caption: "Mean absolute error of predicted CTR against realised 7-day CTR."
  }))));
}
function Pricing() {
  const [cycle, setCycle] = React.useState('mo');
  const annual = cycle === 'yr';
  const tiers = [{
    name: 'Starter',
    price: annual ? '$0' : '$0',
    period: '',
    blurb: 'Test the engine on a real upload.',
    features: ['5 forges / mo', 'Title options', 'Predicted CTR'],
    cta: 'Start free'
  }, {
    name: 'Creator',
    price: annual ? '$23' : '$29',
    period: '/mo',
    blurb: 'For a channel shipping weekly.',
    features: ['120 forges / mo', 'Retention hooks', 'Thumbnail blueprints', 'Channel benchmarking'],
    featured: true,
    cta: 'Start forging'
  }, {
    name: 'Studio',
    price: annual ? '$79' : '$99',
    period: '/mo',
    blurb: 'For teams running several channels.',
    features: ['Unlimited forges', '5 seats', 'API access', 'Shared blueprint library', 'Priority model queue'],
    cta: 'Talk to sales'
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "pricing",
    style: {
      padding: '80px 0',
      borderTop: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-32)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Pricing",
    title: "Priced against one wasted edit"
  }), /*#__PURE__*/React.createElement(SegmentedControl, {
    value: cycle,
    onChange: setCycle,
    options: [{
      value: 'mo',
      label: 'Monthly'
    }, {
      value: 'yr',
      label: 'Annual · −20%'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-24)',
      width: '100%',
      alignItems: 'stretch'
    }
  }, tiers.map(t => /*#__PURE__*/React.createElement(PricingTier, _extends({
    key: t.name
  }, t, {
    ctaLabel: t.cta
  }))))));
}
function ClosingCTA() {
  return /*#__PURE__*/React.createElement(ThirdsGrid, {
    style: {
      padding: '96px 0',
      borderTop: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-24)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 22
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-display-sm)',
      lineHeight: 'var(--leading-display-sm)',
      letterSpacing: 'var(--tracking-display-sm)',
      fontWeight: 500,
      maxWidth: '16ch',
      textWrap: 'balance'
    }
  }, "Stop guessing at the thumbnail."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-12)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Forge your first video"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "Book a walkthrough"))));
}
Object.assign(window, {
  Hero,
  HowItWorks,
  Engine,
  Proof,
  Pricing,
  ClosingCTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ThirdsGrid = __ds_scope.ThirdsGrid;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.NavPill = __ds_scope.NavPill;

__ds_ns.CTRScore = __ds_scope.CTRScore;

__ds_ns.MeterBar = __ds_scope.MeterBar;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.FeatureRow = __ds_scope.FeatureRow;

__ds_ns.LogoStrip = __ds_scope.LogoStrip;

__ds_ns.PricingTier = __ds_scope.PricingTier;

__ds_ns.PromoBanner = __ds_scope.PromoBanner;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
