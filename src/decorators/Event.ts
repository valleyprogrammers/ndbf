import { Constants } from "../Constants";
import { CommandMeta } from "../structures/metadata/CommandMeta";
import { EventMeta } from "../structures/metadata/EventMetadata";

export const Event = (eventName: string) : ClassDecorator => {
	return (target: Function) => {
		Reflect.defineMetadata(Constants.REFLECT_KEY, {
			event: eventName
		} as EventMeta, target);
	};
}