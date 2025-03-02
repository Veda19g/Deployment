import axios from 'axios'
import Cookies from 'js-cookie';


export const  signup=async (user)=>{

try{
    console.log("user",user);
    const response=await axios.post("http://localhost:8000/api/v1/user/create",user,{
        withCredentials:true,
    }  );
    console.log("response",response);


    if(response.headers['set-cookie']){
        
        const cookiesFromResponse = response.headers['set-cookie'];

        cookiesFromResponse.forEach(cookie => {
            const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
            Cookies.set(cookieName,cookieValue,{path:"/",sameSite:"None",secure:true});
        });
          }
          console.log("signup response",response);

          if(response)return {status:true,user:response.data.user};
}
catch(err){
    console.log("error in ",err);
    return {status:false};
}

}


export const login=async(user)=>{
    try {
        console.log("user",user);
    const response = await axios.post("http://localhost:8000/api/v1/user/login", 
    user ,
    {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    }
);

// Check if the response contains cookies
if (response.headers['set-cookie']) {
   // Extract the cookies from the response headers
   const cookiesFromResponse = response.headers['set-cookie'];
   // Set the cookies on the client side
   cookiesFromResponse.forEach(cookie => {
       const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
       Cookies.set(cookieName, cookieValue, { path: '/' , sameSite: 'None', secure: true });
   });
}

console.log(response);

return { status: true, user: response.data.existingUser };
} catch (error) {
console.log("error logging in", error);
alert(error)
return {status : false };
}
}