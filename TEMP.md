# [107-2] Web Programming Final Project
# (Group 10) 甩肉大作戰

## Introduction
身為一個不太出門的人，寫個可以在家運動的遊戲也是合情合理的。
我們做了一個賽跑遊戲，觸發你的跑者往前跑的機制是透過camera計算你擺動幅度來判斷前進的距離，其中我們也提供註冊、登錄、以及奔跑時間排行榜的功能。

GitHub： https://github.com/b03902130/web_final</br>
Demo影片連結：https://youtu.be/</br>
Deploy連結：https://motionrun.herokuapp.com/</br>

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

## Function
### 註冊
判斷輸入帳號是否存在於db中，若不存在則能夠註冊帳號，若存在則回覆帳號已存在的alert訊息。
### 登錄
判斷輸入帳號是否存在於db且輸入密碼是否吻合資料比對，若條件不達成則回傳不合法alert訊息，合法則能登錄進到遊戲大廳。
### 開房間、進入房間、等待遊戲、中場離開
前後端會溝通去紀錄使用者目前的狀態，讓前後端針對使用者的訊息保持一致。
### 遊戲互動
透過camera感測影像，利用image processing的技術做到real time的motion detection，透過計算兩個時間點灰度值不一樣的pixel數量去驅動跑者前進直至跑者抵達終點。
### 排行榜
後端會紀錄每個會員的最佳紀錄並針對紀錄做排名，公告在遊戲大廳當中。

## Framework、Module、Source
gif source：https://giphy.com/explore/reaction-speed?fbclid=IwAR34JC9L-D4w8vUNOfUjptjcfLQn8CuWjB_woFaNkNHCYMxTc8aAotuA9zc
web-camera：https://www.npmjs.com/package/react-webcam
react-rebound：https://www.npmjs.com/package/react-rebound
materialUI：https://material-ui.com/

## Tools、Databse
backend: axios, bcryptjs, jsonwebtoken, sequelize
frontend: React, React-router, bootstrap, express
db: PostgreSQL
deployment: heroku

## Specializations
李吉昌：前端影像處理、動畫設置、文書處理、demo影片拍攝。</br>
楊書文：前後端整體架構設計、前端介面設計、前後端連接、程式碼錯誤校正。</br>
胡均綸：後端運作設計、前後端連接、程式碼錯誤校正。</br>

## Thoughts
李吉昌：</br>
自己實際上負責的部份loading較輕，很感謝另外兩位大神大力凱瑞，這次是一個很愉快的合作經驗，當出發想的時候就覺得一定要想一個很好笑的遊戲，本來是打算設計成手指運動來對應跑者的前進的，但後來礙於js矩陣運算找不到python有numpy類似的加速工具支援，加上辨識會有正確率的問題，容易被燈光或是背景給干擾，所以就變成motion detection了，想不到實際上玩起來羞恥度大幅提升，我們在咖啡廳試玩的時候店員跑過來關切，大家可以試玩看看，保證揮汗如雨喔！</br>
楊書文：</br>
胡均綸：</br>
