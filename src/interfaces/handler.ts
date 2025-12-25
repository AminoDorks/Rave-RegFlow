export interface Handler {
  handle(): Promise<void>;
}
