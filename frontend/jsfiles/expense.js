let ll = [];
let list=document.getElementById("list");
let userName;

list.addEventListener("click", removeItem);


window.addEventListener("DOMContentLoaded", (event) => {  
  getUser();  
  getData();   
  });


async function getUser() {
    try{
        const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
        const res = await axios.get("http://localhost:3000/expense/getuser",config);
        if(res!=undefined) {
            console.log(res.data.userName);
        userName = res.data.userName;
        document.getElementById("account").innerHTML = userName;
        }

}
    catch(error){
        console.log(error);
    }}


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



function showData(str,id)
    {
        if(ll.indexOf(id)==-1)
        {
        ll.push(id);
        let li=document.createElement("li");  
        li.setAttribute("id",id);    
        li.appendChild(document.createTextNode(str));

        let btn1=document.createElement("Delete");
        btn1.className="btn";
        btn1.setAttribute("type","button");
        btn1.appendChild(document.createTextNode("Delete")); 
        li.appendChild(btn1);

        list.appendChild(li);
        }   
    }