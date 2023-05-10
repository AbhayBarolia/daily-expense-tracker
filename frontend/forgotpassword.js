async function forgotPassword(e){
    e.preventDefault();
    let email = document.getElementById("email").value;
  
   if(email == ""){
        alert("Enter email address");
    }
    else{
        let user = {
            email: email,
        }
       resetPassword(user);
    }
}


async function resetPassword(user){
    const res= await axios.post("http://3.16.152.73:3000/user/resetpassword",user);   
    alert(res.data.message);    
    if(res.status==200){   
    window.location.href = "/login.html";}
}