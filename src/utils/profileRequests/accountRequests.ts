import { UserStatus } from 'models/UserStatus';


/**
 * Mock up check if login is taken request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.login                 Login to be checked.
 */
export async function checkIfLoginIsTaken(payload: { //eslint-disable-line
    login: string,
}): Promise<boolean> {
    return await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    )
        .then(res => !res.ok)
        .catch(() => true);
}

/**
 * Mock up change status request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.status                New status to be set.
 */
export async function changeStatus(payload: { // eslint-disable-line
    id: string,
    status: UserStatus,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up change login request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.login                 New login to be set.
 */
export async function changeLogin(payload: { //eslint-disable-line
    id: string,
    login: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up change avatar request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the chat/user avatar of which
 *                                      should be changed.
 * @param payload.imageData             New avatar image data.
 */
export async function changeAvatar(payload: { //eslint-disable-line
    id: string,
    imageData: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up change name request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.name                  New name to be set.
 */
export async function changeName(payload: { //eslint-disable-line
    id: string,
    name: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up change about data of the user request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.about                 New about data to be set.
 */
export async function changeAbout(payload: { //eslint-disable-line
    id: string,
    about: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up check if entered password is valid request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.password              Password validity if which should be
 *                                      checked.
 */
export async function checkPassword(payload: { //eslint-disable-line
    id: string,
    password: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up change password request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.password              New password to be set.
 * @param payload.id                    ID of the user to be modified.
 */
export async function changePassword(payload: { //eslint-disable-line
    id: string,
    password: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: false }), 1000),
    );
    return res.ok;
}

/**
 * Mock up set password request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 * @param payload.password              Password to be set.
 */
export async function setPassword(payload: { //eslint-disable-line
    id: string,
    password: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up delete account request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.id                    ID of the current user.
 */
export async function deleteAccount(payload: { //eslint-disable-line
    id: string,
}): Promise<boolean> {
    const res = await new Promise<{ ok: boolean }>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}
