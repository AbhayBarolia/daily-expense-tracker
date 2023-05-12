window.addEventListener("DOMContentLoaded", (event) => {  
    localStorage.removeItem("token");
    localStorage.removeItem("offSet");
    });

    window.addEventListener("submit", (e)=>{
        e.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        
        
        if(email == "" || password == ""){
            alert("All fields are required");
        }
        else{
            let user = {
                email: email,
                password: password
            }
            loginUser(user);
        }
      });



async function loginUser(user){
    const res= await axios.post("http://18.119.162.42 :3000/user/login",user);   
    alert(res.data.message);    
    if(res.status==200){
        localStorage.setItem("token",res.data.token);
    window.location.href = "/expense.html";}
}