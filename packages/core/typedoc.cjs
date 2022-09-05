module.exports = {
  entryPoints: ['./src/**'],
  out: 'dist/docs',
  pluginPages: {
    pages: [
      {
        title: 'Guides',
        children: [
          {
            title: "Getting started",
            source:'./index.md'
          }
        ]
      }
    ]
  }
};
