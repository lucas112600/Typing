type LogListener = (msg: string) => void;

let currentLog = "SYS_READY";
const listeners: Set<LogListener> = new Set();

export const SystemLogPubSub = {
  subscribe: (listener: LogListener) => {
    listeners.add(listener);
    listener(currentLog);
    return () => listeners.delete(listener);
  },
  publish: (msg: string) => {
    currentLog = msg;
    listeners.forEach((l) => l(currentLog));
  },
};
