import rootState from 'store/root/state';

/**
 * Vuex modules states.
 */
const states = {
    callState: import('./modules/call/state'),
    chatsState: import('./modules/chats/state'),
    contactsState: import('./modules/contacts/state'),
    generalParametersState: import('./modules/general-parameters/state'),
    notificationsState: import('./modules/notifications/state'),
    popupState: import('./modules/popup/state'),
    profileState: import('./modules/profile/state'),
    userState: import('./modules/user/state'),
    usersState: import('./modules/users/state'),
};

/**
 * Vuex modules.
 */
const modules = {
    callModule: import('./modules/call'),
    chatsModule: import('./modules/chats'),
    contactsModule: import('./modules/contacts'),
    generalParametersModule: import('./modules/general-parameters'),
    notificationsModule: import('./modules/notifications'),
    popupModule: import('./modules/popup'),
    profileModule: import('./modules/profile'),
    userModule: import('./modules/user'),
    usersModule: import('./modules/users'),
};

/**
 * Vuex states collection in the same format as Vuex provides in compiled store.
 */
const VuexRootState = {
    ...Object.fromEntries(Object.entries(states).map(([stateName, state]) => {
        const name = stateName.replace('State', '');
        return [modules[`${name}Module`].vuexName, state];
    })),
    ...rootState,
};

/**
 * Vuex root state type.
 */
type VuexRootState = keyof typeof VuexRootState;

export default VuexRootState;
