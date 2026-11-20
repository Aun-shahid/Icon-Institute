import { confirmToast } from './Toast';
import { newKey, standardLayout, type EditorBox, type EditorSection } from './jobSectionsModel';

/**
 * Flexible job-ad editor, shared by "Add job ad" and "Edit".
 *
 * Each vacancy gets its own sections (title, optional subtitle, paragraphs) and
 * boxes inside them (title + bullet items). Sections and boxes can be added,
 * renamed, removed and reordered. Plain text only: one paragraph / bullet per line.
 */

function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function LinesField({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (lines: string[]) => void;
  rows: number;
  hint: string;
}) {
  return (
    <label>
      {label}
      <textarea rows={rows} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} />
      <span className="field-hint">{hint}</span>
    </label>
  );
}

export function JobSectionsEditor({
  value,
  onChange,
}: {
  value: EditorSection[];
  onChange: (sections: EditorSection[]) => void;
}) {
  const setSection = (i: number, patch: Partial<EditorSection>) =>
    onChange(value.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const setBoxes = (i: number, boxes: EditorBox[]) => setSection(i, { boxes });

  const removeSection = async (i: number) => {
    const name = value[i].title.trim() || `section ${i + 1}`;
    if (await confirmToast(`Remove the section “${name}” and everything in it?`)) {
      onChange(value.filter((_, k) => k !== i));
    }
  };
  const removeBox = async (i: number, b: number) => {
    const name = value[i].boxes[b].title.trim() || `box ${b + 1}`;
    if (await confirmToast(`Remove the box “${name}”?`)) {
      setBoxes(i, value[i].boxes.filter((_, k) => k !== b));
    }
  };

  return (
    <div className="job-sections-editor">
      {value.length === 0 && (
        <div className="jse-empty">
          <p>This job ad has no sections yet. Add your own, or start from the standard layout and adapt it.</p>
          <button type="button" className="row-action" onClick={() => onChange(standardLayout())}>
            Start from the standard layout
          </button>
        </div>
      )}

      {value.map((section, i) => {
        const label = section.title.trim() || `Section ${i + 1}`;
        return (
          <fieldset className="jse-section" key={section.key}>
            <legend>
              Section {i + 1}
              {section.title.trim() ? `: ${section.title.trim()}` : ''}
            </legend>
            <div className="jse-toolbar">
              <button type="button" className="row-action" onClick={() => onChange(move(value, i, -1))}
                      disabled={i === 0} aria-label={`Move section “${label}” up`}>↑ Up</button>
              <button type="button" className="row-action" onClick={() => onChange(move(value, i, 1))}
                      disabled={i === value.length - 1} aria-label={`Move section “${label}” down`}>↓ Down</button>
              <button type="button" className="row-action row-action--danger" onClick={() => void removeSection(i)}
                      aria-label={`Remove section “${label}”`}>Remove section</button>
            </div>
            <div className="jse-grid">
              <label>
                Section title *
                <input type="text" required maxLength={200} value={section.title}
                       onChange={(e) => setSection(i, { title: e.target.value })} />
              </label>
              <label>
                Subtitle
                <input type="text" maxLength={300} value={section.subtitle}
                       onChange={(e) => setSection(i, { subtitle: e.target.value })} />
              </label>
            </div>
            <LinesField label="Text" value={section.paragraphs} rows={3}
                        onChange={(paragraphs) => setSection(i, { paragraphs })}
                        hint="One paragraph per line. Optional." />

            {section.boxes.map((box, b) => {
              const boxLabel = box.title.trim() || `Box ${b + 1}`;
              return (
                <div className="jse-box" key={box.key}>
                  <div className="jse-toolbar">
                    <strong>Box {b + 1}</strong>
                    <button type="button" className="row-action" disabled={b === 0}
                            onClick={() => setBoxes(i, move(section.boxes, b, -1))}
                            aria-label={`Move box “${boxLabel}” up`}>↑ Up</button>
                    <button type="button" className="row-action" disabled={b === section.boxes.length - 1}
                            onClick={() => setBoxes(i, move(section.boxes, b, 1))}
                            aria-label={`Move box “${boxLabel}” down`}>↓ Down</button>
                    <button type="button" className="row-action row-action--danger"
                            onClick={() => void removeBox(i, b)} aria-label={`Remove box “${boxLabel}”`}>Remove box</button>
                  </div>
                  <label>
                    Box title *
                    <input type="text" required maxLength={200} value={box.title}
                           onChange={(e) => setBoxes(i, section.boxes.map((x, k) => (k === b ? { ...x, title: e.target.value } : x)))} />
                  </label>
                  <LinesField label="Bullet points" value={box.items} rows={4}
                              onChange={(items) => setBoxes(i, section.boxes.map((x, k) => (k === b ? { ...x, items } : x)))}
                              hint="One bullet per line. A box without bullets is not shown on the website." />
                </div>
              );
            })}
            <button type="button" className="row-action" aria-label={`Add a box to section “${label}”`}
                    onClick={() => setBoxes(i, [...section.boxes, { key: newKey(), title: '', items: [] }])}>
              + Add box
            </button>
          </fieldset>
        );
      })}

      <button type="button" className="btn btn--primary jse-add-section"
              onClick={() => onChange([...value, { key: newKey(), title: '', subtitle: '', paragraphs: [], boxes: [] }])}>
        + Add section
      </button>
    </div>
  );
}
