let ll = [];
let list=document.getElementById("list");
let leaderList = document.getElementById('premium-list');

let userName;
let premium;

list.addEventListener("click", removeItem);


window.addEventListener("DOMContentLoaded", (event) => {  
  premium=false;
  getUser();  
  getData();   
  });



async function getUser() {
    try{
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/expense/getuser",config);
        if(res!=undefined) {
        userName = res.data.userName;
        premium = res.data.premium;
        document.getElementById("account").innerHTML = userName;
        if(premium===true) {
            await getPremiumData();

        }
    }
}
    catch(error){
        console.log(error);
    }}

async function getPremiumData(){
    try{

            let premiumMessage=document.getElementById("premium")
            premiumMessage.innerHTML = "Premium Membership";
            let list = document.getElementById("nav-header-list");
            let li = document.getElementById('buypremium');
            list.removeChild(li);
            let report = document.createElement("li");
            report.setAttribute("class","btn");
            report.setAttribute("type","button");
            report.setAttribute("id","report");
            report.appendChild(document.createTextNode("Download Expense Report"));
            premiumMessage.appendChild(report);

            var getReport= document.getElementById('report');
            getReport.addEventListener("click",generateReport);

            const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
            let premiumListData= await axios.get("http://localhost:3000/expense/getpremiumlist",config);
            let premiumList = document.getElementById('premium-list');
            let listMessage= document.getElementById('premium-list-message');
            premiumList.removeChild(listMessage);
            for(let i =0; i< premiumListData.data.length;i++)
            {
                let str= `Name: ${premiumListData.data[i].userName} Total Expense: ${premiumListData.data[i].totalExpense}`;
                showPremiumList(str);
            }

        }
        catch(error){
            console.log(error);
        }
}


    

 async function getData(){
    try{
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/expense/getexpense",config);
    for(let i =0; i< res.data.length;i++)
    {
        let str =`Expense: ${res.data[i].expenseName}  Amount: ${res.data[i].amount} Category: ${res.data[i].category} `
        showData(str,res.data[i].id);
    }

    }
    catch(error){
        console.log(error);
    }

}


window.addEventListener("submit", (event)=>{
    event.preventDefault();
    
     let obj= {
         expenseName:document.getElementById('expenseName').value,
         amount:document.getElementById('amount').value,
         category:document.getElementById('category').value
     };
     sendData(obj).then(()=>{getData();});

  });



async function sendData(obj){
    try{
    const res = await axios.post("http://localhost:3000/expense/addexpense",obj); 
    return;

    }
    catch(error){
        console.log(error);
    }

}



async function removeItem(e)
    { try{
        if(e.target.classList.contains("btn"))
    {
        if(confirm("Do you want to delete this expense"))
        {
            let li=e.target.parentElement;
            let id = li.getAttribute("id");
        
            let res= await axios.delete("http://localhost:3000/expense/delete/"+id);
            if(res.status==200){
                let index = ll.indexOf(id);
                if (index !== -1) {
                ll.splice(index, 1);
                }
            list.removeChild(li);   
            }
            else{
                alert("Something went wrong, please try again");
            } 
        }

    }
}
catch(err){
    console.log(err);
}
    }




async function generateReport(){
    try{
        console.log("Generating Report");
    const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
    let reportGen= await axios.get("http://localhost:3000/expense/report",config);
    if(reportGen.status==200)
    {
     alert("Report is downloading");   
    }
    else{
        alert("Something went wrong, please try again");
    }
}
catch(err){
    console.log(err);
}
}



function showData(str,id)
    {
        if(ll.indexOf(id)==-1)
        {
        ll.push(id);
        let li=document.createElement("li");  
        li.setAttribute("id",id);    
        li.appendChild(document.createTextNode(str));

        let btn1=document.createElement("Delete");
        btn1.className="delbtn";
        btn1.setAttribute("type","button");
        btn1.appendChild(document.createTextNode("Delete")); 
        li.appendChild(btn1);

        list.appendChild(li);
        }   
    }

    function showPremiumList(str)
    {
        let li=document.createElement("li");      
        li.appendChild(document.createTextNode(str));
        leaderList.appendChild(li);
    }    