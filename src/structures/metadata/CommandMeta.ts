import { Newable } from "../../dependencies/container";
import { PermissionResolvable } from "../../utils/PermissionUtil";
import { CommandExecutor } from "../CommandExecutor";

export interface CommandMeta {
	name: string;
	description?: string;
	aliases?: string[];
	permissions?: PermissionResolvable[];
	category?: string;
	developer?: boolean;
	subCommands?: Newable<CommandExecutor>[];
}