var endDate = document.querySelector('#end');
var currentDate = new Date(Date.now()).toISOString();

endDate.value = currentDate.substring(0,10);
endDate.max = currentDate.substring(0,10);