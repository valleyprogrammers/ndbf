/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable quotes */
import "reflect-metadata";
import eris, { Client, EmbedField, Message } from "eris";
import { Container, Newable } from "./dependencies/container";
import { CommandExecutor } from "./structures/CommandExecutor";
import { EventExecutor } from "./structures/EventExecutor";
import { CommandMeta } from "./structures/metadata/CommandMeta";
import {parse, SuccessfulParsedMessage} from "./dependencies/command-parser";
import { CommandUtils } from "./utils/CommandUtils";
import { PermissionUtils } from "./utils/PermissionUtil";
import { Constants } from "./Constants";
import { EventMeta } from "./structures/metadata/EventMetadata";
import { Command } from "./decorators/Command";

/**
 * Options for the discord client
 */
export interface BotOptions {
	commands: Newable<CommandExecutor>[];
	events?: Newable<EventExecutor<any>>[];
	container?: Container;
	developers?: string[];
	logger?: Logger;
	prefix: string;
}

export interface Logger {
	warn(msg?: any): any;
	log(msg?: any): any;
	error(msg?: any): any;
}
type Dictionary<K> = {[key: string] : K};

export class Bot {
	public client: Client;
	public container: Container;
	private commands: Map<CommandMeta, CommandExecutor>;

	constructor(
		private token: string,
		private options: BotOptions
	) {
		this.client = eris(this.token);
		this.container = options.container || new Container();
		this.commands = new Map<CommandMeta, CommandExecutor>();
		if(!this.options.developers) this.options.developers = [];

		this.registerCommands();
		this.registerEvents();
	}

	private setupEvents() {
		this.client.on("messageCreate", async (message) => {
			if(message.author.bot || !message.content.startsWith(this.options.prefix)) return;

			const parsed = parse(message, this.options.prefix, {allowBots: false}) as SuccessfulParsedMessage;
			if (parsed.success) { //TODO: Move this to a file, this is here so I know what args the function needs. Don't know how long this will be relevant, discord will probably have some way to view commands when slash commnads are released.
				if(parsed.command === "help") {
					// const cmd = CommandUtils.findCommand(this.commands, { command: parsed.arguments[0] } as any) || { name : "Not Found", description: "Command not found!" };
					// await message.channel.createMessage({
					// 	embed: {
					// 		title: cmd.name,
					// 		description: cmd.description
					// 	}
					// });

					const helpFields: Dictionary<EmbedField> = {};
					for(const cmd of this.commands.keys()) {
						const category = cmd.category || "default";
						if(!helpFields[category!]) helpFields[category] = { name: category, value: "" };
						helpFields[category!].value += `${cmd.name}\n`;
					}

					await message.channel.createMessage({
						embed: {
							fields: Object.values(helpFields),
							title: "Help",
							description: "Help message"
						}
					});

					return;
				}
				
				const command = CommandUtils.findCommand(this.commands, parsed);
				if (!command) return;
				
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (command.developer === true && this.options.developers!.includes(message.author.id))
					return this.execCommand(command, message, parsed);

				if (
					message.member && // Make sure that the member object exists
					message.channel.type !== 1 && // Make sure it is not dms
					PermissionUtils.hasPerms(message, command.permissions) // check that the user has the permissions
				) return this.execCommand(command, message, parsed);
			}
		});
	}

	private execCommand(cmd: CommandMeta, msg: Message, parsed: SuccessfulParsedMessage) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const executor = this.commands.get(cmd)!;
		executor.execute({
			bot: this,
			msg,
			args:parsed
		});
	}

	private registerCommands() {
		for (const command of this.options.commands) {
			const meta = Reflect.getMetadata(Constants.REFLECT_KEY, command) as CommandMeta;
			if (!meta || !meta.name) {
				if (this.options.logger) this.options.logger.warn("Class without @Command decorator was passed");
				continue;
			}
			
			const executor = this.container.resolve(command) as CommandExecutor;
			this.commands.set(meta, executor);
		}

		this.setupEvents();
	}

	private registerEvents() {
		if(!this.options.events) return;
		for(const event of this.options.events) {
			const meta = Reflect.getMetadata(Constants.REFLECT_KEY, event) as EventMeta;
			if(!meta || !meta.event) {
				if (this.options.logger) this.options.logger.warn("Class without @Event decorator was passed");
				continue;
			}

			const executor = this.container.resolve(event) as EventExecutor<any>;
			this.client.on(meta.event, executor.execute);
		}	
	}

	public async start() : Promise<void> {
		return this.client.connect();
	}
}

export * from "./structures/CommandExecutor";
export * from "./structures/EventExecutor";
export * from "./structures/metadata/CommandMeta";
export * from "./structures/metadata/EventMetadata";
export * from "./decorators/Command";
export * from "./decorators/Event";
export * from "./dependencies/command-parser";
export * from "./dependencies/container";
export * from "./Constants";