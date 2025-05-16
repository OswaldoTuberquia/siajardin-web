import CryptoJS from "crypto-js";

export function getCurrentYear(){
    return new Date().getFullYear();
}

export function encryptAES(textPlain, key){
    return CryptoJS.AES.encrypt(textPlain,key).toString();
}

export function decryptAES(textEncrypted, key){
    return CryptoJS.AES.decrypt(textEncrypted,key).toString(CryptoJS.enc.Utf8);
}

export function convertSha512(textPlain, key){
    return CryptoJS.HmacSHA512(textPlain,key).toString(CryptoJS.enc.Hex);
}

