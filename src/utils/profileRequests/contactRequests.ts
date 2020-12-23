/**
 * Mock up change contact name request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.targetId              ID of the contact to be renamed.
 * @param payload.name                  New name of the contact.
 * @param payload.id                    ID of the current user.
 */
export async function changeContactName(payload: { //eslint-disable-line
    id: string,
    targetId: string,
    name: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up add user to contacts list request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.targetId              ID of the user to be added to contacts.
 */
export async function addToContactsList(payload: { //eslint-disable-line
    id: string,
    targetId: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up set contact favorite request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.isFavorite            Indicator whether contact is favorite.
 * @param payload.targetId              ID of the user favorite state of which
 *                                      must be set.
 */
export async function setContactFavState(payload: { //eslint-disable-line
    id: string,
    isFavorite: boolean,
    targetId: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up remove user from contacts list request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.targetId              ID of the user to be removed from
 *                                      contacts list.
 */
export async function removeFromContactsList(payload: { //eslint-disable-line
    id: string,
    targetId: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up block user request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.isBlocked             Indicator whether user is blocked.
 * @param payload.targetId              ID of the user to be blocked/unblocked.
 */
export async function blockUser(payload: { //eslint-disable-line
    id: string,
    targetId: string,
    isBlocked: boolean,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}
