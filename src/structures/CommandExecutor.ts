import { Bot } from "../index";
import { Message } from "eris";
import { SuccessfulParsedMessage } from "../dependencies/command-parser";

export interface CommandExecutorArgs {
	bot: Bot;
	msg: Message;
	args: SuccessfulParsedMessage;
}

export interface CommandExecutor {
	execute({ bot, msg, args }: CommandExecutorArgs): void | Promise<void>;
}