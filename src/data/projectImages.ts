/**
 * Which picture a project shows.
 *
 * 1. The project's own uploaded image always wins.
 * 2. Otherwise the standard photo of its expertise field (the same photos the
 *    expertise pages use), as on the original website.
 * 3. Unknown or missing expertise: the generic projects picture.
 *
 * Display-only: nothing is written back to the project records.
 */

export const GENERIC_PROJECT_IMAGE = 'icon_projects.jpg';

export const EXPERTISE_DEFAULT_IMAGES: Record<string, string> = {
  'statistics-evaluation-social-research': 'icon-institute_7-1024x683-1.jpg',
  'economic-employment-promotion': 'icon-institute_5.jpg',
  'governance-education-social-development': 'icon-institute-22.jpg',
  'agriculture-rural-development': 'Agriculture-Sector.jpg',
  'sustainability-management': 'iStock-1333864874.png',
};

export function projectImage(project: {
  image?: string | null;
  expertise?: string | null;
}): string {
  const own = project.image?.trim();
  if (own) return own;
  return (project.expertise && EXPERTISE_DEFAULT_IMAGES[project.expertise]) || GENERIC_PROJECT_IMAGE;
}
