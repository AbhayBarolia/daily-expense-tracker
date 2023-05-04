let list=document.getElementById("list");
let nav=document.getElementById('pages');
let leaderList = document.getElementById('premium-list');

let userName;
let premium;
let pageCount=1;
let offSet;
if(localStorage.getItem("offSet"))
{
offSet = localStorage.getItem("offSet");
}
else
{
    offSet=2;
}


list.addEventListener("click", removeItem);
nav.addEventListener("click",switchPage);


window.addEventListener("DOMContentLoaded", (event) => {  
  premium=false;
  getUser();  
  getData(pageCount,offSet);   
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
            report.appendChild(document.createTextNode(" Download Expense Report "));
            premiumMessage.appendChild(report);

            var getReport= document.getElementById('report');
            getReport.addEventListener("click",generateReport);

            let reportRecords = document.createElement("li");
            reportRecords.setAttribute("class","recbtn");
            reportRecords.setAttribute("type","button");
            reportRecords.setAttribute("id","reportRecords");
            reportRecords.appendChild(document.createTextNode("Download Previous Reports"));
            premiumMessage.appendChild(reportRecords);

            var getRecords= document.getElementById('reportRecords');
            getRecords.addEventListener("click",getReportRecords);

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


    

 async function getData(page,offset){
    try{
        while(list.hasChildNodes()) {
            list.removeChild(list.firstChild);
          }
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/expense/getexpense/"+page+"/"+offset,config);
        console.log(res);
        console.log("params:"+page+" "+offset);
        for(let i =0; i< res.data.expense.length;i++)
        {   
            
            let str =`Expense: ${res.data.expense[i].expenseName}  Amount: ${res.data.expense[i].amount} Category: ${res.data.expense[i].category} `
            
            showData(str,res.data.expense[i].id);
        }   

        pagination(page, Number(res.data.totalPages));
    
    }
    catch(error){
        console.log(error);
    }
}


window.addEventListener("submit", (event)=>{
    if(event.target.className==="form"){
    event.preventDefault();
     let obj= {
         expenseName:document.getElementById('expenseName').value,
         amount:document.getElementById('amount').value,
         category:document.getElementById('category').value
     };
     sendData(obj).then(()=>{getData(pageCount,offSet);});
    }
  });


window.addEventListener("submit", (event)=>{
    if(event.target.className==="form1"){
    event.preventDefault();
    let newoffSet=Number(document.getElementById("recordnumber").value);
    localStorage.setItem('offSet',newoffSet);
    getData(pageCount,newoffSet);
    }
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
        if(e.target.classList.contains("delbtn"))
    {
        if(confirm("Do you want to delete this expense"))
        {
            let li=e.target.parentElement;
            let id = li.getAttribute("id");
        
            let res= await axios.delete("http://localhost:3000/expense/delete/"+id);
            if(res.status==200){
                
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
     var a = document.createElement('a');
     a.href= reportGen.data.fileURL;
     a.download= 'myexpense.csv';
     a.click();
    }
    else{
        alert("Something went wrong, please try again");
    }

    
}
catch(err){
    console.log(err);
    alert("Something went wrong, please try again");
}
}



async function getReportRecords(){

    console.log("Records");
    window.location.href = "/frontend/views/reportRecords.html";

}



function showData(str,id)
    {
        
        
        let li=document.createElement("li");  
        li.setAttribute("id",id);    
        li.appendChild(document.createTextNode(str));
        
        let hr= document.createElement("hr"); 

        let btn1=document.createElement("Delete");
        btn1.className="delbtn";
        btn1.setAttribute("type","button");
        btn1.appendChild(document.createTextNode("Delete")); 
        li.appendChild(btn1);
        li.appendChild(hr);
        list.appendChild(li);
        
         
    }

    function showPremiumList(str)
    {
        let li=document.createElement("li");      
        li.appendChild(document.createTextNode(str));

        let hr= document.createElement("hr"); 

        leaderList.appendChild(li);
        leaderList.appendChild(hr);
    }    


    async function pagination(currentPage, totalPages){
        let i=Number(currentPage);
        while(nav.hasChildNodes()) {
            nav.removeChild(nav.firstChild);
          }
        if(i==1)
        {
            for(let j=1;j<4;j++){
                let navbtn = document.createElement('navelem');
                navbtn.setAttribute("type","button");
                navbtn.setAttribute("id",j);
                if(j==i){
                    navbtn.setAttribute("class","currentnavbtn");
                }
                else
                {
                    navbtn.setAttribute("class","navbtn");
                }
                navbtn.appendChild(document.createTextNode(j));
                nav.appendChild(navbtn);
            }
        }
        else if(i>1&&i<totalPages)
        {   let start = i-1;
            let end= i+1;
            for(let j=start;j<end+1; j++){
                let navbtn = document.createElement('navelm');
                navbtn.setAttribute("type","button");
                navbtn.setAttribute("id",j);
                if(j==i){
                    navbtn.setAttribute("class","currentnavbtn");
                }
                else
                {
                    navbtn.setAttribute("class","navbtn");
                }
                navbtn.appendChild(document.createTextNode(j));
                nav.appendChild(navbtn);
            }
        }
        else 
        {
            for(let j=i-2;j<=i;j++){
                let navbtn = document.createElement('navelem');
                navbtn.setAttribute("type","button");
                navbtn.setAttribute("id",j);
                if(j==i){
                    navbtn.setAttribute("class","currentnavbtn");
                }
                else
                {
                    navbtn.setAttribute("class","navbtn");
                }
                navbtn.appendChild(document.createTextNode(j));
                nav.appendChild(navbtn);
            }
        }
    }

    async function switchPage(e){
        if(e.target.classList.contains("navbtn"))
        {
            let li=e.target;
            let nextPage=li.getAttribute("id");
            getData(nextPage,offSet);
        }
    }