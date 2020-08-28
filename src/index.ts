import "reflect-metadata";
import eris, { Client } from "eris";
import { Container, Newable } from "./dependencies/container";
import { CommandExecutor } from "./structures/CommandExecutor";
import { EventExecutor } from "./structures/EventExecutor";
import { createLogger, Logger } from "winston";
import { CommandMeta } from "./structures/metadata/CommandMeta";
import {parse, SuccessfulParsedMessage} from "./dependencies/command-parser";
import { CommandUtils } from "./utils/CommandUtils";
import { PermissionUtils } from "./utils/PermissionUtil";
import { Constants } from "./Constants";

/**
 * Options for the discord client
 */
export interface BotOptions {
	commands: Newable<CommandExecutor>[];
	events?: Newable<EventExecutor<any>>;
	container?: Container;
	logger?: Logger;
	prefix: string;
}

export class Bot {
	private client: Client;
	public container: Container;
	private logger: Logger;
	private commands: Map<CommandMeta, CommandExecutor>;

	constructor(
		private token: string,
		private options: BotOptions
	) {
		this.client = eris(this.token);
		this.container = options.container || new Container();
		this.logger = options.logger || createLogger();
		this.commands = new Map<CommandMeta, CommandExecutor>();

		this.setupCommands();
		this.setupEvents();	
	}

	private setupEvents() {
		this.client.on("messageCreate", (message) => {
			if(message.author.bot || !message.content.startsWith(this.options.prefix)) return;

			let parsed = parse(message, this.options.prefix, {"allowSelf": true});

			if(parsed.success) {
				parsed = parsed as SuccessfulParsedMessage;
				const command = CommandUtils.findCommand(this.commands, parsed);
				if(!command) return;

				if(
					command.permissions && // Check if the command has permissions set
					message.member && // Make sure that the member object exists
					!(message.channel.type === 3) && // Make sure it is not dms
					!PermissionUtils.hasPerms(message, command.permissions) // check that the user has the permissions
				) return;

				const executor = this.commands.get(command)!;
				executor.execute(this, message, parsed);
			}
		});
	}

	private setupCommands() {
		for(let command of this.options.commands) {			
			const meta = Reflect.getMetadata(Constants.REFLECT_KEY, command) as CommandMeta;
			if(!meta || !meta.name) {
				this.logger.warn("Class without @Command decorator was passed");
				continue;
			}
			
			const executor = this.container.resolve(command) as CommandExecutor;
			this.commands.set(meta, executor);
		}
	}
}
