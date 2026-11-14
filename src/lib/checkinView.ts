import type { Alert, Diagnosis, Estimate2027 } from '@/engine';
import type { Checkin } from '@/server/checkin';
export type CheckinView = Pick<Checkin, 'id' | 'asOf' | 'received' | 'expectedRestAfter' | 'result' | 'baseline'>;
export type CheckinReady = {
  kind: 'ready'; asOf: string; baselineVersion: string; since: string;
  adults: { id: 'a' | 'b'; label: string; seExpected: number; wagesExpected: number }[];
  diagnosis: Diagnosis; history: CheckinView[];
  schedule: { due: boolean; monthLabel: string; nextDate: string };
};
export type CheckinData = CheckinReady | { kind: 'empty' | 'locked' };
export type CheckinResult = { checkin: CheckinView; diagnosis: Diagnosis; alerts: Alert[]; replayed: boolean; baselineVersion: string };
export type EstimateView = Estimate2027 & { deferredToNextYear: number };
