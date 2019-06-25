import axios from 'axios'

export const register = newUser => {
    return axios
        .post('users/register', {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password
        })
        .then(res => {
            console.log("Registered")
        })
}


export const login = user => {
    return axios
        .post('users/login', {
            email: user.email,
            password: user.password
        })
        .then(res => {
            console.log(res);//test
            localStorage.setItem('usertoken', res.data.token)
            localStorage.setItem('id', res.data.primary_k);
            return res.data.token
        })
        .catch(err => {
            console.log(err);
        })
}