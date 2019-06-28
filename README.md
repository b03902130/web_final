# Midterm Project - login system 

## Name

a loging system can be implemented to any kind of application...(實在沒有特別想做的東西...)

## Installation
### local install
1. install postgres (download link: https://postgresapp.com/, and follow the install steps)
> after install postgres database, use **terminal** to implement the following commands

(1) login to database
```
psql -h localhost
```
(2) create table
```
create table users (id serial primary key, first_name text, last_name text, email text, password text, created text);
```
2. normal process to start the web

(1) download the dependencies
```
npm install
```
(2) run the web server (express)
```
npm run dev
```
(3) start the react app
```
cd client/
npm start
```
you will see the page showing at localhost:3000! ***I also use the proxy***
## how to use
1. Sign up/in for the login system
2. if you not yet register for a new account or type wrong password, it will show error
3. if succeed to login, you will see your profile info
## frameworks / node packages / Reference
#### frameworks
1. React, React-router
2. Express
3. bootstrap 4
#### node packages (只提這次實作覺得很酷的)
1. axios
2. bcryptjs
3. jsonwebtoken
4. sequelize
#### reference
1. ***基本上純手刻，只有看網路上若要做這類登入系統需要哪些東西***
## Contribution
1. Client-side programs in React.js
2. Server-side programs in Node.js
## Review
因為實在想不到自己想做的東西，所以把所有時間都花在看 login system 怎麼做才能做得比較好 (密碼加密，token 之類的東西)。此次的 midterm-project 看了滿多新的 package 也有滿深入的去看每個 package 的使用方式，這是我覺得是收穫最多的部分。當時只是想說反正都要 deploy 到 heroku，就也去嘗試了沒用過的 postgre database (heroku default 的 database)，其實跟 mysql 差不多，不過經過研究後我個人覺得稍微比 mysql 直觀且更好用。
