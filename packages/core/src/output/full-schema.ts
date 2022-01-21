import { Status, Visibility } from './schema';

export class Diff {
  constructor(public readonly expected: string, public readonly actual: string) {}
}

export class Test {
  constructor(
    public readonly name: string,
    public readonly status: Status,
    public readonly feedback: string,
    public readonly messages?: string[],
    public readonly diff?: Diff,
  ) {}
}

class BasicGroup {
  constructor(
    public readonly name: string,
    public readonly visibility: Visibility,
    public readonly sprite?: string,
    public readonly messages?: string[],
    public readonly status?: Status,
    public readonly summary?: string,
  ) {}
}

export class NestedGroup extends BasicGroup {
  constructor(
    public readonly groups: Group[],
    name: string,
    visibility: Visibility,
    sprite?: string,
    messages?: string[],
    status?: Status,
    summary?: string,
  ) {
    super(name, visibility, sprite, messages, status, summary);
  }
}

export class TestGroup extends BasicGroup {
  constructor(
    public readonly tests: Test[],
    name: string,
    visibility: Visibility,
    sprite?: string,
    messages?: string[],
    status?: Status,
    summary?: string,
  ) {
    super(name, visibility, sprite, messages, status, summary);
  }

  get groups(): Test[] {
    return this.tests;
  }
}

export type Group = NestedGroup | TestGroup;

export class Judgement {
  public readonly version = 2;

  constructor(
    public readonly groups: Group[],
    public readonly messages: string[],
    public readonly status?: Status,
  ) {}
}
