let userName;
let premium = false;

window.addEventListener("DOMContentLoaded", (event) => {  
    if(localStorage.getItem("token")){
    getUser();     
    }
    else
    {
        window.location.href = "/frontend/views/login.html";
    }
    });



async function getUser() {
    try{
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/premium/getuser",config);
        if(res!=undefined) {
        userName = res.data.userName;
        premium = res.data.premium;
        document.getElementById("account").innerHTML = userName;
        if(premium) {
            document.getElementById("premium").innerHTML = "Premium Membership";
        }
        }

}
    catch(error){
        console.log(error);
    }}

    async function processPayment(event){
    event.preventDefault();

     commitPayment(event);
};


async function commitPayment(e) {
 try{
    const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
    const res = await axios.get("http://localhost:3000/premium/payment", config);

    if(res!=undefined) {
        var options = {
            "key": res.data.key_id,
            "order_id":res.data.order.orderId,
            "handler": async function (response) {
                await axios.post("http://localhost:3000/premium/updatepaymentstatus",{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id},
                    config);

                    alert("You are a premium user now");
                    window.location.href = "http://127.0.0.1:5500/frontend/views/expense.html";
                }
            }
            const rzpay= new Razorpay(options);
            rzpay.open();
            e.preventDefault();
    
            rzpay.on('payment.failed', function(failed_response){
                console.log(failed_response);
                alert("Something went wrong, please try again later");
            })
        }
       
    }   
 catch(error){
    console.log("Encountered the error "+error);   
}
}