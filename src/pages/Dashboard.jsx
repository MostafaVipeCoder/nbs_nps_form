import { useState, useEffect, useRef } from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Filler,
} from 'chart.js'
import { Doughnut, Radar, Line, Bar } from 'react-chartjs-2'
import logoSrc from '../assets/logo.png'

ChartJS.register(
    ArcElement, Tooltip, Legend,
    RadialLinearScale, PointElement, LineElement,
    BarElement, CategoryScale, LinearScale, Filler
)

// ============ CONSTANTS ============
const SECTIONS = [
    { key: 'internet', label: 'الإنترنت', emoji: '📡', keys: ['internet_0', 'internet_1', 'internet_2'] },
    { key: 'chairs', label: 'الكراسي', emoji: '🪑', keys: ['chairs_0', 'chairs_1', 'chairs_2'] },
    { key: 'vibe', label: 'الأجواء', emoji: '🌿', keys: ['vibe_0', 'vibe_1', 'vibe_2', 'vibe_3'] },
    { key: 'staff', label: 'خدمة العملاء', emoji: '👨‍💼', keys: ['staff_0', 'staff_1', 'staff_2', 'staff_3'] },
    { key: 'catering', label: 'الكاترينج', emoji: '☕', keys: ['catering_0', 'catering_1', 'catering_2', 'catering_3', 'catering_4'] },
    { key: 'clean', label: 'النظافة', emoji: '✨', keys: ['clean_0', 'clean_1', 'clean_2', 'clean_3'] },
]

const BRAND = {
    green: '#1ed788',
    orange: '#f78c2a',
    red: '#f83854',
    blue: '#1e75b9',
    dark: '#303030',
}

const SECTION_COLORS = ['#1e75b9', '#f78c2a', '#1ed788', '#9b59b6', '#f83854', '#00bcd4']

// ============ ANALYTICS ============
function calcNPS(data) {
    const valid = data.filter(d => d.nps != null)
    if (!valid.length) return null
    const promoters = valid.filter(d => d.nps >= 9).length
    const detractors = valid.filter(d => d.nps <= 6).length
    const passives = valid.length - promoters - detractors
    return {
        score: Math.round((promoters / valid.length - detractors / valid.length) * 100),
        promotersPct: Math.round(promoters / valid.length * 100),
        passivesPct: Math.round(passives / valid.length * 100),
        detractorsPct: Math.round(detractors / valid.length * 100),
        promoters, passives, detractors, total: valid.length,
    }
}

function calcSectionAvg(data, keys) {
    let sum = 0, count = 0
    data.forEach(d => keys.forEach(k => {
        const v = parseFloat(d[k])
        if (v > 0) { sum += v; count++ }
    }))
    return count ? sum / count : 0
}

function getStatus(score) {
    if (score >= 4.5) return { label: 'ممتاز تنافسي', color: BRAND.green, bg: '#d0faea' }
    if (score >= 4.0) return { label: 'قوي', color: BRAND.blue, bg: '#ddeef9' }
    if (score >= 3.0) return { label: 'يحتاج تحسين', color: BRAND.orange, bg: '#fdecd8' }
    return { label: 'خطر تشغيلي', color: BRAND.red, bg: '#fde0e5' }
}

function calcNBSScores(data) {
    return SECTIONS.map(s => ({ ...s, avg: parseFloat(calcSectionAvg(data, s.keys).toFixed(2)) }))
}

function calcMonthlyData(data) {
    const byMonth = {}
    data.forEach(d => {
        const m = d.month || new Date(d.timestamp).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
        if (!byMonth[m]) byMonth[m] = []
        byMonth[m].push(d)
    })
    return Object.entries(byMonth).map(([month, records]) => {
        const npsData = calcNPS(records)
        const nbsScores = calcNBSScores(records)
        const nbsAvg = nbsScores.reduce((a, b) => a + b.avg, 0) / nbsScores.length
        return { month, nps: npsData ? npsData.score : null, nbs: parseFloat(nbsAvg.toFixed(2)), count: records.length }
    })
}

// ============ DEMO DATA ============
const DEMO_DATA = Array.from({ length: 24 }, (_, i) => ({
    nps: Math.floor(Math.random() * 11),
    internet_0: Math.floor(Math.random() * 4) + 2, internet_1: Math.floor(Math.random() * 4) + 2, internet_2: Math.floor(Math.random() * 4) + 2,
    chairs_0: Math.floor(Math.random() * 4) + 2, chairs_1: Math.floor(Math.random() * 4) + 2, chairs_2: Math.floor(Math.random() * 4) + 2,
    vibe_0: Math.floor(Math.random() * 4) + 2, vibe_1: Math.floor(Math.random() * 4) + 2, vibe_2: Math.floor(Math.random() * 4) + 2, vibe_3: Math.floor(Math.random() * 4) + 2,
    staff_0: Math.floor(Math.random() * 4) + 2, staff_1: Math.floor(Math.random() * 4) + 2, staff_2: Math.floor(Math.random() * 4) + 2, staff_3: Math.floor(Math.random() * 4) + 2,
    catering_0: Math.floor(Math.random() * 4) + 2, catering_1: Math.floor(Math.random() * 4) + 2, catering_2: Math.floor(Math.random() * 4) + 2, catering_3: Math.floor(Math.random() * 4) + 2, catering_4: Math.floor(Math.random() * 4) + 2,
    clean_0: Math.floor(Math.random() * 4) + 2, clean_1: Math.floor(Math.random() * 4) + 2, clean_2: Math.floor(Math.random() * 4) + 2, clean_3: Math.floor(Math.random() * 4) + 2,
    value_price: Math.floor(Math.random() * 4) + 2,
    liked_most: ['الهدوء والأجواء الرائعة', 'سرعة الإنترنت ممتازة', 'الموظفون محترفون جداً'][i % 3],
    needs_improvement: ['الكاترينج يحتاج تنوع أكثر', 'الكراسي تحتاج تحديث', 'التكييف أحياناً قوي'][i % 3],
    if_manager: ['سأحسّن الكاترينج', 'سأضيف مناطق هادئة أكثر', 'سأطور خدمة العملاء'][i % 3],
    timestamp: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toISOString(),
    month: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }),
}))

// ============ COMPONENTS ============
function KPICard({ label, value, sub, color, dark, children }) {
    return (
        <div style={{
            background: dark ? 'linear-gradient(135deg, #1a2a3a, #1e3a5f)' : '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
            border: dark ? 'none' : '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? '#94a3b8' : 'var(--ink-muted)', marginBottom: '8px', fontFamily: 'var(--font-primary)' }}>
                {label}
            </div>
            <div style={{ fontSize: '48px', fontWeight: '900', lineHeight: 1, color: dark ? '#fff' : 'var(--ink)', fontFamily: 'var(--font-primary)' }}>
                {value}
            </div>
            {sub && <div style={{ fontSize: '12px', color: dark ? '#94a3b8' : 'var(--ink-muted)', marginTop: '8px', fontFamily: 'var(--font-secondary)' }}>{sub}</div>}
            {children}
        </div>
    )
}

function ChartCard({ title, sub, children, style }) {
    return (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 16px rgba(15,23,42,0.06)', border: '1px solid var(--border)', ...style }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px', fontFamily: 'var(--font-primary)' }}>{title}</h3>
            {sub && <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px', fontFamily: 'var(--font-secondary)' }}>{sub}</p>}
            {children}
        </div>
    )
}

// ============ MAIN DASHBOARD ============
export default function Dashboard() {
    const [allData, setAllData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [months, setMonths] = useState([])
    const [selectedMonth, setSelectedMonth] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [jsonInput, setJsonInput] = useState('')
    const [activeNav, setActiveNav] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('survey_responses') || '[]')
        loadData(stored)
    }, [])

    function loadData(data) {
        setAllData(data)
        setFilteredData(data)
        const uniqueMonths = [...new Set(data.map(d => d.month).filter(Boolean))]
        setMonths(uniqueMonths)
        setSelectedMonth('all')
    }

    function filterByMonth(m) {
        setSelectedMonth(m)
        setFilteredData(m === 'all' ? allData : allData.filter(d => d.month === m))
    }

    function loadJSON() {
        try {
            const parsed = JSON.parse(jsonInput)
            const arr = Array.isArray(parsed) ? parsed : [parsed]
            loadData(arr)
            setShowModal(false)
            setJsonInput('')
        } catch {
            alert('JSON غير صحيح — تأكد من الصيغة')
        }
    }

    function loadDemo() {
        loadData(DEMO_DATA)
        setShowModal(false)
    }

    const nps = calcNPS(filteredData)
    const nbsScores = calcNBSScores(filteredData)
    const nbsAvg = nbsScores.reduce((a, b) => a + b.avg, 0) / nbsScores.length
    const valuePriceAvg = calcSectionAvg(filteredData, ['value_price'])
    const monthlyData = calcMonthlyData(allData)
    const sortedByScore = [...nbsScores].sort((a, b) => a.avg - b.avg)

    // Chart data
    const npsChartData = nps ? {
        labels: ['Promoters (9-10)', 'Passives (7-8)', 'Detractors (0-6)'],
        datasets: [{ data: [nps.promoters, nps.passives, nps.detractors], backgroundColor: [BRAND.green, BRAND.orange, BRAND.red], borderWidth: 0, hoverOffset: 8 }],
    } : null

    const radarData = {
        labels: SECTIONS.map(s => s.label),
        datasets: [{
            label: 'متوسط التقييم',
            data: nbsScores.map(s => s.avg),
            backgroundColor: 'rgba(30,215,136,0.15)',
            borderColor: BRAND.green,
            borderWidth: 2,
            pointBackgroundColor: BRAND.green,
            pointRadius: 4,
        }],
    }

    const trendData = {
        labels: monthlyData.map(m => m.month),
        datasets: [
            { label: 'NPS', data: monthlyData.map(m => m.nps), borderColor: BRAND.blue, backgroundColor: 'rgba(30,117,185,0.1)', tension: 0.4, fill: true, pointRadius: 4 },
            { label: 'NBS', data: monthlyData.map(m => m.nbs * 20), borderColor: BRAND.green, backgroundColor: 'rgba(30,215,136,0.1)', tension: 0.4, fill: true, pointRadius: 4 },
        ],
    }

    const barData = {
        labels: SECTIONS.map(s => s.label),
        datasets: [{
            label: 'متوسط التقييم',
            data: nbsScores.map(s => s.avg),
            backgroundColor: SECTION_COLORS,
            borderRadius: 8,
            borderSkipped: false,
        }],
    }

    const chartFont = { family: 'MyriadPro, Myriad Pro, sans-serif', size: 12 }
    const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: chartFont } } } }

    const navItems = [
        { id: 'overview', label: 'النظرة العامة', icon: '📊' },
        { id: 'nbs', label: 'تقييم المحاور NBS', icon: '⭐' },
        { id: 'trends', label: 'تغيرات شهرية', icon: '📈' },
        { id: 'priority', label: 'أولويات التحسين', icon: '🎯' },
        { id: 'comments', label: 'آراء العملاء', icon: '💬' },
    ]

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveNav(id)
        setSidebarOpen(false)
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', direction: 'rtl' }}>

            {/* SIDEBAR */}
            <aside style={{
                position: 'fixed',
                top: 0, right: 0,
                width: '260px',
                height: '100vh',
                background: '#1e293b',
                borderLeft: '1px solid #334155',
                padding: '28px 20px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transform: sidebarOpen ? 'translateX(0)' : undefined,
                transition: 'transform 0.3s',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 12px 24px', borderBottom: '1px solid #334155', marginBottom: '12px' }}>
                    <img src={logoSrc} alt="Cloud Coworking" style={{ height: '40px', objectFit: 'contain' }} />
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'var(--font-primary)' }}>Cloud Coworking</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-secondary)' }}>Analytics Dashboard</div>
                    </div>
                </div>

                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', padding: '16px 14px 6px', fontFamily: 'var(--font-primary)' }}>
                    التحليل
                </div>

                {navItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: '600',
                            color: activeNav === item.id ? BRAND.green : '#94a3b8',
                            background: activeNav === item.id ? 'rgba(30,215,136,0.12)' : 'transparent',
                            transition: 'all 0.2s',
                            fontFamily: 'var(--font-secondary)',
                        }}
                    >
                        <span style={{ fontSize: '16px', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                        {item.label}
                    </div>
                ))}

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155' }}>
                    <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-secondary)' }}>
                        <span style={{ fontSize: '22px', fontWeight: '900', color: BRAND.green, display: 'block', fontFamily: 'var(--font-primary)' }}>
                            {filteredData.length}
                        </span>
                        إجمالي الاستجابات
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main style={{ marginRight: '260px', minHeight: '100vh', background: '#f1f5f9', flex: 1 }}>

                {/* TOPBAR */}
                <div style={{
                    background: '#fff',
                    borderBottom: '1px solid var(--border)',
                    padding: '18px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 50,
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)', fontFamily: 'var(--font-primary)' }}>
                        📊 لوحة تحليلات الاستبيان
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={selectedMonth}
                            onChange={e => filterByMonth(e.target.value)}
                            style={{
                                padding: '8px 16px', border: '2px solid var(--border)', borderRadius: '10px',
                                fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: '600',
                                color: 'var(--ink-soft)', background: 'var(--cloud)', cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            <option value="all">كل الأوقات</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                background: `linear-gradient(135deg, ${BRAND.blue}, #155d94)`,
                                color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '10px',
                                fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: '700',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s',
                            }}
                        >
                            📥 تحميل بيانات
                        </button>
                    </div>
                </div>

                <div style={{ padding: '28px 32px' }}>

                    {/* KPI CARDS */}
                    <div id="overview" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                        <KPICard
                            label="Net Promoter Score"
                            value={nps ? (nps.score > 0 ? '+' : '') + nps.score : '—'}
                            sub={nps ? (nps.score >= 50 ? 'ممتاز — ولاء قوي جداً' : nps.score >= 0 ? 'جيد — هناك مجال للتطوير' : 'يحتاج تدخل فوري') : 'لا توجد بيانات بعد'}
                            color={`linear-gradient(90deg, ${BRAND.blue}, #38bdf8)`}
                            dark
                        >
                            {nps && (
                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Promoters', val: nps.promotersPct + '%', color: BRAND.green },
                                        { label: 'Passives', val: nps.passivesPct + '%', color: BRAND.orange },
                                        { label: 'Detractors', val: nps.detractorsPct + '%', color: BRAND.red },
                                    ].map(s => (
                                        <div key={s.label} style={{ flex: 1, minWidth: '60px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '900', color: s.color, fontFamily: 'var(--font-primary)' }}>{s.val}</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', fontFamily: 'var(--font-secondary)' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </KPICard>

                        <KPICard
                            label="NBS العام"
                            value={filteredData.length ? nbsAvg.toFixed(2) : '—'}
                            sub={filteredData.length ? getStatus(nbsAvg).label : 'تصنيف الأداء العام'}
                            color={`linear-gradient(90deg, ${BRAND.green}, #34d399)`}
                        />
                        <KPICard
                            label="إجمالي الاستجابات"
                            value={filteredData.length}
                            sub="استجابة مسجلة"
                            color={`linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green})`}
                        />
                        <KPICard
                            label="القيمة مقابل السعر"
                            value={valuePriceAvg ? valuePriceAvg.toFixed(1) : '—'}
                            sub="من أصل 5"
                            color={`linear-gradient(90deg, ${BRAND.orange}, #fbbf24)`}
                        />
                    </div>

                    {/* NPS + RADAR */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                        <ChartCard title="توزيع NPS" sub="Promoters / Passives / Detractors">
                            <div style={{ height: '260px' }}>
                                {npsChartData
                                    ? <Doughnut data={npsChartData} options={{ ...commonOpts, cutout: '65%' }} />
                                    : <EmptyState />}
                            </div>
                        </ChartCard>
                        <ChartCard title="خريطة المحاور — Radar" sub="متوسط كل محور من 5">
                            <div style={{ height: '260px' }}>
                                {filteredData.length
                                    ? <Radar data={radarData} options={{ ...commonOpts, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, font: chartFont }, pointLabels: { font: chartFont } } } }} />
                                    : <EmptyState />}
                            </div>
                        </ChartCard>
                    </div>

                    {/* NBS AXES */}
                    <ChartCard id="nbs" title="📊 تفصيل نقاط المحاور — NBS" sub="متوسط التقييم لكل محور (1–5) مع تصنيف الأداء" style={{ marginBottom: '24px' }}>
                        <div id="nbs-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredData.length ? nbsScores.map((s, i) => {
                                const st = getStatus(s.avg)
                                return (
                                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-soft)', minWidth: '130px', fontFamily: 'var(--font-secondary)' }}>
                                            {s.emoji} {s.label}
                                        </span>
                                        <div style={{ flex: 1, background: 'var(--cloud)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', borderRadius: '999px', background: SECTION_COLORS[i], width: `${(s.avg / 5) * 100}%`, transition: 'width 1s ease' }} />
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '700', minWidth: '38px', color: SECTION_COLORS[i], fontFamily: 'var(--font-primary)' }}>
                                            {s.avg || '—'}
                                        </span>
                                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', minWidth: '90px', textAlign: 'center', background: st.bg, color: st.color, fontFamily: 'var(--font-primary)' }}>
                                            {st.label}
                                        </span>
                                    </div>
                                )
                            }) : <EmptyState />}
                        </div>
                    </ChartCard>

                    {/* TRENDS */}
                    <ChartCard title="📈 التغير الشهري" sub="متابعة NPS و NBS شهرياً" style={{ marginBottom: '24px' }}>
                        <div id="trends-section" style={{ height: '300px' }}>
                            {monthlyData.length
                                ? <Line data={trendData} options={{ ...commonOpts, scales: { x: { ticks: { font: chartFont } }, y: { ticks: { font: chartFont } } } }} />
                                : <EmptyState />}
                        </div>
                    </ChartCard>

                    {/* PRIORITY + BAR */}
                    <div id="priority-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
                        <ChartCard title="🎯 أولويات التحسين" sub="المحاور الأقل أداءً (يحتاج فعل فوري)">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {filteredData.length ? sortedByScore.slice(0, 3).map((s, i) => {
                                    const rankColors = [{ bg: '#fde0e5', color: BRAND.red }, { bg: '#fdecd8', color: BRAND.orange }, { bg: '#ddeef9', color: BRAND.blue }]
                                    const rc = rankColors[i]
                                    return (
                                        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--cloud)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0, background: rc.bg, color: rc.color, fontFamily: 'var(--font-primary)' }}>
                                                {i + 1}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', fontFamily: 'var(--font-primary)' }}>{s.emoji} {s.label}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)' }}>متوسط التقييم</div>
                                            </div>
                                            <div style={{ fontSize: '22px', fontWeight: '900', color: BRAND.red, minWidth: '50px', textAlign: 'center', fontFamily: 'var(--font-primary)' }}>
                                                {s.avg || '—'}
                                            </div>
                                        </div>
                                    )
                                }) : <EmptyState />}
                            </div>
                        </ChartCard>
                        <ChartCard title="📊 توزيع تقييم المحاور" sub="مقارنة شاملة بين المحاور">
                            <div style={{ height: '280px' }}>
                                {filteredData.length
                                    ? <Bar data={barData} options={{ ...commonOpts, scales: { y: { min: 0, max: 5, ticks: { font: chartFont } }, x: { ticks: { font: chartFont } } } }} />
                                    : <EmptyState />}
                            </div>
                        </ChartCard>
                    </div>

                    {/* COMMENTS */}
                    <ChartCard id="comments-section" title="💬 آراء العملاء المفتوحة" sub="أحدث الاستجابات من العملاء">
                        <div id="comments-section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredData.length ? filteredData.slice(-5).reverse().map((d, i) => (
                                <div key={i} style={{ background: 'var(--cloud)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                                    {d.liked_most && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: BRAND.green, marginBottom: '4px', fontFamily: 'var(--font-primary)' }}>✅ أعجبني</div>
                                            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontFamily: 'var(--font-secondary)', lineHeight: '1.6' }}>{d.liked_most}</div>
                                        </div>
                                    )}
                                    {d.needs_improvement && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: BRAND.orange, marginBottom: '4px', fontFamily: 'var(--font-primary)' }}>🔧 يحتاج تحسين</div>
                                            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontFamily: 'var(--font-secondary)', lineHeight: '1.6' }}>{d.needs_improvement}</div>
                                        </div>
                                    )}
                                    {d.if_manager && (
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9b59b6', marginBottom: '4px', fontFamily: 'var(--font-primary)' }}>👔 لو كنت المدير</div>
                                            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontFamily: 'var(--font-secondary)', lineHeight: '1.6' }}>{d.if_manager}</div>
                                        </div>
                                    )}
                                </div>
                            )) : <EmptyState />}
                        </div>
                    </ChartCard>

                </div>
            </main>

            {/* IMPORT MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'var(--font-primary)' }}>📥 تحميل بيانات الاستبيان</h3>
                        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'var(--font-secondary)', marginBottom: '20px', lineHeight: '1.7' }}>
                            يمكنك لصق بيانات JSON من Google Sheets أو استخدام البيانات التجريبية.
                        </p>
                        <div style={{ background: 'var(--brand-blue-light)', borderRadius: '10px', padding: '12px 16px', fontSize: '12px', color: 'var(--brand-blue-dark)', marginBottom: '14px', fontFamily: 'var(--font-secondary)' }}>
                            💡 <strong>للتجربة الفورية:</strong> اضغط "بيانات تجريبية" لرؤية الداشبورد يعمل بالكامل
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={e => setJsonInput(e.target.value)}
                            placeholder='[{"nps": 9, "internet_0": 4, ...}]'
                            dir="ltr"
                            style={{ width: '100%', height: '200px', padding: '14px', border: '2px solid var(--border)', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', resize: 'vertical', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '2px solid var(--border)', borderRadius: '10px', background: '#fff', fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: 'var(--ink-soft)' }}>
                                إلغاء
                            </button>
                            <button onClick={loadDemo} style={{ padding: '10px 20px', border: `2px solid ${BRAND.green}`, borderRadius: '10px', background: 'var(--brand-green-light)', fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: 'var(--brand-green-dark)' }}>
                                🎭 بيانات تجريبية
                            </button>
                            <button onClick={loadJSON} style={{ padding: '10px 24px', background: `linear-gradient(135deg, ${BRAND.blue}, #155d94)`, color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                                📊 تحميل وتحليل
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function EmptyState() {
    return (
        <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '40px', fontFamily: 'var(--font-secondary)', fontSize: '14px' }}>
            لا توجد بيانات بعد — قم بتحميل بيانات أو استخدم البيانات التجريبية
        </div>
    )
}
