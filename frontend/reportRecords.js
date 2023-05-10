const list = document.getElementById('list');

window.addEventListener("DOMContentLoaded", (event) => {  
    
    if(localStorage.getItem("token")){
        getReportRecords(); 
        }
        else
        {
            window.location.href = "/login.html";
        }
    });

    async function getReportRecords(){
        try{
            const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
            const res = await axios.get("http://3.16.152.73:3000/expense/reportrecords",config);
            
            for(let i =0; i<res.data.fr.length;i++)
            {   
                let str =res.data.fr[i].fileLink;
    
                showData(str,i+1);
            }

        }
        catch(err){
            alert("Error: " + err);
        }
    }

    function showData(str,i)
    {
     
        let li=document.createElement("li");  

        let a= document.createElement("a");
        a.setAttribute("id","fl");
        a.href=str;
   
        a.appendChild(document.createTextNode("File "+i));
        
        let hr= document.createElement("hr"); 

        
        li.appendChild(a);
        li.appendChild(hr);
        list.appendChild(li);
        
           
    }