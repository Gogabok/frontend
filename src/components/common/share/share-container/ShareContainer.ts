import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { formatUserNum } from 'utils/strings';

import { CurrentUser } from 'models/CurrentUser';
import { DataToShare } from 'models/DataToShare';

import UserModule from 'store/modules/user';

import { GET_USER_DATA } from 'store/modules/user/getters';

import StatusDropdown from 'components/common/status-dropdown/StatusDropdown.vue';

import ShareItem from './components/share-item/ShareItem.vue';


const userModule = namespace(UserModule.vuexName);

/**
 * Bottom menu share component.
 */
@Component({
    components: {
        'share-item': ShareItem,
        'status-dropdown': StatusDropdown,
    },
})
export default class ShareContainer extends Vue {
    /**
     * Indicator whether status dropdown is open.
     */
    public isStatusDropdownOpen = false;

    /**
     * Sets `isStatusDropdownOpen` state.
     *
     * @param isOpen                    State to be set.
     */
    public setStatusDropdownOpenState(isOpen: boolean): void {
        this.isStatusDropdownOpen = isOpen;
    }

    /**
     * Closes status dropdown.
     */
    public onStatusChange(): void {
        this.setStatusDropdownOpenState(false);
    }

    /**
     * Toggles status dropdown.
     */
    public onOpen(): void {
        this.setStatusDropdownOpenState(!this.isStatusDropdownOpen);
    }

    /**
     * User account information.
     */
    @userModule.Getter(GET_USER_DATA)
    public user: CurrentUser;

    /**
     * List of data items to be shared.
     */
    public get dataToShare(): DataToShare[] {
        return [
            {
                description: 'Gapopa ID является основным уникальным идентификатором Вашего аккаунта. Может использоваться для входа в систему. Может использоваться при отображении Вашего аккаунта другим пользователям.', // eslint-disable-line
                label: 'GapopaID',
                value: `&${formatUserNum(this.user.num)}`,
            },
            {
                description: 'Уникальный логин является дополнительным уникальным идентификатором Вашего аккаунта. Может использоваться для входа в систему. Может использоваться при отображении Вашего аккаунта другим пользователям.', // eslint-disable-line
                label: 'Login',
                value: this.user.login,
            },
            {
                description: 'Пользователи, пришедшие по прямой ссылке на чат, добавляются в Ваш список чатов автоматически. Они имеют возможность, независимо от настроек конфиденциальности:\n' + // eslint-disable-line
                    '\n' +
                    '- просматривать Ваш профиль,\n' +
                    '- отправлять Вам сообщения,\n' +
                    '- совершать звонки.\n' +
                    '\n' +
                    'После удаления чата, созданного по прямой ссылке на чат, применяются Ваши настройки конфиденциальности.', // eslint-disable-line
                label: 'Direct chat link',
                value: location.href,
            },
        ];
    }

    /**
     * Closes share component.
     *
     * @param e                         `mouse` | `touch` event.
     */
    public closeOutside(e: MouseEvent | TouchEvent): void {
        if (!this.$el.contains(e.target as Node)) {
            this.$emit('close-share');
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to set max available height of status
     * dropdown options list.
     */
    public mounted(): void {
        this.$nextTick(() => {
            const el = <HTMLElement>(<Vue>this.$refs.dropdown).$el;
            const dropdownSpacing = 15;
            const rootBottomPadding = 27;
            const height =  this.$el.getBoundingClientRect().bottom
                            - el.getBoundingClientRect().bottom
                            - dropdownSpacing
                            - rootBottomPadding;
            el.style.setProperty(
                '--max-options-list-height',
                `${height}px`,
            );
        });
    }
}
