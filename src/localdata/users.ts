import { UserPartial } from 'models/User.ts';
import { UserStatusCode } from 'models/UserStatus';

export const users: UserPartial[] = [
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-1',
        avatarPath: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
        gallery: [
            {
                id: 'pa-1',
                poster: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
                src: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
                type: 'image',
            },
        ],
        id: 'uid-andrey',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Andrey',
        num: '0000000000000001',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-2',
        avatarPath: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
        gallery: [
            {
                id: 'pa-2',
                poster: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
                src: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
                type: 'image',
            },
        ],
        id: 'uid-kirill',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Kirill',
        num: '0000000000000002',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-3',
        avatarPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
        gallery: [
            {
                id: 'pa-3',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
                src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
                type: 'image',
            },
        ],
        id: 'uid-roman',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Roman',
        num: '0000000000000003',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-4',
        avatarPath: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
        gallery: [
            {
                id: 'pa-4',
                poster: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
                src: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
                type: 'image',
            },
        ],
        id: 'uid-alexey',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Alexey',
        num: '0000000000000004',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Verstka group chat',
        avatarId: 'pa-5',
        avatarPath: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
        gallery: [
            {
                id: 'pa-5',
                poster: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
                src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
                type: 'image',
            },
        ],
        id: 'uid-verstka',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Verstka group chat',
        num: '0000000000000005',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'group',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-6',
        avatarPath: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
        gallery: [
            {
                id: 'pa-6',
                poster: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                src: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                type: 'image',
            },
        ],
        id: 'uid-egor',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Egor',
        num: '0000000000000006',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-7',
        avatarPath: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
        gallery: [
            {
                id: 'pa-7',
                poster: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                src: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                type: 'image',
            },
        ],
        id: 'uid-evgeniy',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Evgeniy',
        num: '0000000000000007',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-8',
        avatarPath: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
        gallery: [
            {
                id: 'pa-8',
                poster: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                src: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                type: 'image',
            },
        ],
        id: 'uid-vladislav',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Vladislav',
        num: '0000000000000008',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-9',
        avatarPath: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
        gallery: [
            {
                id: 'pa-9',
                poster: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                src: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                type: 'image',
            },
        ],
        id: 'uid-greg',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Greg',
        num: '0000000000000009',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-10',
        avatarPath: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
        gallery: [
            {
                id: 'pa-10',
                poster: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                src: 'https://proto-next-without-funds.front.soc.rev.t11913.org/img/example-avatar.jpg',
                type: 'image',
            },
        ],
        id: 'uid-alexandr',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Alexsandr',
        num: '0000000000000010',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
    {
        about: 'Text about me... Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex facere libero necessitatibus, nisi nulla obcaecati veniam veritatis! Consectetur consequatur error, expedita impedit ipsum laborum natus praesentium quasi quis similique velit?', // eslint-disable-line
        avatarId: 'pa-11',
        avatarPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
        gallery: [
            {
                id: 'pa-3',
                poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
                src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
                type: 'image',
            },
        ],
        id: 'uid-maria',
        lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
        name: 'Maria',
        num: '0000000000000011',
        status: {
            code: UserStatusCode.Online,
            description: null,
            title: 'Last visit information (by default)',
        },
        type: 'person',
        ver: '1',
    },
] as UserPartial[];
