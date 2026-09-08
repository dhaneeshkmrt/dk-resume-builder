/**
 * Content-Aware Smart Pagination for Resume A4 Pages
 *
 * Rules:
 * 1. Text lines are never sliced in half horizontally across A4 cut lines (297mm, 594mm...).
 * 2. Section headings are never left orphaned at the bottom of a page.
 * 3. An entry's header (role, company, dates) stays with at least its first bullet point.
 * 4. Multi-bullet entries break naturally across pages at bullet boundaries, avoiding huge empty spaces.
 * 5. Standalone items (education, skills, certs) move cleanly to the next page if they cross the cut line.
 */

export interface PaginationResult {
  totalPages: number;
  a4HeightPx: number;
  a4WidthPx: number;
}

export function applyContentAwarePagination(
  container: HTMLElement,
  zoom: number = 100
): PaginationResult {
  if (!container) {
    return { totalPages: 1, a4HeightPx: 1123, a4WidthPx: 794 };
  }

  // 1. Reset all previous margin-top adjustments
  const adjustableElements = container.querySelectorAll<HTMLElement>(
    '.resume-section-title, .resume-entry, .resume-entry-header, .resume-bullet, .resume-standalone-item, .resume-item'
  );
  adjustableElements.forEach(el => {
    el.style.marginTop = '';
  });

  // Temporarily reset minHeight to single page to measure natural content height
  container.style.minHeight = '297mm';

  // 2. Standard A4 dimensions at 96 DPI (210mm x 297mm)
  // 1 inch = 25.4mm = 96px => 210mm = 793.7px (~794px), 297mm = 1122.5px (~1123px)
  const a4WidthPx = 794;
  const a4HeightPx = 1123;
  const pageBottomBufferPx = 28; // Safe bottom margin before the cut line
  const pageTopBufferPx = 34;    // Breathing room padding at top of next page
  const scale = (zoom || 100) / 100;

  // 3. Process each page cut line sequentially
  let pageIndex = 1;
  const MAX_PAGES = 8; // Safety ceiling
  let iterations = 0;
  const MAX_ITERATIONS = 40; // Prevent infinite loops

  while (pageIndex < MAX_PAGES && iterations < MAX_ITERATIONS) {
    iterations++;
    const pageCutLine = pageIndex * a4HeightPx;
    const containerRect = container.getBoundingClientRect();

    // Query all potential breakable elements in document flow
    const candidates = Array.from(
      container.querySelectorAll<HTMLElement>(
        '.resume-section-title, .resume-entry, .resume-entry-header, .resume-bullet, .resume-standalone-item, .resume-item'
      )
    );

    let pushedSomething = false;

    for (const el of candidates) {
      const elRect = el.getBoundingClientRect();
      const elTop = (elRect.top - containerRect.top) / scale;
      const elHeight = elRect.height / scale;
      const elBottom = elTop + elHeight;

      // Check if element starts on current page (before cut line)
      // and its bottom extends past safe threshold
      if (elTop < pageCutLine && elBottom > pageCutLine - pageBottomBufferPx) {
        // Individual bullet point
        if (el.classList.contains('resume-bullet')) {
          const isFirstBullet = el.getAttribute('data-bullet-idx') === '0';

          if (isFirstBullet) {
            // First bullet cannot fit; push the entire entry header + bullet together
            const entry = el.closest<HTMLElement>('.resume-entry, .resume-item');
            if (entry) {
              const entryRect = entry.getBoundingClientRect();
              const entryTop = (entryRect.top - containerRect.top) / scale;
              const pushDistance = pageCutLine - entryTop + pageTopBufferPx;
              entry.style.marginTop = `${pushDistance}px`;
              pushedSomething = true;
              break;
            }
          }

          // Subsequent bullet (idx > 0): push this bullet to top of next page
          const pushDistance = pageCutLine - elTop + pageTopBufferPx;
          el.style.marginTop = `${pushDistance}px`;
          pushedSomething = true;
          break;
        }

        // Section Title
        if (el.classList.contains('resume-section-title')) {
          const pushDistance = pageCutLine - elTop + pageTopBufferPx;
          el.style.marginTop = `${pushDistance}px`;
          pushedSomething = true;
          break;
        }

        // Standalone Item (education, skills category, certification)
        if (
          el.classList.contains('resume-standalone-item') ||
          (!el.querySelector('.resume-bullet') && (el.classList.contains('resume-entry') || el.classList.contains('resume-item')))
        ) {
          const pushDistance = pageCutLine - elTop + pageTopBufferPx;
          el.style.marginTop = `${pushDistance}px`;
          pushedSomething = true;
          break;
        }

        // Entry header (without bullets or before bullets)
        if (el.classList.contains('resume-entry-header')) {
          const entry = el.closest<HTMLElement>('.resume-entry, .resume-item') || el;
          const entryRect = entry.getBoundingClientRect();
          const entryTop = (entryRect.top - containerRect.top) / scale;
          const pushDistance = pageCutLine - entryTop + pageTopBufferPx;
          entry.style.marginTop = `${pushDistance}px`;
          pushedSomething = true;
          break;
        }
      }

      // Check for orphan section titles (title fits, but first entry would be on next page)
      if (el.classList.contains('resume-section-title') && elTop < pageCutLine) {
        if (elBottom > pageCutLine - (pageBottomBufferPx + 50)) {
          const pushDistance = pageCutLine - elTop + pageTopBufferPx;
          el.style.marginTop = `${pushDistance}px`;
          pushedSomething = true;
          break;
        }
      }
    }

    if (!pushedSomething) {
      // Check if remaining content exceeds this page
      const currentScrollHeight = container.scrollHeight;
      if (currentScrollHeight <= pageCutLine) {
        break; // Finished: all content fits within current pages
      }
      pageIndex++;
    }
  }

  // Calculate final total page count
  const finalScrollHeight = container.scrollHeight;
  const totalPages = Math.max(1, Math.ceil(finalScrollHeight / a4HeightPx));

  // Set minimum height to exact multiple of A4 pages
  container.style.minHeight = `${totalPages * 297}mm`;

  return { totalPages, a4HeightPx, a4WidthPx };
}
