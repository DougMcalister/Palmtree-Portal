import { HomepageHeader } from './homepage.tsx'

type HomepageTemplatePageProps = {
  label: string
}

function HomepageTemplatePage({ label }: HomepageTemplatePageProps) {
  return (
    <main className="public-shell public-homepage homepage-template-page page-transition-shell" aria-label={label}>
      <HomepageHeader />
    </main>
  )
}

export function AboutPage() {
  return <HomepageTemplatePage label="About Us" />
}

export function WhyChooseUsPage() {
  return <HomepageTemplatePage label="Why Choose Us" />
}

export function KeyFeaturesPage() {
  return <HomepageTemplatePage label="Key Features" />
}
