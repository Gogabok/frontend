import { Message } from 'models/Message';

export interface Dialog {
    messages: Message[];
    date: number;
}
