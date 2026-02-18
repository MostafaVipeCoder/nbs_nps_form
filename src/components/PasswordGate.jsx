import { useState, useEffect } from 'react'
import logoSrc from '../assets/logo.png'

const SESSION_KEY = 'cloud_dash_auth'

export default function PasswordGate({ password, children }) {
    const [authed, setAuthed] = useState(false)
    const [input, setInput] = useState('')
    const [error, setError] = useState(false)
    const [shake, setShake] = useState(false)
    const [showPw, setShowPw] = useState(false)

    useEffect(() => {
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            setAuthed(true)
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        if (input === password) {
            sessionStorage.setItem(SESSION_KEY, 'true')
            setAuthed(true)
        } else {
            setError(true)
            setShake(true)
            setTimeout(() => setShake(false), 600)
            setInput('')
        }
    }

    if (authed) return children

    return (
        <div style={styles.overlay}>
            {/* Background blobs */}
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={{ ...styles.card, ...(shake ? styles.shake : {}) }}>
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <img src={logoSrc} alt="Cloud Coworking" style={styles.logo} />
                </div>

                {/* Title */}
                <h1 style={styles.title}>لوحة التحليلات</h1>
                <p style={styles.subtitle}>هذه الصفحة محمية — أدخل كلمة المرور للمتابعة</p>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputWrap}>
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={input}
                            onChange={e => { setInput(e.target.value); setError(false) }}
                            placeholder="كلمة المرور"
                            style={{
                                ...styles.input,
                                borderColor: error ? 'var(--brand-red)' : 'var(--border)',
                                boxShadow: error ? '0 0 0 3px rgba(248,56,84,0.15)' : 'none',
                            }}
                            autoFocus
                            dir="ltr"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(v => !v)}
                            style={styles.eyeBtn}
                            tabIndex={-1}
                        >
                            {showPw ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {error && (
                        <p style={styles.errorMsg}>❌ كلمة المرور غير صحيحة</p>
                    )}

                    <button type="submit" style={styles.submitBtn}>
                        دخول
                    </button>
                </form>

                {/* Lock icon */}
                <div style={styles.lockBadge}>🔒 وصول آمن</div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0faf6 0%, #e8f4fd 50%, #fff5f7 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'fixed',
        top: '-150px',
        right: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,215,136,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'fixed',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,117,185,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(30,117,185,0.14)',
        border: '1px solid rgba(30,215,136,0.15)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
    },
    shake: {
        animation: 'shake 0.5s ease',
    },
    logoWrap: {
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'center',
    },
    logo: {
        height: '64px',
        objectFit: 'contain',
    },
    title: {
        fontFamily: 'var(--font-primary)',
        fontSize: '26px',
        fontWeight: '700',
        color: 'var(--brand-dark)',
        marginBottom: '8px',
    },
    subtitle: {
        fontFamily: 'var(--font-secondary)',
        fontSize: '14px',
        color: 'var(--ink-muted)',
        marginBottom: '32px',
        lineHeight: '1.6',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputWrap: {
        position: 'relative',
    },
    input: {
        width: '100%',
        padding: '14px 48px 14px 16px',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        fontSize: '15px',
        fontFamily: 'var(--font-secondary)',
        color: 'var(--ink)',
        background: 'var(--cloud)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        textAlign: 'left',
    },
    eyeBtn: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '4px',
        lineHeight: 1,
    },
    errorMsg: {
        color: 'var(--brand-red)',
        fontSize: '13px',
        fontFamily: 'var(--font-secondary)',
        textAlign: 'center',
    },
    submitBtn: {
        background: 'linear-gradient(135deg, var(--brand-green), var(--brand-green-dark))',
        color: '#ffffff',
        border: 'none',
        padding: '15px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        fontFamily: 'var(--font-primary)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 6px 20px rgba(30,215,136,0.35)',
        letterSpacing: '0.5px',
    },
    lockBadge: {
        marginTop: '24px',
        fontSize: '12px',
        color: 'var(--ink-muted)',
        fontFamily: 'var(--font-secondary)',
    },
}
