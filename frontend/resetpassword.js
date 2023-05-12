
window.addEventListener("submit", (event)=>{
    event.preventDefault();
    if(event.target.className==="form"){
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
  });

async function resetPassword(e){
    
}


async function newPassword(user){
    const res= await axios.post("http://18.119.162.42 :3000/user/newpassword",user);   
    alert(res.data.message);    
    if(res.status==200){   
    window.location.href = "/login.html";}
}