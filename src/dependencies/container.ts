export interface IContainer {
	add<T>(type: Newable<T>, value: T): void;
	get<T>(type: Newable<T>): T;
	resolve<T>(type: Newable<T>): T;
}

export interface Newable<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new(...args: any[]): T;
}

export type InjectMeta = Map<number, Newable<unknown>>;

export const metaKey = "Reflection:Container";

export const Inject = <T>(type: Newable<T>): ParameterDecorator => {
	return (target, propertyKey, parameterIndex) => {
		const meta = Reflect.getMetadata(metaKey, target) || new Map<number, Newable<T>>();
		meta.set(parameterIndex, type);
		Reflect.defineMetadata(metaKey, meta, target);
	};
};

export class Container implements IContainer {
	private container: Map<Newable<unknown>, unknown>;

	constructor() {
		this.container = new Map<Newable<unknown>, unknown>();
	}

	add<T>(type: Newable<T>, value?: T): T | undefined {
		this.container.set(type, value);
		return value;
	}

	get<T>(type: Newable<T>) : T{
		const value = this.container.get(type);
		return value as T;
	}

	resolve<T>(type: Newable<T>): T {
		const meta = Reflect.getMetadata(metaKey, type) as InjectMeta;
		const args = [];
		
		if(!meta) return new type();

		for(const [key, val] of meta) {
			args[key] = this.get(val);
		}
		
		return new type(...args);
	}
}