async function resetPassword(e){
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2= document.getElementById("password2").value;
  
   if(email == ""||password == "" || password2 == ""){
        alert("All fields are required");
    }
    else if(password!= password2){
        alert("Passwords do not match");
    }
    else{
        let user = {
            email: email,
            password:password
        }
       newPassword(user);
    }
}


async function newPassword(user){
    const res= await axios.post("http://localhost:3000/user/newpassword",user);   
    alert(res.data.message);    
    if(res.status==200){   
    window.location.href = "/frontend/views/login.html";}
}