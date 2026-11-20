/**
 * Flexible job-ad sections.
 *
 * Every vacancy can define its own sections (title, optional subtitle, paragraphs)
 * and boxes inside them (title + bullet items), in any order. Plain text only.
 *
 * Older ads have no `sections`: they are shown from their classic fields
 * (background / description / project_acquisition / project_management /
 * your_profile or requirements / what_we_offer) through `classicJobSections`,
 * which produces exactly the layout those ads always had. The CMS editor uses the
 * same function to pre-fill the editor when such an ad is opened.
 */

export type JobBox = {
  title: string;
  items: string[];
};

export type JobSection = {
  title: string;
  subtitle?: string | null;
  paragraphs: string[];
  boxes: JobBox[];
};

/** The classic fields an older job ad may carry. */
export type ClassicJobFields = {
  description?: string[] | null;
  requirements?: string[] | null;
  background?: string[] | null;
  project_acquisition?: string[] | null;
  project_management?: string[] | null;
  your_profile?: string[] | null;
  what_we_offer?: string[] | null;
};

const lines = (v?: string[] | null) => (v ?? []).map((l) => l.trim()).filter(Boolean);

/** The classic three-part layout, built from an older ad's fields. */
export function classicJobSections(job: ClassicJobFields): JobSection[] {
  const ownProfile = lines(job.your_profile);
  return [
    { title: 'Background', paragraphs: lines(job.background), boxes: [] },
    {
      title: 'Job Description',
      paragraphs: lines(job.description),
      boxes: [
        { title: 'Project Acquisition', items: lines(job.project_acquisition) },
        { title: 'Project Management', items: lines(job.project_management) },
      ],
    },
    {
      title: 'Candidate’s Profile',
      paragraphs: [],
      boxes: [
        { title: 'Your profile', items: ownProfile.length > 0 ? ownProfile : lines(job.requirements) },
        { title: 'What we offer', items: lines(job.what_we_offer) },
      ],
    },
  ];
}

/** Only what has content: empty boxes and sections without content are dropped. */
export function visibleJobSections(sections: JobSection[]): JobSection[] {
  return sections
    .map((s) => ({
      ...s,
      subtitle: s.subtitle?.trim() || null,
      paragraphs: lines(s.paragraphs),
      boxes: (s.boxes ?? [])
        .map((b) => ({ ...b, items: lines(b.items) }))
        .filter((b) => b.items.length > 0),
    }))
    .filter((s) => s.paragraphs.length > 0 || s.boxes.length > 0);
}

/** What the public page shows: the ad's own sections, or its classic layout. */
export function jobSectionsFor(job: ClassicJobFields & { sections?: JobSection[] | null }): JobSection[] {
  const own = job.sections ?? [];
  return visibleJobSections(own.length > 0 ? own : classicJobSections(job));
}
