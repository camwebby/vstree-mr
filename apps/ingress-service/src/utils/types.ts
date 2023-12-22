export type HandleAction = "discard" | "retry";

type ScrapeError = {
  errMessage: string;
  handleAction: HandleAction;
};

export type ScrapeErr = ScrapeError | void;
