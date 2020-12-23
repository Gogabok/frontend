import { Jason, MediaStreamSettings } from 'medea-jason';

import { CameraType, DeviceTypeAsString, MediaDeviceType } from 'models/Call';
import { MediaCaptureDevice } from 'models/MediaCaptureDevice';


const base_url: string = process.env.VUE_ENV === 'server'
    ? process.env.MEDEA_HOST as string
    : `${document.location.protocol}//${document.location.hostname}`;

/**
 * Address of the control api server.
 */
export const controlUrl =`${base_url}/medea-control-mock/control-api/`;

/**
 * Controls server domain.
 */
export const controlDomain = 'http://127.0.0.1:8000';

const protocol = base_url.split('://')[0].includes('s')
    ? 'wss'
    : 'ws';

/**
 * Socket base url.
 */
export const baseUrl =`${protocol}://${base_url.split('://').pop()}/medea/ws/`;

/**
 * Gets list of all available video and audio devices.
 *
 * @param jason                         Medea client.
 */
export async function get_devices_list(jason: Jason): Promise<{
    audioDevices: MediaCaptureDevice[],
    videoDevices: MediaCaptureDevice[],
}> {
    const devices_info: Array<InputDeviceInfo & {
        label: () => string,
        kind: () => MediaDeviceType,
        device_id: () => string,
    }> = await jason
        .media_manager()
        .enumerate_devices();

    const devices: {
        audioDevices: MediaCaptureDevice[],
        videoDevices: MediaCaptureDevice[],
    } = {
        audioDevices: [],
        videoDevices: [],
    };

    const getLabel = (type) => {
        const typeLabel = type === MediaDeviceType.Audio
            ? 'Microphone'
            : 'Camera';

        const number = devices[`${type}Devices`].length as number + 1;

        return `${typeLabel} ${number}`;
    };

    for (const device_info of devices_info) {
        const label = device_info.label()
            || getLabel(DeviceTypeAsString[device_info.kind()]);

        devices[`${DeviceTypeAsString[device_info.kind()]}Devices`].push({
            id: device_info.device_id(),
            isSelected: device_info.device_id() === 'default',
            label,
        });
    }

    const guaranteeActiveDevice = (type) => {
        if(!devices[`${type}Devices`].find(d => d.isSelected)) {
            devices[`${type}Devices`][0].isSelected = true;
        }
    };

    guaranteeActiveDevice(MediaDeviceType.Audio);
    guaranteeActiveDevice(MediaDeviceType.Video);

    const screenOption = {
        id: 'screen',
        isSelected: false,
        label: 'screen',
    };

    if('mediaDevices' in navigator
        && 'getDisplayMedia' in navigator.mediaDevices
    ) {
        devices.videoDevices.push(screenOption);
    }


    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { exact: 'user' },
            },
        }) as unknown as MediaStream;

        const id = stream.getVideoTracks()[0].id;
        const frontDevice = devices.videoDevices.find(
            device => device.id === id,
        );

        stream.getTracks().forEach((track) => {
            track.stop();
        });
        if(!frontDevice) return devices;

        frontDevice.id = CameraType.Front;


        const backDevice = devices.videoDevices.find(
            device => device.id !== CameraType.Front
                && device.id !== CameraType.Screen,
        );
        if(!backDevice) return devices;

        backDevice.id = CameraType.Back;
        return devices;
    } catch(e) {
        console.log('this device has no frontal camera');
        return devices;
    }
}


/** Gets audio and video devices to use during the call.
 *
 * @param rust                          Rust medea module.
 * @param audioDevices                  List of available audio devices.
 * @param videoDevices                  List of available video devices.
 * @param options                       Additional build options.
 */
export async function build_constraints(
    rust,  // eslint-disable-line
    audioDevices: MediaCaptureDevice[] | null,
    videoDevices: MediaCaptureDevice[] | null,
    options: {
        ignoreScreenSharing: boolean,
    } = {
        ignoreScreenSharing: false,
    },
): Promise<MediaStreamSettings> {
    const constraints = new rust.MediaStreamSettings();
    if (audioDevices != null) {
        const audio = new rust.AudioTrackConstraints();

        const audioSource = audioDevices.find(device => device.isSelected);
        if (audioSource) {
            audio.device_id(audioSource.id);
        }
        constraints.audio(audio);
    }

    if (videoDevices === null) return constraints;

    const screenOption = videoDevices.find(device => device.id === 'screen');

    if(screenOption !== null && !options.ignoreScreenSharing) {
        constraints.display_video(new rust.DisplayVideoTrackConstraints());
    }


    const videoSource = videoDevices.find(device => device.isSelected);
        if (videoSource) {
        const video = new rust.DeviceVideoTrackConstraints();
        if (videoSource.id === CameraType.Front) {
            video.exact_facing_mode(rust.FacingMode.User);
        } else if (videoSource.id === CameraType.Back) {
            video.exact_facing_mode(rust.FacingMode.Environment);
        } else {
            video.device_id(videoSource.id);
        }
        constraints.device_video(video);
    } else {
        constraints.device_video(new rust.DeviceVideoTrackConstraints());
    }

    return constraints;
}

/**
 * Created publish point for current user and send is to other participants.
 *
 * @param roomId                        ID of the room to start translating to.
 * @param clientId                      User ID.
 */
export async function startPublishing(
    roomId: string,
    clientId: string,
): Promise<void> {
    type IRoomSpec = {
        element: {
            pipeline: Record<string, { id: string }>,
        },
    };

    const roomSpec: IRoomSpec = await controlApi.get(
        roomId,
        '',
        '',
    ) as unknown as IRoomSpec;

    const anotherMembers: Array<{ id: string }> =
        Object.values(roomSpec.element.pipeline);

    const membersToConnect: string[] = [];
    anotherMembers.forEach((anotherMember) => {
        if (anotherMember.id != clientId) {
            membersToConnect.push(anotherMember.id);
        }
    });

    const publishEndpoint = {
        kind: 'WebRtcPublishEndpoint',
        p2p: 'Always',
    };
    const isSuccess = await controlApi.createEndpoint(
        roomId,
        clientId,
        'publish',
        publishEndpoint,
    );

    if (!isSuccess) return;

    await membersToConnect.forEach((srcMemberId: string) => {
        controlApi.createEndpoint(
            roomId,
            srcMemberId,
            `play-${clientId}`,
            {
                force_relay: false,
                kind: 'WebRtcPlayEndpoint',
                src: `local://${roomId}/${clientId}/publish`,
            },
        );
    });
}

/**
 * Creates new call room.
 *
 * @param roomId                        ID of the room to be created.
 * @param userId                        ID of the user that creates the room.
 */
export async function createRoom(
    roomId: string,
    userId: string,
): Promise<string> {
    const body = {
        kind: 'Room',
        pipeline: {
            [userId]: {
                credentials: 'test',
                kind: 'Member',
                on_join: 'grpc://127.0.0.1:9099',
                on_leave: 'grpc://127.0.0.1:9099',
                pipeline: {
                    publish: {
                        audio_settings: {
                            publish_policy: 'Optional',
                        },
                        force_relay: false,
                        kind: 'WebRtcPublishEndpoint',
                        p2p: 'Always',
                        video_settings: {
                            publish_policy: 'Optional',
                        },
                    },
                },
            },
        },
    };

    const res = await fetch(
        `${controlUrl}${roomId}`,
        {
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        },
    )
        .then(res => res.json())
        .catch(e => console.error('Fetch error: ', e));

    return res.sids[userId];
}

/**
 * Creates call participants in call room.
 *
 * @param roomId                        ID for the room to create user at.
 * @param memberId                      ID of the user to be created.
 */
export async function createMember(
    roomId: string,
    memberId: string,
): Promise<string> {
    const controlRoom = await
        fetch(`${controlUrl}${roomId}`)
            .then(res => res.json());
    const anotherMembers: Array<{ id, pipeline }> =
        Object.values(controlRoom.element.pipeline);
    const pipeline = {
        publish: {
            audio_settings: {
                publish_policy: 'Optional',
            },
            force_relay: false,
            kind: 'WebRtcPublishEndpoint',
            p2p: 'Always',
            video_settings: {
                publish_policy: 'Optional',
            },
        },
    };

    const memberIds: string[] = [];
    for (let i = 0; i < anotherMembers.length; i++) {
        const memberId: string = anotherMembers[i].id;
        memberIds.push(memberId);
        if (anotherMembers[i].pipeline.hasOwnProperty('publish')) { //eslint-disable-line
            pipeline[`play-${memberId}`] = {
                force_relay: false,
                kind: 'WebRtcPlayEndpoint',
                src: `local://${roomId}/${memberId}/publish`,
            };
        }
    }

    const resp = await fetch(`${controlUrl}${roomId}/${memberId}`,{
        body: JSON.stringify({
            credentials: 'test',
            kind: 'Member',
            on_join: 'grpc://127.0.0.1:9099',
            on_leave: 'grpc://127.0.0.1:9099',
            pipeline: pipeline,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(res => res.json());

    try {
        for (let i = 0; i < memberIds.length; i++) {
            const id = memberIds[i];
            await fetch(`${controlUrl}${roomId}/${id}/play-${memberId}`,{
                body: JSON.stringify({
                    force_relay: false,
                    kind: 'WebRtcPlayEndpoint',
                    src: `local://${roomId}/${memberId}/publish`,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        }

    } catch (e) {
        console.log(
            'Error caught on jason.ts createMember :153\n',
            e.response,
        );
    }

    return resp.sids[memberId];
}

/**
 * Control API calls.
 */
export const controlApi = {
    /**
     * Creates WebRTC endpoint.
     *
     * @param roomId                    ID of the room to create endpoint at.
     * @param memberId                  ID of the member to create endpoint for.
     * @param endpointId                Endpoint ID.
     * @param spec                      Endpoint information.
     */
    createEndpoint: async function(
        roomId: string,
        memberId: string,
        endpointId: string,
        spec: Record<string, unknown>,
    ): Promise<boolean> {
        try {
            await fetch(`${controlUrl}${roomId}/${memberId}/${endpointId}`,{
                body: JSON.stringify(spec),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            return true;
        } catch (e) {
            alert(JSON.stringify(e.response.data));

            return false;
        }
    },

    /**
     * Creates member.
     *
     * @param roomId                    ID of the room to create member at.
     * @param memberId                  ID of the user to create.
     * @param spec                      User information.
     */
    createMember: async function(
        roomId: string,
        memberId: string,
        spec: Record<string, unknown>,
    ): Promise<void> {
        spec.kind = 'Member';
        spec.pipeline = {};

        try {
            await fetch(`${controlUrl}${roomId}/${memberId}` ,{
                body: JSON.stringify(spec),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        } catch (e) {
            alert(JSON.stringify(e.response.data));
        }
    },

    /**
     * Creates call room.
     *
     * @param roomId                    ID of the room to create.
     */
    createRoom: async function(roomId: string): Promise<void> {
        try {
            await fetch(`${controlUrl}${roomId}`, {
                body: JSON.stringify({
                    kind: 'Room',
                    pipeline: {},
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        } catch (e) {
            alert(JSON.stringify(e.response.data));
        }
    },

    /**
     * Deletes the room/member/memberEndpoint
     *
     * @param roomId                    ID of the room to remove, or to remove
     *                                  something in.
     * @param memberId(optional)        ID of the member to remove or remove
     *                                  endpoint of.
     * @param endpointId(optional)      ID of the endpoint to remove.
     */
    delete: async function(
        roomId: string,
        memberId?: string,
        endpointId?: string,
    ): Promise<undefined | string> {
        try {
            const url =
                controlApi.getUrlForElement(roomId, memberId, endpointId);
            const res = await fetch(url, {
                method: 'DELETE',
            }).then(res => res.json());
            return JSON.stringify(res.data, null, 4);
        } catch (e) {
            alert(JSON.stringify(e.response.data));
            return undefined;
        }
    },

    /**
     * Gets information about room/member/endpoint
     *
     * @param roomId                    ID of the room to get info of, or to get
     *                                  info about something in.
     * @param memberId(optional)        ID of the member to get info of, or to
     *                                  get endpoint info of.
     * @param endpointId(optional)      ID of the endpoint to get info of.
     */
    get: async function(
        roomId: string,
        memberId: string = '',
        endpointId: string = '',
    ): Promise<void> {
        try {
            const url =
                controlApi.getUrlForElement(roomId, memberId, endpointId);
            const resp = await fetch(url).then(res => res.json());
            return resp.data;
        } catch (e) {
            alert(JSON.stringify(e.response.data));
        }
    },

    /**
     * Gets callbacks.
     */
    getCallbacks: async function(): Promise<void> {
        try {
            const res = await fetch(
                controlDomain + '/callbacks',
            )
                .then(res => res.json());
            return res.data;
        } catch (e) {
            alert(JSON.stringify(e.response.data));
        }
    },

    /**
     * Creates url based on provided data.
     *
     * @param roomId                    ID of the room to interact with.
     * @param memberId(optional)        ID of the member to interact with.
     * @param endpointId(optional)      ID of the endpoint to interact with.
     */
    getUrlForElement: function(
        roomId: string,
        memberId: string = '',
        endpointId: string = '',
    ): string {
        let url = `${controlUrl}${roomId}`;
        if (memberId.length > 0 && endpointId.length > 0) {
            url = `${controlUrl}${roomId}/${memberId}/${endpointId}`;
        } else if (memberId.length > 0) {
            url = `${controlUrl}${roomId}/${memberId}`;
        }

        return url;
    },
};
