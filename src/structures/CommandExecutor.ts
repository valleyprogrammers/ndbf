import { Bot } from "../index";
import { Message } from "eris";
import { SuccessfulParsedMessage } from "../dependencies/command-parser";

export interface CommandExecutor {
	execute(bot: Bot, message: Message, parsed: SuccessfulParsedMessage): void | Promise<void>;
}