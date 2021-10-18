const configPath = '../../../config.json';
window.handleOut = (r) => console.debug(r);

fetch(configPath)
  .then((r) => r.json())
  .then(async (config) => {
    // Load test plan.
    const planPath = config.plan;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = planPath;
    script.async = false;
    script.onload = async () => {
      const template = await fetch(config.template).then((r) => r.arrayBuffer());
      const submission = await fetch(config.source).then((r) => r.arrayBuffer());

      const inputs = {
        submission: submission,
        template: template,
        canvas: document.getElementById('scratch-stage'),
        language: config.language || "nl"
      };

      // Hook up the output visualizer.
      init(document.getElementById('output'));

      // Main function of the Itch judge, exposed by the evaluation module.
      await window.run(inputs);
    };
    document.head.appendChild(script);
  });
