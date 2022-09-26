const { executeTest } = require('./integration-runner.js');

describe('Laserjets level 5', () => {
  function execute(solution) {
    return executeTest('laserjets-level-5-template', solution, 'laserjets-level-5');
  }

  test('Correct solution is accepted', () => {
    return execute('laserjets-level-5-solution').then((result) => {
      expect(result).everyStatusToBe('correct');
      expect(result).toMatchSnapshot();
    });
  });

  test('Template is rejected', () => {
    return execute('laserjets-level-5-template').then((result) => {
      expect(result).exactStatuses('wrong', 16);
      expect(result).toMatchSnapshot();
    });
  });
});

describe('Agario', () => {
  function execute(solution) {
    return executeTest('agario-template', solution, 'agario');
  }

  test('Correct solution is accepted', () => {
    return execute('agario-solution').then((result) => {
      expect(result).everyStatusToBe('correct');
      expect(result).toMatchSnapshot();
    });
  });

  test('Switched block order in planet is accepted', () => {
    return execute('agario-solution-planet-order-keep').then((result) => {
      expect(result).everyStatusToBe('correct');
      expect(result).toMatchSnapshot();
    });
  });

  test('Template is rejected', () => {
    return execute('agario-template').then((result) => {
      expect(result).exactStatuses('wrong', 33);
      expect(result).toMatchSnapshot();
    });
  });

  test('No loop has one error', () => {
    return execute('agario-solution-no-loop-keep').then((result) => {
      expect(result).exactStatuses('wrong', 1);
      expect(result).toMatchSnapshot();
    });
  });

  test('Modified stack is detected', () => {
    return execute('agario-solution-modified-stack-keep').then((result) => {
      expect(result).exactStatuses('wrong', 1);
      expect(result).toMatchSnapshot();
    });
  });

  test('Deleted stack is detected', () => {
    return execute('agario-solution-removed-stack-keep').then((result) => {
      expect(result).exactStatuses('wrong', 1);
      expect(result).toMatchSnapshot();
    });
  });
});
