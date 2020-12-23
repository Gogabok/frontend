/**
 * Component who must handle app scroll events(like REACH_TOP, REACH_BOTTOM).
 */
interface ScrollOwner {
    /**
     * Name of component.
     */
    component: string;

    /**
     * Additional location data of this component when scroll state reset to
     * default. For example, id of conversation for MessagesList or list type
     * for ConversationList.
     */
    location?: any; // eslint-disable-line
}

export default ScrollOwner; // eslint-disable-line
