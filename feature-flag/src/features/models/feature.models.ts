import { Document } from 'mongoose';

export interface Feature extends Document {
    readonly id_front: string;
    readonly enable: boolean;
    readonly visible: boolean;
    readonly host: string;
    readonly path: string;
    readonly method: string;
    readonly status: boolean;
}
