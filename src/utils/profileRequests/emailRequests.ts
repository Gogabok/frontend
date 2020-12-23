/**
 * Mock up send email verification code request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters
 * @param payload.email                 Email to be verified.
 * @param payload.code                  Verification code.
 */
export async function sendVerificationCode(payload: { //eslint-disable-line
    email: string,
    code: string,
}): Promise<boolean> {
    const res = await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 700),
    );
    return res.ok;
}

/**
 * Mock up delete email request.
 * TODO: Replace with server request.
 *
 * @param.payload                       Function parameters.
 * @param payload.email                 Email to be deleted.
 */
export async function deleteEmail(payload: { //eslint-disable-line
    email: string,
}): Promise<boolean> {
    // TODO: Put server request there.
    const res = await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 300),
    );
    return res.ok;
}

/**
 * Mock up change email publicity request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.email                 Email, publicity of which must be set.
 * @param payload.isPublic              Indicator whether email is public.
 */
export async function changeEmailPublicity(payload: { //eslint-disable-line
    email: string,
    isPublic: boolean,
}): Promise<boolean> {
    const res = await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 300),
    );
    return res.ok;
}

/**
 * Mock up add email request.
 * TODO: Replace with server request.
 *
 * @param payload                       Action parameters.
 * @param payload.email                 Email to be linked to account.
 * @param payload.id                    ID of the current user.
 */
export async function addEmail(payload: { //eslint-disable-line
    email: string,
    id: string,
}): Promise<boolean> {
    const res = await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    );
    return res.ok;
}

/**
 * Mock up check if email is taken request.
 * TODO: Replace with server request.
 *
 * @param payload                       Function parameters.
 * @param payload.email                 Email to be checked.
 */
export async function checkIfEmailIsTaken(payload: { //eslint-disable-line
    email: string,
}): Promise<boolean> {
    // TODO: Put server request there.
    return await new Promise<{ok: boolean}>(r =>
        setTimeout(() => r({ ok: true }), 1000),
    )
        .then(res => !res.ok)
        .catch(() => true);
}
