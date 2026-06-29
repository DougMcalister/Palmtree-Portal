import { type FormEvent, useState } from 'react'
import { authenticateUser, type LoginRole } from './auth.ts'
import { HomepageHeader } from './homepage.tsx'

const roleLabels: Record<LoginRole, string> = {
  client: 'Client',
  supplier: 'Supplier',
}

function LoginPage() {
  const [activeRole, setActiveRole] = useState<LoginRole>('client')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await authenticateUser(activeRole, username, password)

    if (result.ok) {
      window.location.assign(result.redirectPath)
      return
    }

    setIsSubmitting(false)
    setError(`The ${roleLabels[activeRole].toLowerCase()} credentials did not match.`)
  }

  return (
    <main className="public-shell login-page">
      <HomepageHeader />
      <a className="login-close" href="/" aria-label="Close login">×</a>

      <section className="login-card" aria-labelledby="login-title">
        <p className="public-eyebrow">Secure access</p>
        <h1 id="login-title">{roleLabels[activeRole]} Login</h1>

        <div className="login-role-toggle" role="tablist" aria-label="Login type">
          {(['client', 'supplier'] as LoginRole[]).map((role) => (
            <button
              className={`login-role-button ${activeRole === role ? 'is-active' : ''}`}
              key={role}
              type="button"
              role="tab"
              aria-selected={activeRole === role}
              onClick={() => {
                setActiveRole(role)
                setError('')
              }}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              autoComplete="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="login-error" role="alert">{error}</p> : null}

          <button className="public-button public-button-primary login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Checking...' : `Login as ${roleLabels[activeRole]}`}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
