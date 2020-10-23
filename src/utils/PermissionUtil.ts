/* eslint-disable indent */
import { Message } from "eris";

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
	| "MANAGE_EMOJIS"
	| "READ_MESSAGES";

//TODO: Fix this shit. Make a map or smth. 3am me was so dead I didnt even think to do that
const convertPerm = (perm: PermissionResolvable) : string => {
	switch (perm) {
		case "CREATE_INSTANT_INVITE":
			return "createInstantInvite";
		case "KICK_MEMBERS":
			return "kickMembers";
		case "BAN_MEMBERS":
			return "banMembers";
		case "ADMINISTRATOR":
			return "administrator";
		case "MANAGE_CHANNELS":
			return "manageChannels";
		case "MANAGE_GUILD":
			return "manageGuild";
		case "ADD_REACTIONS":
			return "addReactions";
		case "VIEW_AUDIT_LOG":
			return "viewAuditLogs";
		case "PRIORITY_SPEAKER":
			return "voicePrioritySpeaker";
		case "STREAM":
			return "stream";
		case "READ_MESSAGES":
			return "readMessages";
		case "SEND_MESSAGES":
			return "sendMessages";
		case "SEND_TTS_MESSAGES":
			return "sendTTSMessages";
		case "MANAGE_MESSAGES":
			return "manageMessages";
		case "EMBED_LINKS":
			return "embedLinks";
		case "ATTACH_FILES":
			return "attachFiles";
		case "READ_MESSAGE_HISTORY":
			return "readMessageHistory";
		case "MENTION_EVERYONE":
			return "mentionEveryone";
		case "USE_EXTERNAL_EMOJIS":
			return "externalEmojis";
		case "VIEW_GUILD_INSIGHTS":
			return "viewGuildAnalytics";
		case "CONNECT":
			return "voiceConnect";
		case "SPEAK":
			return "voiceSpeak";
		case "MUTE_MEMBERS":
			return "voiceMuteMembers";
		case "DEAFEN_MEMBERS":
			return "voiceDeafenMembers";
		case "MOVE_MEMBERS":
			return "voiceMoveMembers";
		case "USE_VAD":
			return "voiceUseVAD";
		case "CHANGE_NICKNAME":
			return "changeNickname";
		case "MANAGE_NICKNAMES":
			return "manageNicknames";
		case "MANAGE_ROLES":
			return "manageRoles";
		case "MANAGE_WEBHOOKS":
			return "manageWebhooks";
		case "MANAGE_EMOJIS":
			return "manageEmojis";
		default:
			return "";
	}
};

export class PermissionUtils {
	static hasPerm(message: Message, permission: PermissionResolvable): boolean {
		if(!message.member) return false;
		return message.member.permission.has(convertPerm(permission));
	}

	static hasPerms(message: Message, permissions?: PermissionResolvable[]): boolean {
		if(!message.member) return false;
		if(!permissions) return true;
		if(message.member.permission.has(convertPerm("ADMINISTRATOR"))) return true;

		const userPerms = new Map<PermissionResolvable, boolean>();

		for(const perm of permissions) {
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