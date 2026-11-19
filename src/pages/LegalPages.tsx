import { impressum, privacyPolicy, type LegalPage } from '../data/legal';
import { Seo } from '../components/Seo';
import { pageSeo } from '../data/seo';

function LegalContent({
  page,
  seoKey,
}: {
  page: LegalPage;
  seoKey: 'privacy' | 'impressum';
}) {
  return (
    <div className="legal-page">
      <Seo {...pageSeo[seoKey]} />
      {/* Plain white page with the title, as on the original site (no banner). */}
      <section className="content-section">
        <div className="container narrow">
          <h1 className="legal-page__title">{page.title}</h1>
          {page.sections.map((section) => (
            <div key={section.title} className="legal-section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PrivacyPage() {
  return <LegalContent page={privacyPolicy} seoKey="privacy" />;
}

export function ImpressumPage() {
  return <LegalContent page={impressum} seoKey="impressum" />;
}
