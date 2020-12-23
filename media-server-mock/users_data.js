/**
 * Hardcoded list of users (will be removed on authorisation added).
 */
const usersData = [
  {
    about: 'Verstka group chat',
    avatarPath: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
    gallery: [
      {
        id: 'pa-5',
        poster: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
        src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/the-mandalorian-chapter-2-disney-plus-1585132856.jpeg?crop=1xw:0.8886255924170616xh;center,top&resize=1200:*',
        type: 'image'
      }
    ],
    id: 'uid-verstka',
    lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
    name: 'Verstka group chat',
    num: '00000005',
    status: {
      code: 'is-online',
      description: null,
      title: 'Last visit information (by default)'
    },
    type: 'group',
    ver: '1'
  },
  {
    about: '',
    avatarPath: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    gallery: [
      {
        id: 'pa-1',
        poster: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
        src: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
        type: 'image'
      }
    ],
    id: 'uid-andrey',
    lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
    name: 'Andrey',
    num: '00000001',
    status: {
      code: 'is-online',
      description: null,
      title: 'Last visit information (by default)'
    },
    type: 'person',
    ver: '1'
  },
  {
    about: '',
    avatarPath: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
    gallery: [
      {
        id: 'pa-2',
        poster: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
        src: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2020/01/The-Mandalorian-images.jpg',
        type: 'image'
      }
    ],
    id: 'uid-kirill',
    lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
    name: 'Kirill',
    num: '00000002',
    status: {
      code: 'is-online',
      description: null,
      title: 'Last visit information (by default)'
    },
    type: 'person',
    ver: '1'
  },
  {
    about: '',
    avatarPath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
    gallery: [
      {
        id: 'pa-3',
        poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ10q8ECXKHgjh4d3WsPMLu6Vqze0de1uKj3A&usqp=CAU',
        type: 'image'
      }
    ],
    id: 'uid-roman',
    lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
    name: 'Roman',
    num: '00000003',
    status: {
      code: 'is-online',
      description: null,
      title: 'Last visit information (by default)'
    },
    type: 'person',
    ver: '1'
  },
  {
    about: '',
    avatarPath: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
    gallery: [
      {
        id: 'pa-4',
        poster: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
        src: 'https://media.distractify.com/brand-img/1VXhZySEN/480x252/kuill-the-mandalorian-cover-1573670671074.jpg',
        type: 'image'
      }
    ],
    id: 'uid-alexey',
    lastSeen: new Date().getTime() - Math.floor(Math.random() * 1000000),
    name: 'Alexey',
    num: '00000004',
    status: {
      code: 'is-online',
      description: null,
      title: 'Last visit information (by default)'
    },
    type: 'person',
    ver: '1'
  }
]

module.exports = usersData
