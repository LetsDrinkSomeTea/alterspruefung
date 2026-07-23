/**
 * A hand-rolled finite state machine governing the lifecycle of a page that
 * shows a date. States: idle → booting → computing → ready | error.
 * Because a `<div>` with `textContent` would not have looked good in the
 * architecture review.
 */
export type UiState = "idle" | "booting" | "computing" | "ready" | "error";
export type UiEvent =
  | { type: "BOOT" }
  | { type: "COMPUTE" }
  | { type: "RESOLVED" }
  | { type: "FAILED"; reason: string };

const TRANSITIONS: Record<UiState, Partial<Record<UiEvent["type"], UiState>>> = {
  idle: { BOOT: "booting" },
  booting: { COMPUTE: "computing", FAILED: "error" },
  computing: { RESOLVED: "ready", FAILED: "error" },
  ready: {},
  error: { BOOT: "booting" }
};

export class UiStateMachine {
  private current: UiState = "idle";
  private readonly listeners = new Set<(state: UiState) => void>();

  public get state(): UiState {
    return this.current;
  }

  public subscribe(listener: (state: UiState) => void): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  public dispatch(event: UiEvent): UiState {
    const next = TRANSITIONS[this.current][event.type];
    if (next && next !== this.current) {
      this.current = next;
      for (const listener of this.listeners) listener(this.current);
    }
    return this.current;
  }
}
