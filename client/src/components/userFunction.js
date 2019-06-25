import axios from 'axios'
import jwt from 'jwt-simple'

export const register = newUser => {
    let data = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password
    }

    if (window.configs.usedb) {
        window.database.users.push(data)
        return new Promise((resolve, reject) => {resolve(0)})
    } else {
        return axios
            .post('users/register', data)
            .then(res => {
                console.log("Registered")
            })
    }
}


export const login = user => {
    let data = {        
        email: user.email,
        password: user.password
    }

    if (window.configs.usedb) {
        // always serve the first user in pseudo database without checking email and passwd
        let user = window.database.users[0]

        let token = jwt.encode({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email 
        }, 'secret')
        localStorage.setItem('usertoken', token)
        localStorage.setItem('id', user.primary_k);
        return new Promise((resolve, reject) => {resolve(token)})
    }
    else {
        return axios
            .post('users/login', data)
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
}

