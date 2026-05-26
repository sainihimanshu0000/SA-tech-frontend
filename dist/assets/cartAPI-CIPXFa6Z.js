import{A as t}from"./index-DVJSkLTs.js";const o=async()=>(await t.get("/cart")).data,n=async(a,s=1)=>(await t.post("/cart",{productId:a,quantity:s})).data;export{n as a,o as g};
