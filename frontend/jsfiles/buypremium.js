let userName;


window.addEventListener("DOMContentLoaded", (event) => {  
    getUser();     
    });



async function getUser() {
    try{
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/premium/getuser",config);
        if(res!=undefined) {
            console.log(res.data.userName);
        userName = res.data.userName;
        document.getElementById("account").innerHTML = userName;
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
            "order_id":res.data.order.id,
            "handler": async function (response) {
                
                await axios.post("http://localhost:3000/premium/updatepaymentstatus",{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id},config);

                    alert("You are a premium user now");
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