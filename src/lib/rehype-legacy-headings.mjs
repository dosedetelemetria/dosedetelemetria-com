import migration from '../data/blog-migration.json' with { type: 'json' };

export function rehypeLegacyHeadings() {
  return (tree, file) => {
    const post = migration.find(post => file.path?.endsWith(`/${post.slug}.md`));
    if (!post) return;
    let index = 0;
    function visit(node) {
      if (['h2', 'h3'].includes(node.tagName)) {
        const id = post.headingIds[index++];
        if (id) node.children.unshift({ type: 'element', tagName: 'span', properties: { id, ariaHidden: 'true', className: ['scroll-mt-24'] }, children: [] });
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
