import { Message, Member, GuildChannel, Permission } from "eris";

export type PermissionResolvable =
	| "CREATE_INSTANT_INVITE"
	| "KICK_MEMBERS"
	| "BAN_MEMBERS"
	| "ADMINISTRATOR"
	| "MANAGE_CHANNELS"
	| "MANAGE_GUILD"
	| "ADD_REACTIONS"
	| "VIEW_AUDIT_LOG"
	| "PRIORITY_SPEAKER"
	| "STREAM"
	| "VIEW_CHANNEL"
	| "SEND_MESSAGES"
	| "SEND_TTS_MESSAGES"
	| "MANAGE_MESSAGES"
	| "EMBED_LINKS"
	| "ATTACH_FILES"
	| "READ_MESSAGE_HISTORY"
	| "MENTION_EVERYONE"
	| "USE_EXTERNAL_EMOJIS"
	| "VIEW_GUILD_INSIGHTS"
	| "CONNECT"
	| "SPEAK"
	| "MUTE_MEMBERS"
	| "DEAFEN_MEMBERS"
	| "MOVE_MEMBERS"
	| "USE_VAD"
	| "CHANGE_NICKNAME"
	| "MANAGE_NICKNAMES"
	| "MANAGE_ROLES"
	| "MANAGE_WEBHOOKS"
	| "MANAGE_EMOJIS";

export class PermissionUtils {
	static hasPerm(message: Message, permission: PermissionResolvable): boolean {
		if(!message.member) return false;
		return message.member.permission.has(permission);
	};

	static hasPerms(message: Message, permissions: PermissionResolvable[]): boolean {
		let userPerms = new Map<PermissionResolvable, boolean>();

		for(let perm of permissions) {
			if(!perm) continue;

			const hasPerm = this.hasPerm(message, perm);

			if(hasPerm) userPerms.set(perm, true);
			else userPerms.set(perm, false);
		}

		const values = userPerms.values();
		if(Array.from(values).includes(false)) return false;
		return true;
	}
}