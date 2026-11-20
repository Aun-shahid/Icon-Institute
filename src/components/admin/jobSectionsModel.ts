import type { JobBox, JobSection } from '../../data/jobSections';

/** Editor-side shape of job-ad sections: adds stable keys for React lists. */
export type EditorBox = JobBox & { key: string };
export type EditorSection = Omit<JobSection, 'boxes' | 'subtitle'> & {
  key: string;
  subtitle: string;
  boxes: EditorBox[];
};

let counter = 0;
export const newKey = () => `jse-${Date.now().toString(36)}-${(counter += 1)}`;

export function toEditorSections(sections: JobSection[]): EditorSection[] {
  return sections.map((s) => ({
    key: newKey(),
    title: s.title,
    subtitle: s.subtitle ?? '',
    paragraphs: [...(s.paragraphs ?? [])],
    boxes: (s.boxes ?? []).map((b) => ({ key: newKey(), title: b.title, items: [...(b.items ?? [])] })),
  }));
}

const clean = (lines: string[]) => lines.map((l) => l.trim()).filter(Boolean);

/** What is sent to the API: trimmed text, blank lines dropped, no editor keys. */
export function fromEditorSections(sections: EditorSection[]): JobSection[] {
  return sections.map((s) => ({
    title: s.title.trim(),
    subtitle: s.subtitle.trim() || null,
    paragraphs: clean(s.paragraphs),
    boxes: s.boxes.map((b) => ({ title: b.title.trim(), items: clean(b.items) })),
  }));
}

/** An optional starting point (every heading can be renamed or removed). */
export function standardLayout(): EditorSection[] {
  return toEditorSections([
    { title: 'Background', paragraphs: [], boxes: [] },
    { title: 'Job Description', paragraphs: [], boxes: [{ title: 'Key responsibilities', items: [] }] },
    {
      title: 'Candidate’s Profile',
      paragraphs: [],
      boxes: [
        { title: 'Your profile', items: [] },
        { title: 'What we offer', items: [] },
      ],
    },
  ]);
}
