import { Schema } from 'mongoose';

export const FeatureSchema = new Schema({
    id_front: String,
    enable: Boolean,
    visible: Boolean,
    host: String,
    path: String,
    method: String,
    status: Boolean
});