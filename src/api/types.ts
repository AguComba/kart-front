export type Track = {
  id: string;
  name: string;
  location?: string;
};

export type TireSet = {
  id: string;
  name: string;
  compound?: string;
  notes?: string;
};

export type KartSetup = {
  id: string;
  name: string;
  description?: string;
};

export type Stint = {
  id: string;
  stintNumber: number;
  gearRatio: {
    crown: number;
    pinion: number;
  };
  tireSetId?: string;
  tireSetName?: string;
  kartSetupId?: string;
  kartSetupName?: string;
  bestLapMs?: number;
  notes?: string;
};

export type SessionDay = {
  id: string;
  date: string;
  trackId: string;
  trackName: string;
  trackState?: string;
  grip?: string;
  ambientTemp?: number;
  trackTemp?: number;
  notes?: string;
  stintsCount?: number;
};

export type SessionDayDetail = SessionDay & {
  stints: Stint[];
};
