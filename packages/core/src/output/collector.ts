import { Diff, Group, Judgement, NestedGroup, Test, TestGroup } from './full-schema';
import {
  AppendDiff,
  AppendMessage,
  CloseGroup,
  CloseJudgement,
  CloseTest,
  EscalateStatus,
  StartGroup,
  StartJudgement,
  StartTest,
  Update,
} from './schema';

export class OutputCollector {
  private levelStack: Array<
    Array<Test | Group | AppendMessage | AppendDiff | EscalateStatus>
  > = [];

  private startCloseStack: Array<StartJudgement | StartGroup | StartTest> = [];

  public judgement?: Judgement;

  public handle(update: Update) {
    switch (update.command) {
      case 'start-judgement':
      case 'start-group':
      case 'start-test':
        this.startCloseStack.push(update);
        this.levelStack.push([]);
        break;
      case 'append-message':
      case 'append-diff':
      case 'escalate-status':
        this.currentLevel().push(update);
        break;
      case 'close-test': {
        const test = this.handleTestLevel(update);
        this.currentLevel().push(test);
        break;
      }
      case 'close-group': {
        const group = this.handleGroupLevel(update);
        this.currentLevel().push(group);
        break;
      }
      case 'close-judgement': {
        this.judgement = this.handleJudgementLevel(update);
        break;
      }
    }
  }

  private currentLevel() {
    return this.levelStack[this.levelStack.length - 1];
  }

  private handleTestLevel(finalUpdate: CloseTest): Test {
    const startUpdate = this.startCloseStack.pop()!;
    if (startUpdate.command !== 'start-test') {
      throw new Error(`Illegal update ${startUpdate} found in update stack.`);
    }

    const messages = [];
    let diff;
    let escalatedStatus;

    const levelObjects = this.levelStack.pop() as Array<
      AppendDiff | AppendMessage | EscalateStatus
    >;
    for (const levelObject of levelObjects!) {
      switch (levelObject.command) {
        case 'append-diff': {
          diff = new Diff(levelObject.expected, levelObject.actual);
          break;
        }
        case 'append-message': {
          messages.push(levelObject.message);
          break;
        }
        case 'escalate-status': {
          escalatedStatus = levelObject;
          break;
        }
        default: {
          throw new Error(`Illegal update ${levelObject} found in test level.`);
        }
      }
    }

    if (escalatedStatus) {
      this.currentLevel().push(escalatedStatus);
    }

    return new Test(
      startUpdate.name,
      escalatedStatus?.status || finalUpdate.status,
      finalUpdate.feedback,
      messages,
      diff,
    );
  }

  private handleGroupLevel(finalUpdate: CloseGroup): Group {
    const startUpdate = this.startCloseStack.pop()!;
    if (startUpdate.command !== 'start-group') {
      throw new Error(`Illegal update ${startUpdate} found in update stack.`);
    }

    const messages: string[] = [];
    const groups: Group[] = [];
    const tests: Test[] = [];
    let escalatedStatus;

    const levelObjects = this.levelStack.pop() as Array<
      AppendMessage | Test | Group | EscalateStatus
    >;
    for (const levelObject of levelObjects!) {
      if (levelObject instanceof Test) {
        tests.push(levelObject);
      } else if (levelObject instanceof NestedGroup || levelObject instanceof TestGroup) {
        groups.push(levelObject);
      } else if (levelObject.command === 'append-message') {
        messages.push(levelObject.message);
      } else if (levelObject.command === 'escalate-status') {
        escalatedStatus = levelObject;
      } else {
        throw new Error(`Illegal update ${levelObject} found in group level.`);
      }
    }

    if (escalatedStatus) {
      this.currentLevel().push(escalatedStatus);
    }

    if (tests.length > 0 && groups.length > 0) {
      throw new Error(`Cannot mix groups and tests as children of a group.`);
    }
    if (tests.length > 0) {
      return new TestGroup(
        tests,
        startUpdate.name,
        startUpdate.visibility,
        startUpdate.sprite,
        messages,
        escalatedStatus?.status,
        finalUpdate.summary,
      );
    } else {
      return new NestedGroup(
        groups,
        startUpdate.name,
        startUpdate.visibility,
        startUpdate.sprite,
        messages,
        escalatedStatus?.status,
        finalUpdate.summary,
      );
    }
  }

  private handleJudgementLevel(_update: CloseJudgement): Judgement {
    const startUpdate = this.startCloseStack.pop()!;
    if (startUpdate.command !== 'start-judgement') {
      throw new Error(`Illegal update ${startUpdate} found in update stack.`);
    }

    const messages: string[] = [];
    const groups: Group[] = [];
    let escalatedStatus;

    const levelObjects = this.levelStack.pop() as Array<
      AppendMessage | Group | EscalateStatus
    >;
    for (const levelObject of levelObjects!) {
      if (levelObject instanceof NestedGroup || levelObject instanceof TestGroup) {
        groups.push(levelObject);
      } else if (levelObject.command === 'append-message') {
        messages.push(levelObject.message);
      } else if (levelObject.command === 'escalate-status') {
        escalatedStatus = levelObject;
      } else {
        throw new Error(`Illegal update ${levelObject} found in judgement level.`);
      }
    }

    return new Judgement(groups, messages, escalatedStatus?.status);
  }
}
