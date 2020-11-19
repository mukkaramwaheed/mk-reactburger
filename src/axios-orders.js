import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://angularbasic-8649d.firebaseio.com/'
});

export default instance;