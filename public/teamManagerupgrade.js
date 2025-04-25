const assignment=[];

function addRole()
{
    let HTML=document.querySelector('.mcard').innerHTML;
    const name=document.getElementById('name-input').value;
    const role=document.getElementById('role-input').value;
    assignment.push({
        name:name,
        role:role
    })
    let max=200;
    let min=0;
    let width=(Math.random() * (max - min)) + min
    assignment.forEach((item)=>{
        HTML += `<div style="flex:1;border:1px solid black;margin:4px 8px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:white;box-sizing:border-box;padding:10px;">
            <p>Name : ${item.name}</p>
            <p>Role : ${item.role}</p>
            <div style="display:flex;flex-direction:row;width:200px;height:22px;border:1px solid black;margin:20px 0;box-sizing:border-box;" class="container">
                    <div style="background-color:rgb(77, 238, 112);width:${width}px;height:19px;"></div>
                    <div style="flex:1;"></div>
                    </div>
             </div>`;
    })
    document.querySelector('.mcard').innerHTML=HTML;
    console.log('works');
    document.getElementById('name-input').value="";
    document.getElementById('role-input').value="";
}//class mcard ko badlo aur waha ka main writing ko