function testStatuses(result) {
  return result
    .map((obj) => obj.status?.enum)
    .filter((status) => status !== undefined);
}

expect.extend({
  everyStatusToBe(result, expected) {
    const statuses = testStatuses(result);
    const correct = statuses.every((s) => s === expected);
    return {
      message: () =>
        `expected every test status to be ${expected}, got ${statuses}`,
      pass: correct,
    };
  },
  atLeastStatuses(result, expected, amount) {
    const statuses = testStatuses(result);
    const filtered = statuses.filter((status) => {
      if (amount !== undefined) {
        return status === expected;
      } else {
        return true;
      }
    });
    let message;
    if (amount === undefined) {
      message = `expected at least ${expected} statuses, got ${filtered.length}`;
    } else {
      message = `expected at least ${amount} statuses of type ${expected}, got ${filtered.length}`;
    }
    let pass;
    if (amount === undefined) {
      pass = filtered.length >= expected;
    } else {
      pass = filtered.length >= amount;
    }
    return {
      message: () => message,
      pass: pass,
    };
  },
  exactStatuses(result, expected, amount) {
    const statuses = testStatuses(result);
    const filtered = statuses.filter((status) => {
      if (amount !== undefined) {
        return status === expected;
      } else {
        return true;
      }
    });
    let message;
    if (amount === undefined) {
      message = `expected exactly ${expected} statuses, got ${filtered.length}`;
    } else {
      message = `expected exactly ${amount} statuses of type ${expected}, got ${filtered.length}`;
    }
    let pass;
    if (amount === undefined) {
      pass = filtered.length === expected;
    } else {
      pass = filtered.length === amount;
    }
    return {
      message: () => message,
      pass: pass,
    };
  },
  atLeastCommands(result, command, amount) {
    const am = result.filter((obj) => obj.command === command).length;
    return {
      message: () => `expected >= ${amount} commands ${command}, got ${am}`,
      pass: am >= amount,
    };
  },
});

module.exports = {
  testStatuses,
};
