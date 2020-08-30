import { Bot } from "../index";

export interface EventExecutor<T> {
	execute(bot: Bot, eventData: T): void | Promise<void>;
}