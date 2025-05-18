let systolic = sessionStorage.getItem("systolic");
let diastolic = sessionStorage.getItem("diastolic");
let sugar = sessionStorage.getItem("sugar")

document.getElementById("sys").innerHTML=systolic
document.getElementById("dis").innerHTML=diastolic
document.getElementById("sugar-status-text").innerHTML=sugar

let nextPeriod = sessionStorage.getItem("next")
let start= sessionStorage.getItem("start")
let end = sessionStorage.getItem("end")

document.getElementById("nextPeriod").innerHTML=nextPeriod 
document.getElementById("ovulationWindow").innerHTML=`${start}  ${end} `

