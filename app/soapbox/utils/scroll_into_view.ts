/**
 * Scrolls the list item at `index` into view and focuses it.
 *
 * Looks up the item by a `data-index` attribute rather than DOM position,
 * because list containers (ScrollableList/Ruisseau) virtualize their
 * children and prepend an internal spacer node, so a plain positional
 * lookup (`container.children[index]`) doesn't reliably point at the
 * right element.
 */
const scrollIntoViewAndFocus = (container: Element | null | undefined, index: number) => {
  const element = container?.querySelector<HTMLElement>(`[data-index="${index}"]`);
  element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  element?.focus();
};

export default scrollIntoViewAndFocus;
