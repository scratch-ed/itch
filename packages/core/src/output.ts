/**
 * Handle outputting. By default, all output is sent to stderr.
 *
 * @deprecated
 */
import { GroupedResultManager, Status } from './grouped-output';

/** @deprecated */
export class ResultManager {
  /** @deprecated */
  constructor(private readonly grouped: GroupedResultManager) {}

  /** @deprecated */
  startContext(description?: string): void {
    this.grouped.startGroup(description ?? 'Unnamed context');
  }

  /** @deprecated */
  closeContext(): void {
    this.grouped.closeGroup();
  }

  /** @deprecated */
  startTestcase(description?: string): void {
    this.grouped.startGroup(description ?? 'Testcase');
  }

  /** @deprecated */
  appendMessage(message: string): void {
    this.grouped.appendMessage(message);
  }

  /** @deprecated */
  escalateStatus(status: Status): void {
    this.grouped.escalateStatus(status);
  }
}
