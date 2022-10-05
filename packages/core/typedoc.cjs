module.exports = {
  entryPoints: ['./src/**'],
  out: 'dist/docs',
  media: ['pages/media'],
  excludePrivate: true,
  excludeInternal: true,
  pluginPages: {
    pages: [
      {
        title: 'Guides',
        children: [
          {
            title: 'Getting started',
            source: './index.md',
          },
          {
            title: 'Introduction to testing',
            source: './introduction-to-testing.md',
          },
          {
            title: 'Tools for testplan authors',
            source: './tools-for-authors.md',
          },
          {
            title: 'Output format',
            source: './feedback.md',
          },
        ],
      },
    ],
  },
};
