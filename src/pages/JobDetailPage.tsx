import { Link, useParams } from 'react-router-dom';
import { jobsPage as bundledJobsPage, isJobExpired, type JobListing } from '../data/jobs';
import { homePage as bundledHome, type HomePage as HomeData } from '../data/home';
import { PageHero } from '../components/PageHero';
import { Seo } from '../components/Seo';
import { usePublished } from '../hooks/usePublished';

/** A titled bullet list inside a job section; renders nothing when empty. */
function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <h4>{title}</h4>
      <ul>
        {items.map((item, i) => (
          <li key={`${i}-${item.slice(0, 32)}`}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export function JobDetailPage() {
  const { jobId } = useParams();
  const listings = usePublished<JobListing[]>('/jobs', bundledJobsPage.listings);
  const home = usePublished<HomeData>('/pages/home', bundledHome);
  const heroImage =
    home.quickLinks.find((l) => l.href === '/jobs')?.image ??
    'icon_institute_jobs.jpg';
  // An expired ad is treated as gone, exactly like the API's 404 for it.
  const job = jobId
    ? listings.find((j) => j.id === jobId && !isJobExpired(j))
    : undefined;

  if (!job) {
    return (
      <div className="content-section container">
        <h1>Job not found</h1>
        <p>
          <Link to="/jobs">Back to Jobs</Link>
        </p>
      </div>
    );
  }

  // Structured sections take precedence; older ads fall back to
  // description (Job Description intro) and requirements (Your profile).
  const lines = (v?: string[] | null) => (v ?? []).filter((l) => l.trim());
  const background = lines(job.background);
  const intro = lines(job.description);
  const acquisition = lines(job.project_acquisition);
  const management = lines(job.project_management);
  const ownProfile = lines(job.your_profile);
  const profile = ownProfile.length > 0 ? ownProfile : lines(job.requirements);
  const offer = lines(job.what_we_offer);

  return (
    <div className="job-detail">
      <Seo
        title={`${job.title} | Jobs | ICON-INSTITUTE`}
        description={job.summary}
        path={`/jobs/${job.id}`}
      />
      <PageHero title="JOBS" image={heroImage} imageAlt="" />
      <section className="content-section">
        <div className="container narrow">
          <p className="back-link">
            <Link to="/jobs">← All job offers</Link>
          </p>
          <h2>{job.title}</h2>
          <p className="job-card__meta">
            {job.type} · {job.location}
          </p>
          <p className="job-card__meta">
            Expertise: {job.expertise} · Published{' '}
            <time dateTime={job.published}>{job.published}</time> · Deadline{' '}
            <time dateTime={job.deadline}>{job.deadline}</time>
          </p>

          {background.length > 0 && (
            <section className="job-section">
              <h3>Background</h3>
              {background.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </section>
          )}

          {(intro.length > 0 || acquisition.length > 0 || management.length > 0) && (
            <section className="job-section">
              <h3>Job Description</h3>
              {intro.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
              <BulletList title="Project Acquisition" items={acquisition} />
              <BulletList title="Project Management" items={management} />
            </section>
          )}

          {(profile.length > 0 || offer.length > 0) && (
            <section className="job-section">
              <h3>Candidate&rsquo;s Profile</h3>
              <BulletList title="Your profile" items={profile} />
              <BulletList title="What we offer" items={offer} />
            </section>
          )}

          <p className="job-card__actions">
            <Link to={`/jobs/${job.id}/apply`} className="btn btn--primary">
              Apply for this position
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
