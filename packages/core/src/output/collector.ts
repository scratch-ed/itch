import { Diff, Group, Judgement, Meta, Test } from './full-schema';
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
} from './partial-schema';

/**
 * Converts the partial output schema to the full output schema.
 */
export class OutputCollector {
  private levelStack: Array<
    Array<Test | Group | AppendMessage | AppendDiff | EscalateStatus>
  > = [];

  private startCloseStack: Array<StartJudgement | StartGroup | StartTest> = [];

  private meta = new Meta();

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
        this.meta.totalTests++;
        if (update.status === 'correct') {
          this.meta.correctTests++;
        }
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
      messages,
      finalUpdate.feedback,
      diff,
    );
  }

  private handleGroupLevel(finalUpdate: CloseGroup): Group {
    const startUpdate = this.startCloseStack.pop()!;
    if (startUpdate.command !== 'start-group') {
      throw new Error(`Illegal update ${startUpdate} found in update stack.`);
    }

    const messages: string[] = [];
    const children: Array<Group | Test> = [];
    let escalatedStatus;

    const levelObjects = this.levelStack.pop() as Array<
      AppendMessage | Test | Group | EscalateStatus
    >;
    for (const levelObject of levelObjects!) {
      if (levelObject instanceof Test || levelObject instanceof Group) {
        children.push(levelObject);
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

    return new Group(
      startUpdate.name,
      startUpdate.visibility,
      children,
      messages,
      startUpdate.sprite,
      escalatedStatus?.status,
      finalUpdate.summary,
    );
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
      if (levelObject instanceof Group) {
        groups.push(levelObject);
      } else if (levelObject.command === 'append-message') {
        messages.push(levelObject.message);
      } else if (levelObject.command === 'escalate-status') {
        escalatedStatus = levelObject;
      } else {
        throw new Error(`Illegal update ${levelObject} found in judgement level.`);
      }
    }

    return new Judgement(groups, messages, this.meta, escalatedStatus?.status);
  }
}
