import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { CallStates } from 'models/Call';
import { Chat } from 'models/Chat';
import { User } from 'models/User';

import CallModule from 'store/modules/call';
import UsersModule from 'store/modules/users';

import {
    GET_CALL_STATE,
    GET_ROOM_ID,
    GET_USERS_AMOUNT,
} from 'store/modules/call/getters';
import { GET_USER_BY_CHAT_ID } from 'store/modules/users/getters';


const callModule = namespace(CallModule.vuexName);
const usersModule = namespace(UsersModule.vuexName);

/**
 * Component displaying call title and call subtitle.
 */
@Component
export default class CallInfo extends Vue {
    /**
     * Gets user by its chat ID.
     */
    @usersModule.Getter(GET_USER_BY_CHAT_ID)
    public getUserByChatId: (payload: {id: string}) => User;

    /**
     * Current call state.
     */
    @callModule.Getter(GET_CALL_STATE)
    public callState: CallStates;

    /**
     * ID of the call room.
     */
    @callModule.Getter(GET_ROOM_ID)
    public roomId: string;

    /**
     * Amount of active and total call participants.
     */
    @callModule.Getter(GET_USERS_AMOUNT)
    public usersAmountInfo: {active: number, total: number};

    /**
     * Caller information.
     */
    public get callerData(): User | Chat {
        return this.getUserByChatId({ id: this.roomId });
    }

    /**
     * Label to be displayed about the caller.
     */
    public get callTitle(): string {
        return this.callerData.name || this.callerData.num;
    }

    /**
     * Call subtitle (ex. amount of members in the conference).
     */
    public get subtitle(): string {
        return this.callState === CallStates.ACTIVE
            ? `${this.usersAmountInfo.active} of ${this.usersAmountInfo.total}`
            : '';
    }
}
