type InfoCard = {
  title: string
  text: string
  label: string
}

const infoCards: InfoCard[] = [
  {
    title: 'About',
    label: 'Platform',
    text: 'Palmtree Project helps local councils collect consistent Scope 3 emissions data from suppliers without turning reporting into another heavy administrative task.',
  },
  {
    title: 'Why Choose Us',
    label: 'Approach',
    text: 'Built for civic procurement, supplier privacy, and practical reporting, the platform keeps data capture focused on what councils and suppliers actually need.',
  },
  {
    title: 'Key Features',
    label: 'Tools',
    text: 'Track supplier activity, connect invoices to inventory records, review emissions analytics, and support small businesses with simpler reporting workflows.',
  },
]

function PublicHomepage() {
  return (
    <main className="public-shell public-homepage page-transition-shell">
      <HomepageHeader />

      <section className="public-hero" aria-labelledby="public-home-title">
        <div className="public-hero-copy">
          <p className="public-eyebrow">City emissions management</p>
          <h1 id="public-home-title">
            One Step Toward A Greener Future
            <br />
            <em>Collect, Connect, Reduce</em>
          </h1>
          <div className="public-hero-actions" aria-label="Account actions">
            <a className="public-button public-button-primary" href="/login">Login</a>
            <a className="public-button public-button-secondary" href="/login">Register</a>
          </div>
        </div>

        <div className="hero-image-frame" aria-label="Image frame reserved for a future homepage image">
          <img src="/public/Logo.png" alt="Site Logo" />
        </div>
      </section>

      <section className="homepage-info-cards" aria-label="Homepage information">
        {infoCards.map((card) => (
          <a
            className="homepage-info-card"
            key={card.title}
          >
            <span className="homepage-info-label">{card.label}</span>
            <h2 className="homepage-info-title">{card.title}</h2>
            <p>{card.text}</p>
          </a>
        ))}
      </section>
    </main>
  )
}

export function HomepageHeader() {
  return (
    <header className="homepage-control-header" aria-label="Homepage navigation">
      <a className="homepage-control-brand" href="/" aria-label="Homepage">
        <img className="homepage-control-brand-mark" src="/Logo.png" alt="" aria-hidden="true" />
        <span>Palmtree Project</span>
      </a>

      <div className="homepage-auth-actions" aria-label="Account actions">
        <a className="homepage-header-button homepage-auth-button" href="/login">Login</a>
        <a className="homepage-header-button homepage-auth-button" href="/login">Register</a>
      </div>
    </header>
  )
}

export function PublicHeader() {
  return (
    <header className="public-header">
      <a className="public-brand" href="/" aria-label="Palmtree home">
        <span className="public-brand-mark" aria-hidden="true">P</span>
        <span>Palmtree</span>
      </a>

      <div className="public-account-links">
        <a href="/login">Login</a>
        <a href="/login">Register</a>
      </div>
    </header>
  )
}

export default PublicHomepage
