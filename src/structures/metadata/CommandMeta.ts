import { PermissionResolvable } from "../../utils/PermissionUtil";

export interface CommandMeta {
	name: string;
	description?: string;
	aliases?: string[];
	permissions?: PermissionResolvable[];
	category?: string;
}