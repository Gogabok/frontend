import rootGetters from 'store/root/getters';

/**
 * Vuex modules getter.
 */
const getters = {
    callGetters: import('./modules/call/getters'),
    chatsGetters: import('./modules/chats/getters'),
    contactsGetters: import('./modules/contacts/getters'),
    generalParametersGetters: import('./modules/general-parameters/getters'),
    notificationsGetters: import('./modules/notifications/getters'),
    popupGetters: import('./modules/popup/getters'),
    profileGetters: import('./modules/profile/getters'),
    userGetters: import('./modules/user/getters'),
    usersGetters: import('./modules/users/getters'),
};

/**
 * Vuex modules.
 */
const modules = {
    callModule: import('./modules/call/getters'),
    chatsModule: import('./modules/chats/getters'),
    contactsModule: import('./modules/contacts/getters'),
    generalParametersModule: import('./modules/general-parameters/getters'),
    notificationsModule: import('./modules/notifications'),
    popupModule: import('./modules/popup'),
    profileModule: import('./modules/profile/getters'),
    userModule: import('./modules/user/getters'),
    usersModule: import('./modules/users/getters'),
};

/**
 * Vuex modules getters, enhanced with related module name in the same format
 * as Vuex provides in the compiled store.
 */
const RootGettersObject = {
    ...(Object.keys(getters).map(gettersGroupName => {
        const _moduleName = gettersGroupName.replace('Getters', 'Module');
        const moduleName = modules[_moduleName].vuexName;
        return Object.fromEntries(
            Object.entries(getters[gettersGroupName])
                .map(([getterName, getter]) => [
                    `${moduleName}/${getterName}`,
                    getter,
                ]),
        );
    }))
        .reduce((_getters, gettersGroup) => ({
            ..._getters,
            ...gettersGroup,
        })),
    ...rootGetters,
};

/**
 * Vuex getters type.
 */
type RootGetters = keyof typeof RootGettersObject;


export default RootGetters;
