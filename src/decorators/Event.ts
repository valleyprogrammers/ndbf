import { Constants } from "../Constants";
import { EventMeta } from "../structures/metadata/EventMetadata";

export const Event = (eventName: string) : ClassDecorator => {
	return (target) => {
		Reflect.defineMetadata(Constants.REFLECT_KEY, {
			event: eventName
		} as EventMeta, target);
	};
};