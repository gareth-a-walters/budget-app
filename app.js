//BUDGET CONTROLLER
let budgetController = (function(){

    //some code

})();

//UI CONTROLLER 
let UIController = (function(){

    //some code

});

//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    let ctrlAddItem = function(){
        //1. Get field input data
        //2. Add item to budget controller
        //3. Add item to UI
        //4. Calcualte the budget
        //5. Display budget on UI   
        console.log('working');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            event.preventDefault(); // prevents the enter key from also triggering a click event
            ctrlAddItem();
        }
    })

})(budgetController, UIController);
