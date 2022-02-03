# Feedback

This document describes the output format of the judge. It is a high level
document; see below where to find more detailed documentation.

## Structure

There are three structural objects in the feedback:

- `Judgement` - the top level object.
- `Group` - groups one or more tests or subgroups. Note that the children of a
  group must either be all `Group`s or all `Test`s. A mix is not allowed.
- `Test` - one condition or test that is evaluated.

For example, the structure might look like this for a very simple test plan.
All 5 tests are in one group.

```yaml
# The judgement object
groups:
  - name: All tests
    tests:
      - Test 1
      - Test 2
      - Test 3
      - Test 4
      - Test 5
```

A more complex test plan might have subgroups of different levels. The first
2 tests are again in one group. The second group does not contain groups, but
contains other groups instead, which each have 3 tests.

```yaml
# The judgement object
groups:
  - name: Normal tests (group 1)
    tests:
      - Test 1
      - Test 2
  - name: Advanced tests (group 2)
    groups:
      - name: Group 2.1
        tests:
          - Test 3
          - Test 4
          - Test 5
      - name: Group 2.2
        tests:
          - Test 6
          - Test 7
          - Test 8
```

The format does not limit the amount of nesting, but of course very deeply
nested groups may not be practical.

## Visibility & collapsibility of groups

There are currently 3 visibility modes. From the docs:

- `show` means display this group.
- `summary` means display this group, collapse or hide the children by default, unless
  one of the tests in this group (or its subgroups) fails.
- `hide` means do not show the group by default, unless one of the tests in
  this group (or its subgroups) fails.

When counting tests, the recommended way is to always count all groups that are
visible. For example, groups with `show` and `summary` are both counted, while
groups with `hide` are only counted if displayed. This works the same for nested
groups. For example, assume we have the following structure of groups:

```yaml
groups:
  - name: Group 1
    visibility: 'show'
    groups:
      - name: Group 1.1
        visibility: 'summary'
      - name: Group 1.2
        visibility: 'hide'
```

Counting of tests should be done recursively, and on each level applying the
rules. Group 1 is thus visible, so the children are counted. In this case, the
children are groups, so the rules apply again. Group 1.1 is collapsed, but still
visible, so the tests are counted. Group 1.2 is hidden, so tests are only
counted if there was an error.

## Status propagation

TODO: this could be applied in the judge itself if easier.

Each test has a status. However, `Group` (and `Judgement`) objects can also have
an optional status override.

The status for a group is thus the status property if it exists. If none is
provided, the status of the group is the worst status of its children, again
calculated recursively. For example, a group's tests might all be OK, but if an
error occurred during testing, the group's status might be fail, while no
individual test is failed.

The order of "badness" of statuses is:

1. internal error (something unexpected went wrong)
2. testplan error (there is a bug in the test plan)
3. time limit exceeded (something took too long)
4. wrong (there is an error in the solution)
5. correct (the test passes)

For example, you have a group with three tests:

```yaml
- name: Test 1
  status: testplan error
- name: Test 2
  status: correct
- name: Test 3
  status: wrong
```

The status of this group would be `testplan error`, unless overridden by a
status attribute on the group itself.

## Detailed documentation

For ease of use, there is also a generated version committed in this folder.
There is also a full example in `schema.json`.

For more information about every attribute, you can do two things:

- Read the source & docs in `src/output/full-schema.ts`.
- Generate a JSON Schema file from that source code, using the following
  command, which will generate a JSON Schema on stdout:
  ```bash
  $ npm run generate:output
  ```

The reason the JSON Schema is generated from the source code is to ensure it is
(more) up to date, as it is very easy to forget to update a separate JSON Schema
document.

## Compatibility

The intention is that if a backwards incompatible change needs to be made, the
`version` attribute will be increased. This attribute can then be used to change
the behaviour of the code using the results if needed.

Note that code using these results should be built with forward compatibility in
mind. For example, unknown attributes or values should be ignored, rather than
erroring. For example, we might add a new visibility mode in the future.
Existing code should still do a best effort to accept the results, for example
by using a default visibility.
