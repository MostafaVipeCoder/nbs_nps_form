import { useState } from 'react'
import logoSrc from '../assets/logo.png'

// ============ DATA ============
const SECTIONS = {
    internet: {
        label: 'جودة الإنترنت',
        icon: '📡',
        color: '#ddeef9',
        items: ['سرعة الإنترنت', 'استقرار الاتصال', 'توفر بديل عند الانقطاع'],
    },
    chairs: {
        label: 'الكراسي والطاولات',
        icon: '🪑',
        color: '#fdecd8',
        items: ['راحة الكراسي', 'ملاءمة الطاولات للعمل الطويل', 'توزيع أماكن الجلوس'],
    },
    vibe: {
        label: 'أجواء المكان',
        icon: '🌿',
        color: '#d0faea',
        items: ['الهدوء', 'الإضاءة', 'التهوية', 'مستوى الإزعاج'],
    },
    staff: {
        label: 'موظف خدمة العملاء',
        icon: '👨‍💼',
        color: '#ede9fe',
        items: ['سرعة الاستجابة', 'الاحترافية', 'حل المشكلات', 'التعامل واللباقة'],
    },
    catering: {
        label: 'الكاترينج والسناكس',
        icon: '☕',
        color: '#fdecd8',
        items: ['تنوع المشروبات', 'تنوع الوجبات الخفيفة', 'جودة المنتجات', 'مناسبة السعر مقابل الجودة', 'وضوح التسعير'],
    },
    clean: {
        label: 'نظافة المكان',
        icon: '✨',
        color: '#d0faea',
        items: ['نظافة المكاتب', 'نظافة دورات المياه', 'نظافة مناطق الكاترينج', 'النظافة العامة'],
    },
}

// ============ STAR RATING ============
function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(0)
    return (
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {[1, 2, 3, 4, 5].map(i => {
                const active = i <= (hover || value)
                return (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(i)}
                        style={{
                            width: '36px',
                            height: '36px',
                            border: `2px solid ${active ? 'var(--brand-orange)' : 'var(--border)'}`,
                            borderRadius: '10px',
                            background: active ? 'var(--brand-orange)' : 'var(--cloud)',
                            color: active ? '#fff' : 'var(--ink-muted)',
                            fontSize: '14px',
                            fontWeight: '700',
                            fontFamily: 'var(--font-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            transform: active ? 'scale(1.08)' : 'scale(1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {i}
                    </button>
                )
            })}
        </div>
    )
}

// ============ NPS BUTTON ============
function NPSButton({ value, selected, onClick }) {
    let cls = 'none'
    if (selected !== null) {
        if (value === selected) {
            cls = selected <= 6 ? 'detractor' : selected <= 8 ? 'passive' : 'promoter'
        }
    }
    const colors = {
        detractor: { border: 'var(--brand-red)', bg: 'var(--brand-red-light)', color: 'var(--brand-red)' },
        passive: { border: 'var(--brand-orange)', bg: 'var(--brand-orange-light)', color: 'var(--brand-orange)' },
        promoter: { border: 'var(--brand-green)', bg: 'var(--brand-green-light)', color: 'var(--brand-green-dark)' },
        none: { border: 'var(--border)', bg: 'var(--cloud)', color: 'var(--ink)' },
    }
    const c = colors[cls]
    return (
        <button
            type="button"
            onClick={() => onClick(value)}
            style={{
                width: '52px',
                height: '52px',
                border: `2px solid ${c.border}`,
                borderRadius: '12px',
                background: c.bg,
                color: c.color,
                fontSize: '17px',
                fontWeight: '700',
                fontFamily: 'var(--font-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: cls !== 'none' ? 'scale(1.1)' : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {value}
        </button>
    )
}

// ============ SECTION CARD ============
function SectionCard({ icon, label, color, children }) {
    return (
        <div style={{
            background: '#fff',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border-light)',
            marginBottom: '20px',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s',
        }}>
            <div style={{
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderBottom: '1px solid var(--border-light)',
            }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '16px', color: 'var(--ink)', fontFamily: 'var(--font-primary)' }}>{label}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)', marginTop: '2px' }}>
                        قيّم من 1 (سيء جداً) إلى 5 (ممتاز)
                    </p>
                </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
                {children}
            </div>
        </div>
    )
}

// ============ MAIN FORM ============
export default function SurveyForm() {
    const [nps, setNps] = useState(null)
    const [ratings, setRatings] = useState({})
    const [valuePriceRating, setValuePriceRating] = useState(0)
    const [openQ, setOpenQ] = useState({ liked_most: '', needs_improvement: '', if_manager: '' })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    function setRating(section, idx, val) {
        setRatings(prev => ({ ...prev, [`${section}_${idx}`]: val }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (nps === null) {
            alert('من فضلك اختر تقييم NPS أولاً')
            return
        }
        setSubmitting(true)

        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydw6UHvUdwI3BbglgTlxDrcZsUllBD_iCuOT6H-ej4TlPeRGUfFv-s1Nxf8-nDWrxa/exec'

        const data = {
            nps,
            ...ratings,
            value_price: valuePriceRating,
            ...openQ,
            timestamp: new Date().toISOString(),
            month: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
        }

        try {
            // 1. Save to localStorage for dashboard
            const existing = JSON.parse(localStorage.getItem('survey_responses') || '[]')
            existing.push(data)
            localStorage.setItem('survey_responses', JSON.stringify(existing))

            // 2. Send to Google Sheets
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            setSubmitting(false)
            setSubmitted(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            console.error('Submission error:', error)
            setSubmitting(false)
            alert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.')
        }
    }

    if (submitted) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0faf6 0%, #e8f4fd 100%)',
                padding: '20px',
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-lg)',
                    maxWidth: '480px',
                    width: '100%',
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ fontSize: '28px', color: 'var(--brand-green-dark)', marginBottom: '12px', fontFamily: 'var(--font-primary)' }}>
                        شكراً جزيلاً!
                    </h2>
                    <p style={{ fontSize: '15px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)', lineHeight: '1.8' }}>
                        تم إرسال تقييمك بنجاح.<br />
                        رأيك يساعدنا على تقديم تجربة أفضل كل يوم.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0faf6 0%, #e8f4fd 40%, #fff5f7 100%)',
            padding: '20px',
            position: 'relative',
        }}>
            {/* BG blobs */}
            <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,215,136,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,117,185,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* HEADER */}
                <div style={{
                    textAlign: 'center',
                    padding: '48px 32px 40px',
                    background: '#fff',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    marginBottom: '24px',
                    border: '1px solid rgba(30,215,136,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Top accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, var(--brand-green), var(--brand-blue), var(--brand-orange))' }} />

                    {/* Logo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <img src={logoSrc} alt="Cloud Coworking" style={{ height: '70px', objectFit: 'contain' }} />
                    </div>

                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--ink)', marginBottom: '10px', fontFamily: 'var(--font-primary)' }}>
                        شاركنا تجربتك
                    </h2>
                    <p style={{ color: 'var(--ink-muted)', fontSize: '15px', fontFamily: 'var(--font-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
                        رأيك يبني تجربة أفضل لك ولزملائك. يستغرق هذا الاستبيان أقل من 3 دقائق.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap' }}>
                        {[
                            { text: '🔒 سري وآمن', bg: 'var(--brand-blue-light)', color: 'var(--brand-blue-dark)' },
                        ].map(b => (
                            <span key={b.text} style={{ background: b.bg, color: b.color, padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', fontFamily: 'var(--font-primary)' }}>
                                {b.text}
                            </span>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* NPS SECTION */}
                    <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)', marginBottom: '20px', overflow: 'hidden' }}>

                        <div style={{ padding: '24px 28px' }}>
                            <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', marginBottom: '8px', fontFamily: 'var(--font-primary)', lineHeight: '1.6' }}>
                                ما مدى احتمالية أن توصي بمساحة Cloud Coworking لصديق أو زميل؟
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '24px', fontFamily: 'var(--font-secondary)' }}>
                                0 = لن أوصي إطلاقاً &nbsp;|&nbsp; 10 = أوصي بشدة
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
                                {Array.from({ length: 11 }, (_, i) => (
                                    <NPSButton key={i} value={i} selected={nps} onClick={setNps} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-muted)', padding: '0 4px', fontFamily: 'var(--font-secondary)' }}>
                                <span style={{ color: 'var(--brand-red)' }}>😞 لن أوصي أبداً</span>
                                <span style={{ color: 'var(--brand-green-dark)' }}>😍 أوصي بشدة</span>
                            </div>
                        </div>
                    </div>

                    {/* RATING SECTIONS */}
                    {Object.entries(SECTIONS).map(([key, sec]) => (
                        <SectionCard key={key} icon={sec.icon} label={sec.label} color={sec.color}>
                            {sec.items.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 0',
                                    borderBottom: idx < sec.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    gap: '12px',
                                    flexWrap: 'wrap',
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink-soft)', flex: 1, minWidth: '140px', fontFamily: 'var(--font-secondary)' }}>
                                        {item}
                                    </span>
                                    <StarRating
                                        value={ratings[`${key}_${idx}`] || 0}
                                        onChange={val => setRating(key, idx, val)}
                                    />
                                </div>
                            ))}
                        </SectionCard>
                    ))}

                    {/* VALUE PRICE */}
                    <SectionCard icon="💎" label="القيمة مقابل السعر" color="var(--brand-red-light)">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink-soft)', flex: 1, fontFamily: 'var(--font-secondary)' }}>
                                هل ترى أن السعر مناسب مقابل القيمة المقدمة؟
                            </span>
                            <StarRating value={valuePriceRating} onChange={setValuePriceRating} />
                        </div>
                    </SectionCard>

                    {/* OPEN QUESTIONS */}
                    <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)', marginBottom: '20px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-light)' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💬</div>
                            <div>
                                <h3 style={{ fontSize: '16px', color: 'var(--ink)', fontFamily: 'var(--font-primary)' }}>أسئلة مفتوحة</h3>
                                <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)', marginTop: '2px' }}>رأيك يفرق كثيراً</p>
                            </div>
                        </div>
                        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { key: 'liked_most', label: '✅ ما أكثر شيء أعجبك في المكان؟', hint: 'شاركنا ما يميز تجربتك معنا' },
                                { key: 'needs_improvement', label: '🔧 ما أكثر شيء يحتاج إلى تحسين؟', hint: 'صراحتك تساعدنا نتحسن' },
                                { key: 'if_manager', label: '👔 لو كنت المدير، ما أول قرار ستتخذه لتحسين التجربة؟', hint: 'فكّر معنا كمدير استراتيجي' },
                            ].map(q => (
                                <div key={q.key}>
                                    <label style={{ display: 'block', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink-soft)', fontFamily: 'var(--font-primary)' }}>{q.label}</span>
                                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)', marginTop: '3px' }}>{q.hint}</span>
                                    </label>
                                    <textarea
                                        value={openQ[q.key]}
                                        onChange={e => setOpenQ(prev => ({ ...prev, [q.key]: e.target.value }))}
                                        placeholder="اكتب هنا..."
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '2px solid var(--border)',
                                            borderRadius: '12px',
                                            fontFamily: 'var(--font-secondary)',
                                            fontSize: '14px',
                                            color: 'var(--ink)',
                                            resize: 'vertical',
                                            minHeight: '90px',
                                            background: 'var(--cloud)',
                                            lineHeight: '1.7',
                                            direction: 'rtl',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = 'var(--brand-blue)'; e.target.style.background = '#fff' }}
                                        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cloud)' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div style={{ textAlign: 'center', padding: '32px 0 20px' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                background: 'linear-gradient(135deg, var(--brand-green), var(--brand-green-dark))',
                                color: '#fff',
                                border: 'none',
                                padding: '18px 56px',
                                borderRadius: '14px',
                                fontFamily: 'var(--font-primary)',
                                fontSize: '17px',
                                fontWeight: '700',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                boxShadow: '0 6px 24px rgba(30,215,136,0.4)',
                                transition: 'all 0.2s',
                                opacity: submitting ? 0.7 : 1,
                                letterSpacing: '0.5px',
                            }}
                        >
                            {submitting ? 'جاري الإرسال...' : 'إرسال التقييم ✈️'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
