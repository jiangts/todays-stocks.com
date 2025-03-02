import { ObjectId } from 'mongodb';

export interface StrategySubscription {
  userId: ObjectId | string;
  strategyId: ObjectId | string;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
