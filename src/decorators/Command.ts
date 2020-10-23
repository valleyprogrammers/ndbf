import { Constants } from "../Constants";
import { CommandMeta } from "../structures/metadata/CommandMeta";

export const Command = (name: string, meta?: Partial<CommandMeta>) : ClassDecorator => {
	return (target) => {
		Reflect.defineMetadata(Constants.REFLECT_KEY, {
			name,
			...meta
		} as CommandMeta, target);
	};
};