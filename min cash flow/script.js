// Implementing a binary Heap(a max Heap)
class maxHeap{
    constructor(){
        this.arr=[];
    }

    push(val){
        this.arr.push(val);
        this.heapify();
    }

    pop(){
        let last=this.arr.pop();

        if(this.arr.length===0){
            return last;
        }

        let first=this.arr[0];
        this.arr[0]=last;

        let n=this.arr.length;

        let i=0;
        while(i<n){
            let left=-1;
            let right=-1;
            let cur=this.arr[i];

            if(2*i + 1 >= n) break;

            left=this.arr[2*i + 1];
            
            if(2*i + 2 < n) right=this.arr[2*i + 2];

            if(right!==-1){
                if(left[0]>right[0]){
                    if(left[0]>cur[0]){
                        this.arr[i]=left;
                        this.arr[2*i + 1]=cur;
    
                        i=2*i + 1;
                    }
                    else break;
                }
                else{
                    if(right[0]>cur[0]){
                        this.arr[i]=right;
                        this.arr[2*i + 2]=cur;
    
                        i=2*i + 2;
                    }
                    else break;
                }
            }
            else{
                // only left
                if(left[0]>cur[0]){
                    this.arr[i]=left;
                    this.arr[2*i + 1]=cur;

                    i=2*i + 1;
                }
                else break;
            }
        }

        return first;
    }

    size(){
        return this.arr.length;
    }

    empty(){
        return (this.arr.length===0);
    }

    heapify(){
        let n=this.arr.length;
        let i=n-1;
        while(i>0){
            let par=Math.floor((i-1)/2);
            if(this.arr[i][0]>this.arr[par][0]){
                let temp=this.arr[par];
                this.arr[par]=this.arr[i];
                this.arr[i]=temp;

                i=par;
            }
            else{
                break;
            }
        }
    }
}
//////////////////////////////////////////////////////////////////////////

let addcnt=0; //count of number of input entries.

//This function adds elements in the input section on click of a button
function appendElements(){
    if(addcnt>=100){
        // max 100 elements allowed
        alert("100 connections Limit Reached!");
        return;
    }
    addcnt++;
    let contDiv=document.createElement("div");

    let person1=document.createElement("input");person1.setAttribute("placeholder","Person-1");person1.setAttribute("type","text"); person1.style.margin="10px"; person1.setAttribute("id","u"+addcnt);

    let person2=document.createElement("input");person2.setAttribute("placeholder","Person-2");person2.setAttribute("type","text"); person2.style.margin="10px"; person2.setAttribute("id","v"+addcnt);

    let amnt=document.createElement("input");amnt.setAttribute("placeholder","Amount 1-2");amnt.setAttribute("type","numeric"); amnt.style.margin="10px";amnt.setAttribute("id","w"+addcnt);

    let slno=document.createElement("p");
    slno.innerHTML=addcnt+".";
    contDiv.appendChild(slno);contDiv.appendChild(person1); contDiv.appendChild(person2);contDiv.appendChild(amnt); contDiv.style.display="flex"; contDiv.style.flexDirection="row"; contDiv.style.justifyContent="center"; contDiv.setAttribute("class",addcnt);
    let inputDiv=document.getElementById("fields");
    inputDiv.appendChild(contDiv);
}


// This function removes the last input elements on click of a button
function popElements(){
    let prev=addcnt;
    let ds=document.getElementsByClassName(prev);
    while(ds[0]){
        ds[0].parentNode.removeChild(ds[0]);
    }
    addcnt--;
}


//This function solves the problem and generates the graph/network
function solve(){
    let personNet=new Map();    //a map to store person names and his net credit/debit

    /////////// Taking input //////////////
    for(let i=1;i<=addcnt;i++){
        let u=document.getElementById("u"+i);
        let v=document.getElementById("v"+i);
        let w=document.getElementById("w"+i);
        
        let person1=u.value;
        let person2=v.value;
        let val=w.value;

        let amnt=parseFloat(val);

        if(isNaN(amnt)){
            alert("Amount in input no." + i + " is invalid");
            return;
        }

        if(personNet.has(person1)){
            let net=personNet.get(person1);
            net-=amnt;
            personNet.set(person1,net);
        }
        else{
            personNet.set(person1,-1*amnt);
        }
        
        if(personNet.has(person2)){
            let net=personNet.get(person2);
            net+=amnt;
            personNet.set(person2,net);
        }
        else{
            personNet.set(person2,amnt);
        }
    }


    let nodes=[];               // stores persons as nodes
    let personIdx=new Map();  // stores an index value corresponding to a person
    let pos=new maxHeap();   // A max heap which store all those person who have net gain
    let neg=new maxHeap();   // A max heap which store all those person who have net loss.

    let getEntries=personNet.entries();

    let idx=1;
    for(let e of getEntries){
        nodes.push({id:idx, label:e[0]});
        personIdx.set(e[0],idx);
        idx++;

        if(e[1]>0){
            pos.push([e[1],e[0]]);
        }
        else if(e[1]<0){
            neg.push([-1*e[1],e[0]]);
        }
    }

    let edges=[];       //stores connections between person

    // Greedy algorithm for finding minimum cashflow
    while(!pos.empty() && !neg.empty()){
        let debiter=neg.pop();
        let crediter=pos.pop();

        let amnt=Math.min(debiter[0],crediter[0]);

        debiter[0]-=amnt; crediter[0]-=amnt;

        if(debiter[0]>0) neg.push(debiter);
        if(crediter[0]>0) pos.push(crediter);

        let i=personIdx.get(debiter[1]);
        let j=personIdx.get(crediter[1]);

        edges.push({from:i, to:j, label:String(amnt.toFixed(2))});
    }


    // Using vis.js for generating graph/network
    var Nodes=new vis.DataSet(nodes);
    var Edges=new vis.DataSet(edges);

    var container = document.getElementById('container');

    var data = {
        nodes: Nodes,
        edges: Edges
    };
    var options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 18
            }
        },
        nodes:{
            font:{
                size:18
            },
            shape:'image',
            image:"https://img.icons8.com/officel/80/undefined/person-male.png"
        }
    }

    var network = new vis.Network(container, data, options);

}


// This functions resets all inputs on click of a button
function reset(){
    for(let i=1;i<=addcnt;i++){
        let ds=document.getElementsByClassName(i);
        while(ds[0]){
            ds[0].parentNode.removeChild(ds[0]);
        }
    }
    addcnt=0;
}

let addbtn=document.getElementById("addBtn");
addbtn.addEventListener("click",appendElements);

let rmvbtn=document.getElementById("removeBtn");
rmvbtn.addEventListener("click",popElements);

let solvebtn=document.getElementById("solveBtn");
solvebtn.addEventListener("click",solve);

let resetBtn=document.getElementById("resetBtn");
resetBtn.addEventListener("click",reset);