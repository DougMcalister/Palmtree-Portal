import { type MouseEvent } from 'react'

type InfoCard = {
  title: string
  href: string
}

const infoCards: InfoCard[] = [
  { title: 'About', href: '/about-us' },
  { title: 'Why Choose Us', href: '/why-choose-us' },
  { title: 'Key Features', href: '/key-features' },
]

function handleTransitionLink(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  ) {
    return
  }

  event.preventDefault()
  document.documentElement.classList.add('page-transition-out')
  window.setTimeout(() => {
    window.location.assign(href)
  }, 220)
}

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

        <div className="hero-image-frame" aria-label="Image frame reserved for a future homepage image" />
      </section>

      <section className="homepage-info-cards" aria-label="Homepage information">
        {infoCards.map((card) => (
          <a
            className="homepage-info-card"
            href={card.href}
            key={card.title}
            onClick={(event) => handleTransitionLink(event, card.href)}
          >
            <span className="homepage-info-image" aria-label={`Image placeholder for ${card.title}`} />
            <span className="homepage-info-title">{card.title}</span>
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

      <nav className="homepage-control-nav" aria-label="Homepage navigation links">
        <a className="homepage-header-button" href="/about-us">About Us</a>
        <a className="homepage-header-button" href="/why-choose-us">Why Choose Us</a>
        <a className="homepage-header-button" href="/key-features">Key Features</a>
      </nav>

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

      <nav className="public-nav" aria-label="Public navigation">
        <a href="/about-us">About Us</a>
        <a href="/why-choose-us">Why Choose Us</a>
        <a href="/key-features">Key Features</a>
      </nav>

      <div className="public-account-links">
        <a href="/login">Login</a>
        <a href="/login">Register</a>
      </div>
    </header>
  )
}

export default PublicHomepage
